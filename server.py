"""
KAJU BAZAAR - Luxury Wholesale Cashew Stock & Bulk Order Management Server
Python 3 HTTP Server with SQLite REST API
"""

import http.server
import socketserver
import os
import sys
import json
import urllib.parse
from datetime import datetime, timedelta
import sqlite3
import mimetypes

# Fix UTF-8 for Windows console
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DIRECTORY, "cashew_wholesale.db")

from database import init_db, get_db_connection

class CashewAPIHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, data, status=200):
        response_bytes = json.dumps(data, default=str).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def parse_json_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            return {}
        body = self.rfile.read(content_length).decode('utf-8')
        try:
            return json.loads(body)
        except Exception:
            return {}

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        if path.startswith('/api/'):
            self.handle_api_get(path, query)
        else:
            # Fallback to serving static files
            if path == '/' or path == '':
                self.path = '/index.html'
            super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path.startswith('/api/'):
            body = self.parse_json_body()
            self.handle_api_post(path, body)
        else:
            self.send_error(404, "Endpoint not found")

    def handle_api_get(self, path, query):
        conn = get_db_connection()
        today_str = datetime.now().strftime("%Y-%m-%d")

        try:
            if path == '/api/status':
                self.send_json({
                    "status": "online",
                    "system": "Royal Anacardium Wholesale Stock Engine",
                    "today": today_str,
                    "coordinator_phone": "+919845082190",
                    "coordinator_display": "+91 98450 82190"
                })

            elif path == '/api/overview':
                cursor = conn.cursor()
                # Aggregated available stock today across all approved vendors
                cursor.execute("""
                    SELECT COALESCE(SUM(ds.quantity_tons), 0) as total_tons
                    FROM daily_stock ds
                    JOIN vendors v ON ds.vendor_id = v.id
                    WHERE ds.stock_date = ? AND v.approval_status = 'approved'
                """, (today_str,))
                row = cursor.fetchone()
                total_tons = float(row['total_tons']) if row else 0.0

                # Active approved vendors
                cursor.execute("SELECT COUNT(*) as cnt FROM vendors WHERE approval_status = 'approved'")
                active_vendors_count = cursor.fetchone()['cnt']

                # Active varieties
                cursor.execute("SELECT COUNT(*) as cnt FROM varieties WHERE status = 'active'")
                active_varieties_count = cursor.fetchone()['cnt']

                # Total locked quantity today
                cursor.execute("""
                    SELECT COALESCE(SUM(locked_quantity), 0) as total_locked
                    FROM stock_locks
                    WHERE stock_date = ?
                """, (today_str,))
                locked_today = float(cursor.fetchone()['total_locked'])

                # Varieties list with today's stock and vendor count
                cursor.execute("""
                    SELECT 
                        v.id, v.code, v.name, v.grade_spec, v.count_per_lb, v.moisture_spec, v.image, v.description, v.status,
                        COALESCE(SUM(ds.quantity_tons), 0) as available_tons,
                        COUNT(DISTINCT ds.vendor_id) as vendor_count
                    FROM varieties v
                    LEFT JOIN daily_stock ds ON v.id = ds.variety_id AND ds.stock_date = ?
                    LEFT JOIN vendors vn ON ds.vendor_id = vn.id AND vn.approval_status = 'approved'
                    WHERE v.status = 'active'
                    GROUP BY v.id
                    ORDER BY v.id ASC
                """, (today_str,))
                varieties_rows = cursor.fetchall()
                varieties_list = [dict(r) for r in varieties_rows]

                # Weekly stock history (Last 7 days)
                # Formatted Mon-Sun or day names
                history_7_days = []
                days_order = [6, 5, 4, 3, 2, 1, 0]
                day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Today"]
                
                # Fetch distinct dates
                for idx, days_ago in enumerate(days_order):
                    h_date = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")
                    day_label = "Today" if days_ago == 0 else (datetime.now() - timedelta(days=days_ago)).strftime("%A")
                    cursor.execute("""
                        SELECT COALESCE(SUM(ds.quantity_tons), 0) as day_tons
                        FROM daily_stock ds
                        JOIN vendors v ON ds.vendor_id = v.id
                        WHERE ds.stock_date = ? AND v.approval_status = 'approved'
                    """, (h_date,))
                    d_row = cursor.fetchone()
                    d_tons = float(d_row['day_tons']) if d_row else 0.0
                    history_7_days.append({
                        "day": day_label,
                        "date": h_date,
                        "tons": round(d_tons, 1)
                    })

                # Wholesale activity summary
                cursor.execute("SELECT COALESCE(SUM(requested_quantity), 0) as req, COALESCE(SUM(confirmed_quantity), 0) as conf, COALESCE(SUM(locked_quantity), 0) as locked FROM bulk_orders")
                ord_agg = cursor.fetchone()

                cursor.execute("SELECT COALESCE(SUM(confirmed_quantity), 0) as deliv FROM bulk_orders WHERE delivery_status = 'Delivered'")
                deliv_agg = cursor.fetchone()

                wholesale_activity = {
                    "requested_tons": float(ord_agg['req']) if ord_agg else 580.0,
                    "confirmed_tons": float(ord_agg['conf']) if ord_agg else 430.0,
                    "locked_tons": max(locked_today, float(ord_agg['locked']) if ord_agg else 390.0),
                    "delivered_tons": float(deliv_agg['deliv']) if deliv_agg else 250.0,
                    "available_remaining": max(0.0, total_tons - locked_today)
                }

                # Active deliveries for timeline display
                cursor.execute("""
                    SELECT d.*, bo.buyer_company, bo.destination, bo.requested_quantity, bo.confirmed_quantity, v.code as variety_code, v.name as variety_name
                    FROM delivery d
                    JOIN bulk_orders bo ON d.order_id = bo.id
                    JOIN varieties v ON bo.variety_id = v.id
                    ORDER BY d.id DESC
                """)
                deliveries = [dict(r) for r in cursor.fetchall()]

                # Return complete overview payload
                self.send_json({
                    "total_bulk_stock": round(total_tons, 1),
                    "active_vendors": active_vendors_count,
                    "available_varieties": len(varieties_list),
                    "last_updated": "Today, 10:30 AM",
                    "today_date": today_str,
                    "varieties": varieties_list,
                    "history_7_days": history_7_days,
                    "wholesale_activity": wholesale_activity,
                    "deliveries": deliveries,
                    "coordinator": {
                        "name": "Vikramaditya Rao",
                        "title": "Chief Trading Coordinator",
                        "phone": "+91 98450 82190",
                        "phone_raw": "+919845082190",
                        "email": "coordinator@kajubazaar.com",
                        "location": "Central Cashew Trading Hub, Mangalore Port"
                    }
                })

            elif path == '/api/vendors':
                # Coordinator view: all vendors with phone, GST, today's stock, status
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT 
                        v.id, v.user_id, v.business_name, v.vendor_name, v.phone, v.gst_number, v.location, v.address, v.approval_status, v.created_at,
                        COALESCE(SUM(ds.quantity_tons), 0) as today_stock,
                        COALESCE((
                            SELECT SUM(sl.locked_quantity) 
                            FROM stock_locks sl 
                            WHERE sl.vendor_id = v.id AND sl.stock_date = ?
                        ), 0) as today_locked
                    FROM vendors v
                    LEFT JOIN daily_stock ds ON v.id = ds.vendor_id AND ds.stock_date = ?
                    GROUP BY v.id
                    ORDER BY 
                        CASE v.approval_status 
                            WHEN 'pending' THEN 1 
                            WHEN 'approved' THEN 2 
                            ELSE 3 
                        END, 
                        today_stock DESC
                """, (today_str, today_str))
                vendors = [dict(r) for r in cursor.fetchall()]

                # Also fetch pending registrations separately for convenient review tab
                cursor.execute("SELECT * FROM vendors WHERE approval_status = 'pending' ORDER BY id DESC")
                pending_vendors = [dict(r) for r in cursor.fetchall()]

                self.send_json({
                    "vendors": vendors,
                    "pending_vendors": pending_vendors
                })

            elif path == '/api/vendor/my-data':
                # Restricted Vendor View: STRICT PRIVACY!
                # Vendor can only see their own profile, stock, entries, and locked quantities.
                user_id = query.get('user_id', [None])[0]
                vendor_id = query.get('vendor_id', [None])[0]

                cursor = conn.cursor()
                if user_id:
                    cursor.execute("SELECT * FROM vendors WHERE user_id = ?", (user_id,))
                elif vendor_id:
                    cursor.execute("SELECT * FROM vendors WHERE id = ?", (vendor_id,))
                else:
                    self.send_json({"error": "Vendor identity required"}, status=400)
                    return

                vendor = cursor.fetchone()
                if not vendor:
                    self.send_json({"error": "Vendor record not found"}, status=404)
                    return

                v_id = vendor['id']
                v_dict = dict(vendor)

                # Today's stock for this vendor per variety
                cursor.execute("""
                    SELECT v.id as variety_id, v.code, v.name, v.image,
                           COALESCE(ds.quantity_tons, 0) as today_tons,
                           COALESCE(sl.locked_quantity, 0) as locked_tons,
                           sl.reason as lock_reason
                    FROM varieties v
                    LEFT JOIN daily_stock ds ON v.id = ds.variety_id AND ds.vendor_id = ? AND ds.stock_date = ?
                    LEFT JOIN stock_locks sl ON v.id = sl.variety_id AND sl.vendor_id = ? AND sl.stock_date = ?
                    WHERE v.status = 'active'
                    ORDER BY v.id ASC
                """, (v_id, today_str, v_id, today_str))
                my_today_stock = [dict(r) for r in cursor.fetchall()]

                # Vendor's own weekly history (Last 7 days)
                my_weekly_history = []
                days_order = [6, 5, 4, 3, 2, 1, 0]
                for days_ago in days_order:
                    h_date = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")
                    cursor.execute("""
                        SELECT v.code, COALESCE(ds.quantity_tons, 0) as tons
                        FROM varieties v
                        LEFT JOIN daily_stock ds ON v.id = ds.variety_id AND ds.vendor_id = ? AND ds.stock_date = ?
                        WHERE v.status = 'active'
                    """, (v_id, h_date))
                    row_data = {"date": h_date, "formatted_date": (datetime.now() - timedelta(days=days_ago)).strftime("%b %d")}
                    total_d = 0
                    for r in cursor.fetchall():
                        row_data[r['code']] = float(r['tons'])
                        total_d += float(r['tons'])
                    row_data["total"] = round(total_d, 1)
                    my_weekly_history.append(row_data)

                # Vendor's locked stock records
                cursor.execute("""
                    SELECT sl.*, v.code as variety_code, v.name as variety_name
                    FROM stock_locks sl
                    JOIN varieties v ON sl.variety_id = v.id
                    WHERE sl.vendor_id = ?
                    ORDER BY sl.id DESC
                """, (v_id,))
                my_locks = [dict(r) for r in cursor.fetchall()]

                self.send_json({
                    "vendor": v_dict,
                    "today_date": today_str,
                    "today_stock": my_today_stock,
                    "weekly_history": my_weekly_history,
                    "locked_stock": my_locks
                })

            elif path == '/api/orders':
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT bo.*, v.code as variety_code, v.name as variety_name, d.status as current_delivery_status, d.current_step, d.vehicle_number, d.expected_date
                    FROM bulk_orders bo
                    JOIN varieties v ON bo.variety_id = v.id
                    LEFT JOIN delivery d ON bo.id = d.order_id
                    ORDER BY bo.id DESC
                """)
                orders = [dict(r) for r in cursor.fetchall()]
                self.send_json({"orders": orders})

            elif path == '/api/varieties':
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT v.*, 
                           COALESCE(SUM(ds.quantity_tons), 0) as today_tons,
                           COUNT(DISTINCT ds.vendor_id) as active_vendors
                    FROM varieties v
                    LEFT JOIN daily_stock ds ON v.id = ds.variety_id AND ds.stock_date = ?
                    GROUP BY v.id
                    ORDER BY v.id ASC
                """, (today_str,))
                varieties = [dict(r) for r in cursor.fetchall()]
                self.send_json({"varieties": varieties})

            else:
                self.send_json({"error": "Unknown API GET route"}, status=404)

        except Exception as e:
            self.send_json({"error": str(e)}, status=500)
        finally:
            conn.close()

    def handle_api_post(self, path, body):
        conn = get_db_connection()
        today_str = datetime.now().strftime("%Y-%m-%d")

        try:
            if path == '/api/auth/login':
                # Handles demo switcher & credential authentication
                role = body.get('role', 'guest')
                email = body.get('email', '')
                vendor_id = body.get('vendor_id', None)

                cursor = conn.cursor()
                if role == 'coordinator':
                    cursor.execute("SELECT * FROM users WHERE role = 'coordinator' LIMIT 1")
                    u = cursor.fetchone()
                    self.send_json({
                        "success": True,
                        "user": dict(u),
                        "role": "coordinator",
                        "greeting": "Namaste, Coordinator"
                    })
                elif role == 'vendor':
                    if vendor_id:
                        cursor.execute("SELECT v.*, u.email, u.role FROM vendors v JOIN users u ON v.user_id = u.id WHERE v.id = ?", (vendor_id,))
                    elif email:
                        cursor.execute("SELECT v.*, u.email, u.role FROM vendors v JOIN users u ON v.user_id = u.id WHERE u.email = ?", (email,))
                    else:
                        # Default approved vendor
                        cursor.execute("SELECT v.*, u.email, u.role FROM vendors v JOIN users u ON v.user_id = u.id WHERE v.approval_status = 'approved' LIMIT 1")

                    v = cursor.fetchone()
                    if v:
                        v_dict = dict(v)
                        self.send_json({
                            "success": True,
                            "user": {
                                "id": v_dict['user_id'],
                                "email": v_dict['email'],
                                "role": "vendor",
                                "name": v_dict['vendor_name']
                            },
                            "vendor": v_dict,
                            "role": "vendor",
                            "approval_status": v_dict['approval_status'],
                            "greeting": f"Namaste, {v_dict['vendor_name']}"
                        })
                    else:
                        self.send_json({"success": False, "error": "Vendor not found"}, status=404)

                elif role == 'google_mock':
                    # Simulated Google sign-in
                    google_name = body.get('name', 'Sunita Deshmukh')
                    google_email = body.get('email', 'sunita.agro@gmail.com')
                    google_id = body.get('google_id', f"goog_{datetime.now().timestamp()}")

                    cursor.execute("SELECT * FROM users WHERE email = ?", (google_email,))
                    existing = cursor.fetchone()
                    if existing:
                        cursor.execute("SELECT * FROM vendors WHERE user_id = ?", (existing['id'],))
                        v = cursor.fetchone()
                        self.send_json({
                            "success": True,
                            "user": dict(existing),
                            "vendor": dict(v) if v else None,
                            "needs_profile": v is None,
                            "role": existing['role']
                        })
                    else:
                        cursor.execute("""
                            INSERT INTO users (google_id, email, name, role, status)
                            VALUES (?, ?, ?, 'vendor', 'pending')
                        """, (google_id, google_email, google_name))
                        user_id = cursor.lastrowid
                        conn.commit()
                        self.send_json({
                            "success": True,
                            "user": {
                                "id": user_id,
                                "google_id": google_id,
                                "email": google_email,
                                "name": google_name,
                                "role": "vendor",
                                "status": "pending"
                            },
                            "needs_profile": True,
                            "role": "vendor"
                        })
                else:
                    self.send_json({"success": True, "role": "guest"})

            elif path == '/api/auth/register-vendor':
                # Vendor profile completion after Google Auth
                user_id = body.get('user_id')
                business_name = body.get('business_name', '').strip()
                vendor_name = body.get('vendor_name', '').strip()
                phone = body.get('phone', '').strip()
                gst_number = body.get('gst_number', '').strip().upper()
                location = body.get('location', '').strip()
                address = body.get('address', '').strip()

                if not (business_name and vendor_name and phone and gst_number and location):
                    self.send_json({"success": False, "error": "All business details are mandatory for GST verification"}, status=400)
                    return

                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO vendors (user_id, business_name, vendor_name, phone, gst_number, location, address, approval_status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
                """, (user_id, business_name, vendor_name, phone, gst_number, location, address))
                vendor_id = cursor.lastrowid

                # Update user phone & status
                cursor.execute("UPDATE users SET phone = ?, status = 'pending' WHERE id = ?", (phone, user_id))
                conn.commit()

                self.send_json({
                    "success": True,
                    "vendor_id": vendor_id,
                    "approval_status": "pending",
                    "title": "Registration Submitted",
                    "message": "Your vendor account is currently under review by our coordinator.",
                    "status_label": "Pending Approval"
                })

            elif path == '/api/vendor/submit-stock':
                # Stateless stock submission rule:
                # Each day is a fresh entry. Does NOT carry over yesterday's quantity.
                vendor_id = body.get('vendor_id')
                stock_entries = body.get('entries', []) # [{variety_id: 1, tons: 25.0}, ...]

                cursor = conn.cursor()
                # Check vendor approval
                cursor.execute("SELECT * FROM vendors WHERE id = ?", (vendor_id,))
                vendor = cursor.fetchone()
                if not vendor:
                    self.send_json({"success": False, "error": "Vendor not recognized"}, status=404)
                    return
                if vendor['approval_status'] != 'approved':
                    self.send_json({
                        "success": False, 
                        "error": "Account pending review. Only coordinator-approved vendors can submit daily stock."
                    }, status=403)
                    return

                submitted_count = 0
                for item in stock_entries:
                    var_id = item.get('variety_id')
                    tons = float(item.get('tons', 0))
                    # Fresh stateless insert or overwrite for today's date
                    cursor.execute("""
                        INSERT INTO daily_stock (vendor_id, variety_id, stock_date, quantity_tons, notes, submitted_at)
                        VALUES (?, ?, ?, ?, 'Stateless fresh daily availability', CURRENT_TIMESTAMP)
                        ON CONFLICT(vendor_id, variety_id, stock_date) DO UPDATE SET
                            quantity_tons = excluded.quantity_tons,
                            submitted_at = CURRENT_TIMESTAMP
                    """, (vendor_id, var_id, today_str, tons))
                    submitted_count += 1

                conn.commit()
                self.send_json({
                    "success": True,
                    "message": "Today's stock availability has been successfully submitted.",
                    "today": today_str,
                    "updated_entries": submitted_count
                })

            elif path == '/api/stock/lock':
                # Coordinator locks agreed quantity after verbal confirmation
                vendor_id = body.get('vendor_id')
                variety_id = body.get('variety_id')
                available_tons = float(body.get('available_quantity', 0))
                locked_tons = float(body.get('locked_quantity', 0))
                reason = body.get('reason', 'Verbal confirmation by phone')
                locked_by = body.get('locked_by', 'Vikramaditya Rao (Coordinator)')

                if locked_tons > available_tons:
                    self.send_json({"success": False, "error": f"Locked quantity ({locked_tons} T) cannot exceed available stock ({available_tons} T)"}, status=400)
                    return

                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO stock_locks (vendor_id, variety_id, stock_date, available_quantity, locked_quantity, reason, locked_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (vendor_id, variety_id, today_str, available_tons, locked_tons, reason, locked_by))
                conn.commit()

                self.send_json({
                    "success": True,
                    "message": f"Stock locked successfully: {locked_tons} Tons",
                    "locked_quantity": locked_tons,
                    "status_label": f"Locked: {locked_tons} Tons",
                    "available_quantity": available_tons
                })

            elif path == '/api/vendors/approve':
                vendor_id = body.get('vendor_id')
                cursor = conn.cursor()
                cursor.execute("UPDATE vendors SET approval_status = 'approved' WHERE id = ?", (vendor_id,))
                # Also activate user account
                cursor.execute("UPDATE users SET status = 'active' WHERE id = (SELECT user_id FROM vendors WHERE id = ?)", (vendor_id,))
                conn.commit()
                self.send_json({"success": True, "message": "Vendor approved successfully."})

            elif path == '/api/vendors/reject':
                vendor_id = body.get('vendor_id')
                cursor = conn.cursor()
                cursor.execute("UPDATE vendors SET approval_status = 'rejected' WHERE id = ?", (vendor_id,))
                conn.commit()
                self.send_json({"success": True, "message": "Vendor application rejected."})

            elif path == '/api/orders/request':
                # Wholesale bulk order request (direct to coordinator, NOT a cart!)
                buyer_company = body.get('buyer_company', '').strip()
                buyer_name = body.get('buyer_name', '').strip()
                buyer_phone = body.get('buyer_phone', '').strip()
                variety_id = int(body.get('variety_id', 3))
                requested_quantity = float(body.get('requested_quantity', 50))
                destination = body.get('destination', 'Domestic Warehouse Dispatch')
                notes = body.get('notes', 'Direct wholesale inquiry from web portal')

                cursor = conn.cursor()
                # Generate unique wholesale order reference
                count = cursor.execute("SELECT COUNT(*) as cnt FROM bulk_orders").fetchone()['cnt']
                ref = f"WC-2026-{1045 + count + 1}"

                cursor.execute("""
                    INSERT INTO bulk_orders (order_reference, buyer_company, buyer_name, buyer_phone, variety_id, requested_quantity, confirmed_quantity, locked_quantity, delivery_status, destination, notes)
                    VALUES (?, ?, ?, ?, ?, ?, 0, 0, 'Order Received', ?, ?)
                """, (ref, buyer_company, buyer_name, buyer_phone, variety_id, requested_quantity, destination, notes))
                order_id = cursor.lastrowid

                # Create matching delivery step
                cursor.execute("""
                    INSERT INTO delivery (order_id, order_reference, status, current_step, origin_terminal, destination_hub, expected_date)
                    VALUES (?, ?, 'Order Received', 1, 'Central Cashew Godown Terminal', ?, ?)
                """, (order_id, ref, destination, (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")))

                conn.commit()
                self.send_json({
                    "success": True,
                    "order_reference": ref,
                    "message": "Bulk order request registered. Our Chief Coordinator will call you shortly to confirm terms."
                })

            elif path == '/api/orders/update-status':
                # Coordinator updates delivery stage (1 to 6)
                order_id = body.get('order_id')
                step = int(body.get('step', 1))
                step_names = {
                    1: 'Order Received',
                    2: 'Quantity Confirmed',
                    3: 'Stock Locked',
                    4: 'Loading',
                    5: 'In Transit',
                    6: 'Delivered'
                }
                status_text = step_names.get(step, 'Order Received')

                cursor = conn.cursor()
                cursor.execute("UPDATE bulk_orders SET delivery_status = ? WHERE id = ?", (status_text, order_id))
                cursor.execute("UPDATE delivery SET status = ?, current_step = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?", (status_text, step, order_id))
                conn.commit()

                self.send_json({
                    "success": True,
                    "step": step,
                    "status": status_text,
                    "message": f"Order status advanced to: {status_text}"
                })

            elif path == '/api/varieties/manage':
                # Coordinator can add, edit, or toggle status of varieties
                action = body.get('action', 'toggle')
                variety_id = body.get('id')
                cursor = conn.cursor()

                if action == 'toggle':
                    cursor.execute("SELECT status FROM varieties WHERE id = ?", (variety_id,))
                    cur_st = cursor.fetchone()['status']
                    new_st = 'disabled' if cur_st == 'active' else 'active'
                    cursor.execute("UPDATE varieties SET status = ? WHERE id = ?", (new_st, variety_id))
                    conn.commit()
                    self.send_json({"success": True, "new_status": new_st})

                elif action == 'create':
                    code = body.get('code')
                    name = body.get('name')
                    grade_spec = body.get('grade_spec', 'Wholesale Grade')
                    count_per_lb = body.get('count_per_lb', '300-320 nuts/lb')
                    image = body.get('image', 'assets/images/cashew_velvet_tray.jpg')
                    description = body.get('description', '')
                    cursor.execute("""
                        INSERT INTO varieties (code, name, grade_spec, count_per_lb, image, description, status)
                        VALUES (?, ?, ?, ?, ?, ?, 'active')
                    """, (code, name, grade_spec, count_per_lb, image, description))
                    conn.commit()
                    self.send_json({"success": True, "message": "Variety added successfully."})

                else:
                    self.send_json({"error": "Unsupported variety action"}, status=400)
            else:
                self.send_json({"error": "Unknown API POST route"}, status=404)

        except Exception as e:
            self.send_json({"error": str(e)}, status=500)
        finally:
            conn.close()

def run_server():
    init_db()
    port = PORT
    for attempt in range(5):
        try:
            with socketserver.TCPServer(("", port), CashewAPIHandler) as httpd:
                print(f"[LIVE] Royal Anacardium Wholesale Web Server running at: http://localhost:{port}")
                print(f"[DIR] Serving from: {DIRECTORY}")
                sys.stdout.flush()
                httpd.serve_forever()
                break
        except OSError as e:
            if "address already in use" in str(e).lower() or attempt < 4:
                print(f"Port {port} in use, trying {port + 1}...")
                sys.stdout.flush()
                port += 1
            else:
                raise

if __name__ == '__main__':
    run_server()
