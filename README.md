# Royal Anacardium (Wholesale Cashew Trading House)
### Luxury Wholesale Cashew Stock & Bulk Order Management Web Application

> **"One Call. Bulk Cashew. Trusted Supply."**  
> *Premium Cashews • Trusted Vendors • Bulk Availability • Direct Coordination*

---

## 🏛️ Executive Summary & Business Concept

**Royal Anacardium** is a **luxury B2B wholesale commodity platform** custom-engineered for the cashew wholesale and export trade.

**THIS IS NOT A RETAIL E-COMMERCE WEBSITE.**
It purposefully avoids and rejects:
* "Add to Cart" or "Buy Now" consumer checkout flows
* Retail consumer pricing, packet prices, or grocery aesthetics
* Consumer reviews, cart drawers, or retail discounts

Instead, the platform powers:
1. **Aggregated Wholesale Stock Intelligence**: Real-time multi-ton availability from certified primary processing mills and export godowns.
2. **Stateless Daily Fresh Stock**: No automatic mathematical carryover. Each trading morning represents a fresh declaration by verified processors.
3. **Verbal Phone Coordination & Direct Stock Locking**: The Coordinator negotiates multi-ton deals over telephone (`tel:`) and manually locks agreed quantities against vendor allocations to prevent double-selling.
4. **End-to-End Bulk Logistics Tracking**: Turn-by-turn multi-stage dispatch visibility (Order Received → Confirmed → Stock Locked → Loading → In Transit → Delivered).
5. **Strict Vendor Privacy & Coordinator Command**: Vendors only see their own operational entries and locked quantities. They cannot see other suppliers, global internal volumes, or competitor listings.

---

## 🎨 Visual Identity & Luxury Design Direction

* **Color Palette**:
  * **Luxury Dark Green**: `#06140E`, `#0B2218`, `#143828`, `#1C4B37` (Velvet presentation backdrops)
  * **Deep Walnut & Mahogany Wood**: `#140A06`, `#22120B`, `#341C11`
  * **Warm Cream & Ivory**: `#FCFBFA`, `#F7F3EC`, `#EFE5D5`
  * **Champagne & Brushed Antique Gold**: `#D4B055`, `#E2C66D`, `#C9A646`
* **Typography**:
  * **Headings**: *Cinzel* & *Cormorant Garamond* (Classic luxury trading house serif typography)
  * **Data & Metrics**: *Outfit* & *Plus Jakarta Sans* (Crisp, high-legibility wholesale figures)
* **Photographic Assets**:
  * **Hero Backdrop**: High-resolution luxury cashew warehouse with stacked crates.
  * **Bulk Stock Section**: Industrial godown with climate-controlled burlap bags and vacuum export tins.
  * **Presentation Velvet Box**: Handcrafted dark walnut box with jumbo whole cashews arranged on emerald green velvet with a brass plaque reading *"PREMIUM CASHEWS - EST. 1928"*.
  * **Delivery Dispatch**: Freight bay with forklifts, export crates, stenciled 50kg bags, and QA manifests.
  * **Trading Desk**: Executive mahogany trading boardroom with grading sample tins (Grade W180, W210) and brass balance scale.
  * **Macro Kernels**: Spotless crescent ivory jumbo whole cashew kernels on rustic teakwood.

---

## 📜 Strict Homepage Flow (Section 3 & 33 Compliance)

The homepage follows the exact flow specified in the Master Prompt:

```
[INTRO & NAMASTE EXPERIENCE]
           ↓
[01 — SHORT HERO: "One Call. Bulk Cashew. Trusted Supply."]
           ↓
[02 — TODAY'S AVAILABLE BULK STOCK: 1,248 Tons • 18 Active Vendors • 6 Varieties]
           ↓
[03 — TODAY'S CASHEW VARIETIES: W210, W240, W320, W400, W450, SW320, JH, Broken]
           ↓
[04 — VARIETY EXPLORER: Side Navigation + Detail Spec Inspector + Bulk Request]
           ↓
[05 — LAST 7 DAYS STOCK: Historical Chart (Mon 980T → Today 1,248T) • Stateless Notice]
           ↓
[06 — WHOLESALE ACTIVITY: Requested 580T → Confirmed 430T → Locked 390T → Delivered 250T]
           ↓
[07 — BULK DELIVERY STATUS: Order #WC-2026-1042 (120T W320, In Transit, 6-Stage Timeline)]
           ↓
[08 — BULK ORDER / COORDINATOR CTA: "Call Coordinator" (+91 98450 82190) & Bulk Request Modal]
```

---

## 🎭 Interactive Role & Persona Switcher

At the very top of the application, a **Trading House Persona Switcher Bar** allows instant switching between all roles to test permissions and privacy boundaries:

1. **🏢 Wholesale Buyer (Public Guest)**:
   * Browses full homepage, explores variety specifications, checks delivery timelines, and submits multi-ton bulk allocation inquiries.
2. **👑 Coordinator (Administrator — Vikramaditya Rao)**:
   * **Global Stock Overview**: Real-time aggregated inventory, active vendors, locked vs free stock.
   * **Vendor Management**: Direct phone dialing (`tel:`), GST numbers, today's declared stock.
   * **Stock Locking Engine**: Modal to lock agreed quantities after verbal confirmation.
   * **Vendor Approval Queue**: Review pending Google registrations; Approve or Reject.
   * **Variety Configuration**: Enable, disable, or add cashew grades.
   * **Delivery Timeline Controls**: Advance bulk freight orders through the 6 stages.
3. **🌾 Approved Vendor A (Rajesh Nair — Malabar Cashew Exports)**:
   * Private portal: "Namaste, Rajesh Nair".
   * Stateless daily stock submission for enabled varieties.
   * Private weekly stock history (own records only; competitor data strictly protected).
4. **🌾 Approved Vendor B (Anand Prabhu — Konkan Coast Agro Traders)**:
   * Alternative approved vendor view with own private records and locked allocations.
5. **⏳ Pending Vendor (Girish Kamat — Goa Royale Cashew Works)**:
   * Experience when a new vendor registers via Google:
   * Shows: **"Registration Submitted — Your vendor account is currently under review by our coordinator. Status: Pending Approval"**.
   * Daily stock submission is locked until coordinator verification.

---

## 🗄️ Database Architecture (`cashew_wholesale.db`)

Built on Python standard library `sqlite3` (zero third-party dependencies required):

| Table | Purpose |
|---|---|
| `users` | Role-based authentication (`coordinator`, `vendor`, `buyer`), Google OAuth identifiers |
| `vendors` | Business name, contact person, phone, GST number, address, `approval_status` |
| `varieties` | Commodity code (W210, W240, W320, etc.), specs, nut count/lb, description, status |
| `daily_stock` | **Stateless daily stock entries** (`vendor_id`, `variety_id`, `stock_date`, `quantity_tons`) |
| `stock_locks` | Coordinator locks (`available_quantity`, `locked_quantity`, `reason`, `locked_by`) |
| `bulk_orders` | Wholesale commercial contracts (`order_reference`, `buyer_company`, `requested_quantity`) |
| `delivery` | 6-stage logistics tracker (`status`, `current_step`, `vehicle_number`, `expected_date`) |

---

## 🚀 How to Run

### Method 1: Python Live Web Server with REST API & SQLite (Recommended)

1. Open PowerShell or Terminal in the project directory:
   ```powershell
   cd "C:\Users\jason.DESKTOP-DNAOIPS\.gemini\antigravity\scratch\royal-cashew-wholesale"
   python server.py
   ```
2. The server initializes and seeds the SQLite database (`cashew_wholesale.db`) and starts at:
   ```
   http://localhost:8080
   ```
3. Open `http://localhost:8080` in your web browser.

### Method 2: Direct File Execution (Zero Server Required)

* Double click or open `index.html` directly in any modern browser.
* The application includes an embedded **High-Performance Memory & LocalStorage Store** that provides full functionality, realistic sample data, state persistence, and role switching even without running Python!

---

## 📞 Chief Trading Coordinator Contact

* **Trading Desk**: Vikramaditya Rao
* **Direct Telephone**: `+91 98450 82190`
* **Headquarters**: Central Cashew Trading Hub, Mangalore Port Terminal Bay 4
* **Bonded Godowns**: Kollam (Kerala), Mangalore (Karnataka), Bicholim (Goa), Ratnagiri (Maharashtra)
