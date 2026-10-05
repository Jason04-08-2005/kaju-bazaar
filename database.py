"""
Royal Anacardium - Luxury Wholesale Cashew Stock & Bulk Order Management
Database Layer with SQLite3
"""

import sqlite3
import os
import json
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cashew_wholesale.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        google_id TEXT UNIQUE,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('coordinator', 'vendor', 'buyer')),
        status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'pending', 'suspended')),
        phone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Vendors
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS vendors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        business_name TEXT NOT NULL,
        vendor_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        gst_number TEXT NOT NULL,
        location TEXT NOT NULL,
        address TEXT NOT NULL,
        approval_status TEXT NOT NULL DEFAULT 'pending' CHECK(approval_status IN ('approved', 'pending', 'rejected')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 3. Varieties
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS varieties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        grade_spec TEXT NOT NULL,
        count_per_lb TEXT NOT NULL,
        moisture_spec TEXT NOT NULL DEFAULT 'Under 5%',
        image TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'disabled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 4. Daily Stock (Stateless daily entries)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS daily_stock (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_id INTEGER NOT NULL,
        variety_id INTEGER NOT NULL,
        stock_date DATE NOT NULL,
        quantity_tons REAL NOT NULL DEFAULT 0,
        notes TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(vendor_id, variety_id, stock_date),
        FOREIGN KEY(vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
        FOREIGN KEY(variety_id) REFERENCES varieties(id) ON DELETE CASCADE
    );
    """)

    # 5. Stock Locks (Coordinator-managed verbal & contract stock locks)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS stock_locks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_id INTEGER NOT NULL,
        variety_id INTEGER NOT NULL,
        stock_date DATE NOT NULL,
        available_quantity REAL NOT NULL,
        locked_quantity REAL NOT NULL,
        reason TEXT NOT NULL,
        locked_by TEXT NOT NULL DEFAULT 'Coordinator',
        locked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
        FOREIGN KEY(variety_id) REFERENCES varieties(id) ON DELETE CASCADE
    );
    """)

    # 6. Bulk Orders
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bulk_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_reference TEXT UNIQUE NOT NULL,
        buyer_company TEXT NOT NULL,
        buyer_name TEXT NOT NULL,
        buyer_phone TEXT NOT NULL,
        variety_id INTEGER NOT NULL,
        requested_quantity REAL NOT NULL,
        confirmed_quantity REAL NOT NULL DEFAULT 0,
        locked_quantity REAL NOT NULL DEFAULT 0,
        delivery_status TEXT NOT NULL DEFAULT 'Order Received' 
            CHECK(delivery_status IN ('Order Received', 'Quantity Confirmed', 'Stock Locked', 'Loading', 'In Transit', 'Delivered')),
        destination TEXT NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(variety_id) REFERENCES varieties(id) ON DELETE CASCADE
    );
    """)

    # 7. Delivery Status Timeline
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS delivery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER UNIQUE NOT NULL,
        order_reference TEXT NOT NULL,
        status TEXT NOT NULL,
        current_step INTEGER NOT NULL DEFAULT 1,
        vehicle_number TEXT,
        driver_phone TEXT,
        origin_terminal TEXT,
        destination_hub TEXT,
        expected_date DATE,
        delivered_date DATE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(order_id) REFERENCES bulk_orders(id) ON DELETE CASCADE
    );
    """)

    conn.commit()
    seed_initial_data(cursor, conn)
    conn.close()

def seed_initial_data(cursor, conn):
    # Check if users already seeded
    cursor.execute("SELECT COUNT(*) as cnt FROM users")
    if cursor.fetchone()['cnt'] > 0:
        return

    today_str = datetime.now().strftime("%Y-%m-%d")

    # 1. Users & Vendors
    users_data = [
        # Coordinator
        ("coord_1", "coordinator@royalcashew.com", "Vikramaditya Rao", "coordinator", "active", "+91 98450 82190"),
        # Approved Vendors
        ("vend_1", "rajesh@malabarcashew.com", "Rajesh Nair", "vendor", "active", "+91 94471 22890"),
        ("vend_2", "anand@konkancoast.com", "Anand Prabhu", "vendor", "active", "+91 98230 45610"),
        ("vend_3", "sunil@goaheritage.com", "Sunil Pai", "vendor", "active", "+91 98221 78940"),
        ("vend_4", "vikas@sahyadrinuts.com", "Vikas Patil", "vendor", "active", "+91 99234 11200"),
        ("vend_5", "ramesh@andhracashew.com", "B. Ramesh", "vendor", "active", "+91 94401 88320"),
        ("vend_6", "siddharth@coastalkarnataka.com", "Siddharth Shenoy", "vendor", "active", "+91 97412 33450"),
        ("vend_7", "narayanan@coromandelnuts.com", "V. Narayanan", "vendor", "active", "+91 94432 55670"),
        ("vend_8", "deepak@westernghatscashew.com", "Deepak Hegde", "vendor", "active", "+91 98456 77890"),
        ("vend_9", "mathew@keralagold.com", "Mathew Thomas", "vendor", "active", "+91 94470 11234"),
        ("vend_10", "pravin@malvansyndicate.com", "Pravin Sawant", "vendor", "active", "+91 98235 66780"),
        ("vend_11", "kiran@kundapurcashew.com", "Kiran Poojary", "vendor", "active", "+91 98801 22340"),
        ("vend_12", "mahesh@odishacashews.com", "Mahesh Mohapatra", "vendor", "active", "+91 94370 99810"),
        ("vend_13", "vijay@belgaumdryfruits.com", "Vijay Kulkarni", "vendor", "active", "+91 98440 33210"),
        ("vend_14", "suresh@trivandrumtrade.com", "Suresh Kumar", "vendor", "active", "+91 94477 44320"),
        ("vend_15", "ganesh@southcanaraagro.com", "Ganesh Acharya", "vendor", "active", "+91 98452 88900"),
        ("vend_16", "arjun@vengurlatraders.com", "Arjun Shinde", "vendor", "active", "+91 98233 44550"),
        ("vend_17", "krishna@maduraicashew.com", "Krishna Moorthy", "vendor", "active", "+91 94431 88760"),
        ("vend_18", "pramod@canaracoastnuts.com", "Pramod Kamath", "vendor", "active", "+91 98459 00120"),
        # Pending Vendors (Under review)
        ("vend_pending_1", "girish@goaroyale.com", "Girish Kamat", "vendor", "pending", "+91 98223 99010"),
        ("vend_pending_2", "harish@dakshinacashew.com", "Harish Bhat", "vendor", "pending", "+91 98454 55660")
    ]

    for u in users_data:
        cursor.execute("""
            INSERT INTO users (google_id, email, name, role, status, phone)
            VALUES (?, ?, ?, ?, ?, ?)
        """, u)

    # Vendor details mapping
    vendor_details = [
        # (user_idx, business_name, vendor_name, phone, gst_number, location, address, approval_status)
        (2, "Malabar Cashew Exports", "Rajesh Nair", "+91 94471 22890", "32AAAFM1245K1Z8", "Kollam, Kerala", "Plot 14, Cashew Industrial Estate, Mundakkal, Kollam - 691001", "approved"),
        (3, "Konkan Coast Agro Traders", "Anand Prabhu", "+91 98230 45610", "29AABCK9921B1Z2", "Mangalore, Karnataka", "Survey 88, Baikampady Industrial Area, Mangalore - 575011", "approved"),
        (4, "Goa Heritage Cashew Processors", "Sunil Pai", "+91 98221 78940", "30AABCG5542C1Z4", "Panaji, Goa", "Bicholim Industrial Estate, Phase II, Goa - 403529", "approved"),
        (5, "Sahyadri Nut Trading Co.", "Vikas Patil", "+91 99234 11200", "27AAECS8812D1Z9", "Ratnagiri, Maharashtra", "MIDC Mirjole, Ratnagiri - 415639", "approved"),
        (6, "Andhra Cashew Federation", "B. Ramesh", "+91 94401 88320", "37AAACA4419E1Z3", "Palasa, Andhra Pradesh", "Main Road, Palasa-Kasibugga, Srikakulam - 532222", "approved"),
        (7, "Coastal Karnataka Dry Fruits", "Siddharth Shenoy", "+91 97412 33450", "29AADCS1133F1Z6", "Udupi, Karnataka", "Manipal Industrial Area, Udupi - 576104", "approved"),
        (8, "Coromandel Spice & Nuts", "V. Narayanan", "+91 94432 55670", "33AABCN6622G1Z1", "Cuddalore, Tamil Nadu", "Panruti Cashew Belt, Cuddalore - 607106", "approved"),
        (9, "Western Ghats Cashew Mills", "Deepak Hegde", "+91 98456 77890", "29AAACW7734H1Z5", "Sirsi, Karnataka", "APMC Yard, Sirsi, Uttara Kannada - 581401", "approved"),
        (10, "Kerala Gold Nut Traders", "Mathew Thomas", "+91 94470 11234", "32AAETM3321J1Z7", "Cochin, Kerala", "Willingdon Island Port Road, Cochin - 682003", "approved"),
        (11, "Malvan Cashew Syndicate", "Pravin Sawant", "+91 98235 66780", "27AABPM4412K1ZA", "Malvan, Maharashtra", "Sindhudurg Processing Zone, Malvan - 416606", "approved"),
        (12, "Kundapur Cashew Processors", "Kiran Poojary", "+91 98801 22340", "29AAFPK5521L1ZB", "Kundapur, Karnataka", "Koteshwar Bypass, Kundapur - 576222", "approved"),
        (13, "Odisha Cashew Trading Corp", "Mahesh Mohapatra", "+91 94370 99810", "21AAACN2211M1ZC", "Bhubaneswar, Odisha", "Ganjam Cashew Hub, Brahmapur - 760001", "approved"),
        (14, "Belgaum Dry Fruits & Nut Co.", "Vijay Kulkarni", "+91 98440 33210", "29AABKV3322N1ZD", "Belgaum, Karnataka", "Udyambag Industrial Estate, Belgaum - 590008", "approved"),
        (15, "Trivandrum Cashew Trade House", "Suresh Kumar", "+91 94477 44320", "32AAACS4433P1ZE", "Trivandrum, Kerala", "Killipalam Wholesale Market, Trivandrum - 695002", "approved"),
        (16, "South Canara Agro Supplies", "Ganesh Acharya", "+91 98452 88900", "29AAECG5544Q1ZF", "Puttur, Karnataka", "APMC Yard, Puttur, DK - 574201", "approved"),
        (17, "Vengurla Cashew Growers Union", "Arjun Shinde", "+91 98233 44550", "27AAASV6655R1ZG", "Vengurla, Maharashtra", "Camp Road, Vengurla - 416516", "approved"),
        (18, "Madurai Cashew Traders", "Krishna Moorthy", "+91 94431 88760", "33AABKM7766S1ZH", "Madurai, Tamil Nadu", "East Veli Street, Wholesale Bazaar, Madurai - 625001", "approved"),
        (19, "Canara Coast Nut Exchange", "Pramod Kamath", "+91 98459 00120", "29AAACK8877T1ZJ", "Kumta, Karnataka", "Coastal Highway Hub, Kumta - 581343", "approved"),
        # Pending review
        (20, "Goa Royale Cashew Works", "Girish Kamat", "+91 98223 99010", "30AAACG1122U1ZK", "Ponda, Goa", "Kundaim Industrial Estate, Ponda - 403115", "pending"),
        (21, "Dakshina Cashew Mills", "Harish Bhat", "+91 98454 55660", "29AADCM2233V1ZL", "Puttur, Karnataka", "Kabaka Agro Complex, Puttur - 574220", "pending")
    ]

    for vd in vendor_details:
        cursor.execute("""
            INSERT INTO vendors (user_id, business_name, vendor_name, phone, gst_number, location, address, approval_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, vd)

    # 2. Varieties
    varieties_data = [
        ("W210", "W210 Cashew (King Jumbo)", "White Wholes King Size", "200-210 nuts/lb", "Max 4.8%", 
         "assets/images/cashew_velvet_tray.jpg", 
         "The undisputed sovereign of cashew nuts. Extra-large, magnificent crescent shape, prized for prestigious corporate gifting and luxury confectionery. Flawlessly dried with zero blemishes.", "active"),
        
        ("W240", "W240 Cashew (Premium Jumbo)", "White Wholes Jumbo Export", "220-240 nuts/lb", "Max 5.0%", 
         "assets/images/cashew_grades_tray.jpg", 
         "Attractive large-sized whole kernel with exceptional natural crunch and creamy sweetness. Highly demanded across premium international roasting and hospitality contracts.", "active"),
        
        ("W320", "W320 Cashew (Standard Wholes)", "White Wholes Global Standard", "300-320 nuts/lb", "Max 5.0%", 
         "assets/images/cashew_inspection_kernels.jpg", 
         "The worldwide gold benchmark of the cashew wholesale commodity trade. Perfect balance of size, yield, rich nut-butter consistency, and steady volume availability.", "active"),
        
        ("W400", "W400 Cashew (Medium Wholes)", "White Wholes Medium Grade", "380-400 nuts/lb", "Max 5.0%", 
         "assets/images/cashew_premium_kernels.jpg", 
         "Uniformly sized whole kernels widely utilized by national sweets manufacturers, spice roasters, and large-scale FMCG commercial blenders.", "active"),
        
        ("W450", "W450 Cashew (Compact Wholes)", "White Wholes Compact Size", "400-450 nuts/lb", "Max 5.0%", 
         "assets/images/cashew_grades_tray.jpg", 
         "Economical whole kernel grade with full nutritional value, excellent for bulk food service, airline snacks, and automated roasting packaging lines.", "active"),
        
        ("SW320", "SW320 Cashew (Scorched Wholes)", "Slightly Roasted Golden Wholes", "300-320 nuts/lb", "Max 5.0%", 
         "assets/images/cashew_premium_kernels.jpg", 
         "Whole kernels lightly scorched during shell extraction, imparting a delightful toasted aroma. Highly sought-after for savory masala coating and bakery pastes.", "active"),
        
        ("JH", "JH Cashew (Jumbo Halves)", "Natural Clean Halves / Splits", "Split Cotyledon", "Max 4.5%", 
         "assets/images/cashew_inspection_kernels.jpg", 
         "Naturally separated halves along the kernel seam. Clean, ivory-tinted, and ideal for culinary curries, rich gravies, garnishing, and premium bar snacking mixes.", "active"),
        
        ("Broken Cashew", "Broken Pieces (LWP / SWP)", "Large & Small White Pieces", "Confectionery Cut", "Max 5.2%", 
         "assets/images/cashew_inspection_kernels.jpg", 
         "Export-grade clean broken kernel pieces. High fat content, essential for luxury ice creams, artisanal nut butters, traditional Indian Mithai, and cashew powder.", "active")
    ]

    for v in varieties_data:
        cursor.execute("""
            INSERT INTO varieties (code, name, grade_spec, count_per_lb, moisture_spec, image, description, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, v)

    # 3. Daily Stock for Today (Total exactly 1,248 Tons across 18 vendors and 6 primary varieties + 2 secondary)
    # Variety map
    # 1: W210 (195 T, 7 vendors)
    # 2: W240 (260 T, 11 vendors)
    # 3: W320 (420 T, 12 vendors)
    # 4: W400 (185 T, 8 vendors)
    # 5: W450 (95 T, 5 vendors)
    # 6: SW320 (48 T, 4 vendors)
    # 7: JH (30 T, 3 vendors)
    # 8: Broken Cashew (15 T, 3 vendors)
    # Total = 1,248 T

    stock_allocation = [
        # (vendor_id, variety_id, tons)
        # W210: 195 T (Vendors 1, 2, 3, 4, 8, 9, 10)
        (1, 1, 35.0), (2, 1, 30.0), (3, 1, 25.0), (4, 1, 20.0), (8, 1, 30.0), (9, 1, 35.0), (10, 1, 20.0),
        # W240: 260 T (Vendors 1, 2, 3, 5, 6, 7, 11, 12, 13, 14, 15)
        (1, 2, 25.0), (2, 2, 30.0), (3, 2, 25.0), (5, 2, 20.0), (6, 2, 25.0), (7, 2, 25.0),
        (11, 2, 20.0), (12, 2, 20.0), (13, 2, 25.0), (14, 2, 25.0), (15, 2, 20.0),
        # W320: 420 T (Vendors 1, 2, 4, 5, 6, 7, 8, 10, 14, 16, 17, 18)
        (1, 3, 45.0), (2, 3, 40.0), (4, 3, 35.0), (5, 3, 35.0), (6, 3, 35.0), (7, 3, 30.0),
        (8, 3, 40.0), (10, 3, 30.0), (14, 3, 35.0), (16, 3, 30.0), (17, 3, 35.0), (18, 3, 30.0),
        # W400: 185 T (Vendors 2, 4, 5, 6, 9, 11, 13, 17)
        (2, 4, 25.0), (4, 4, 25.0), (5, 4, 25.0), (6, 4, 20.0), (9, 4, 25.0), (11, 4, 20.0), (13, 4, 25.0), (17, 4, 20.0),
        # W450: 95 T (Vendors 3, 7, 12, 15, 18)
        (3, 5, 20.0), (7, 5, 20.0), (12, 5, 15.0), (15, 5, 20.0), (18, 5, 20.0),
        # SW320: 48 T (Vendors 1, 8, 13, 16)
        (1, 6, 12.0), (8, 6, 14.0), (13, 6, 10.0), (16, 6, 12.0),
        # JH: 30 T (Vendors 2, 9, 14)
        (2, 7, 10.0), (9, 7, 10.0), (14, 7, 10.0),
        # Broken: 15 T (Vendors 4, 11, 17)
        (4, 8, 5.0), (11, 8, 5.0), (17, 8, 5.0)
    ]

    for item in stock_allocation:
        cursor.execute("""
            INSERT INTO daily_stock (vendor_id, variety_id, stock_date, quantity_tons, notes)
            VALUES (?, ?, ?, ?, 'Stateless fresh entry verified by vendor')
        """, (item[0], item[1], today_str, item[2]))

    # Historical Daily Stock for the last 6 days (monotonically increasing):
    # Mon: 950 T, Tue: 1010 T, Wed: 1080 T, Thu: 1140 T, Fri: 1190 T, Sat: 1220 T, Today: 1248 T
    history_totals = [
        (6, 950.0),
        (5, 1010.0),
        (4, 1080.0),
        (3, 1140.0),
        (2, 1190.0),
        (1, 1220.0)
    ]

    for days_ago, total_t in history_totals:
        hist_date = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")
        # Distribute across vendors 1, 2, 3, 4, 5
        scale = total_t / 1248.0
        for item in stock_allocation:
            hist_qty = round(item[2] * scale, 1)
            cursor.execute("""
                INSERT OR IGNORE INTO daily_stock (vendor_id, variety_id, stock_date, quantity_tons, notes)
                VALUES (?, ?, ?, ?, 'Historical daily entry')
            """, (item[0], item[1], hist_date, hist_qty))

    # 4. Stock Locks (Demonstrates the Coordinator lock mechanism)
    # Vendor 1 (Malabar Cashew Exports), Variety 3 (W320), Available 45 T, Locked 40 T
    # Vendor 2 (Konkan Coast), Variety 1 (W210), Available 30 T, Locked 25 T
    cursor.execute("""
        INSERT INTO stock_locks (vendor_id, variety_id, stock_date, available_quantity, locked_quantity, reason, locked_by)
        VALUES (1, 3, ?, 45.0, 40.0, 'Verbal confirmation by phone - Wholesale Order #WC-2026-1042', 'Vikramaditya Rao (Chief Coordinator)')
    """, (today_str,))

    cursor.execute("""
        INSERT INTO stock_locks (vendor_id, variety_id, stock_date, available_quantity, locked_quantity, reason, locked_by)
        VALUES (2, 1, ?, 30.0, 25.0, 'Direct phone negotiation - Export Consignment #WC-2026-1043', 'Vikramaditya Rao (Chief Coordinator)')
    """, (today_str,))

    # 5. Bulk Orders (Wholesale Order Activity - Section 11 & 12)
    # Requested: 580 T, Confirmed: 430 T, Locked: 390 T, Delivered: 250 T
    orders_data = [
        ("WC-2026-1042", "Bharat Dry Fruits & Confectionery Ltd", "Aditya Singhania", "+91 98110 55430", 3, 120.0, 120.0, 120.0, "In Transit", "Nhava Sheva Port Terminal, Mumbai", "Export shipment LC-8891. Direct coordinator locked."),
        ("WC-2026-1041", "Himalaya Gourmet Sweets & Bakery", "Devendra Rawat", "+91 98370 22100", 2, 85.0, 85.0, 85.0, "Delivered", "Dehradun Central Processing Hub", "Delivered on schedule. Quality certificate endorsed."),
        ("WC-2026-1040", "Royal Maratha Nut Processing Co", "Sunil Deshmukh", "+91 98220 99880", 4, 165.0, 165.0, 165.0, "Delivered", "Pune Agro Terminal Bay 2", "Bulk delivery executed via cold container fleet."),
        ("WC-2026-1043", "Grand Imperial Confectioners & Roasters", "Farhan Qureshi", "+91 98910 44320", 1, 60.0, 60.0, 60.0, "Loading", "Kollam Central Godown Bay 3", "Loading in progress. Driver dispatched."),
        ("WC-2026-1044", "SpiceRoute Global Trading LLC", "Tariq Mansoor", "+971 50 123 4567", 3, 110.0, 0.0, 0.0, "Order Received", "Jebel Ali Port (C.I.F. Dubai)", "Coordinator review in progress with vendor syndicate."),
        ("WC-2026-1045", "Southern Spice Blenders Pvt Ltd", "K. V. Sundaram", "+91 94440 88210", 4, 40.0, 0.0, 0.0, "Order Received", "Chennai Central Wholesale Terminal", "Requested quantity under verification.")
    ]

    for ord_row in orders_data:
        cursor.execute("""
            INSERT INTO bulk_orders (order_reference, buyer_company, buyer_name, buyer_phone, variety_id, requested_quantity, confirmed_quantity, locked_quantity, delivery_status, destination, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, ord_row)

    # 6. Delivery Tracking (Section 12)
    # Order #WC-2026-1042 is In Transit (Step 5 of 6)
    cursor.execute("SELECT id FROM bulk_orders WHERE order_reference = 'WC-2026-1042'")
    order_1042_id = cursor.fetchone()['id']

    expected_delivery = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")
    cursor.execute("""
        INSERT INTO delivery (order_id, order_reference, status, current_step, vehicle_number, driver_phone, origin_terminal, destination_hub, expected_date)
        VALUES (?, 'WC-2026-1042', 'In Transit', 5, 'KA-19-AB-8422 (Air-Cushioned Bulk Carrier)', '+91 97400 66520', 'Mangalore Port Terminal Bay 4', 'Nhava Sheva Freight Corridor, Mumbai', ?)
    """, (order_1042_id, expected_delivery))

    # Order #WC-2026-1043 is Loading (Step 4 of 6)
    cursor.execute("SELECT id FROM bulk_orders WHERE order_reference = 'WC-2026-1043'")
    order_1043_id = cursor.fetchone()['id']
    cursor.execute("""
        INSERT INTO delivery (order_id, order_reference, status, current_step, vehicle_number, driver_phone, origin_terminal, destination_hub, expected_date)
        VALUES (?, 'WC-2026-1043', 'Loading', 4, 'KL-02-CD-5511 (Heavy Duty Burlap Freight)', '+91 94460 33810', 'Kollam Central Godown Bay 3', 'Grand Imperial Plant, New Delhi', ?)
    """, (order_1043_id, (datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d")))

    conn.commit()

if __name__ == '__main__':
    print("[INIT] Initializing KAJU BAZAAR SQLite database...")
    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
            print("[CLEAN] Removed existing database for clean re-seeding.")
        except Exception as e:
            print("[WARN] Could not remove existing db:", e)
    init_db()
    print("[SUCCESS] Database initialized and seeded successfully at:", DB_PATH)
