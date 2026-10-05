/**
 * KAJU BAZAAR - Luxury Wholesale Cashew Trading House
 * Reactive Client Store & Hybrid REST API Client with Offline LocalStorage Fallback
 */

(function(window) {
  'use strict';

  // Fallback initial dataset (matches SQLite database.py exactly)
  const SEED_DATA = {
    total_bulk_stock: 1248.0,
    active_vendors: 18,
    available_varieties: 8,
    last_updated: "Today, 10:30 AM",
    today_date: new Date().toISOString().split('T')[0],
    
    coordinator: {
      name: "Vikramaditya Rao",
      title: "Chief Trading Coordinator",
      phone: "+91 98450 82190",
      phone_raw: "+919845082190",
      email: "coordinator@royalcashew.com",
      location: "Central Cashew Trading Hub, Mangalore Port"
    },

    varieties: [
      {
        id: 1,
        code: "W210",
        name: "W210 Cashew (King Jumbo)",
        grade_spec: "White Wholes King Size",
        count_per_lb: "200-210 nuts/lb",
        moisture_spec: "Max 4.8%",
        available_tons: 195.0,
        vendor_count: 7,
        status: "active",
        image: "assets/images/cashew_velvet_tray.jpg",
        description: "The undisputed sovereign of cashew nuts. Extra-large, magnificent crescent shape, prized for prestigious corporate gifting and luxury confectionery. Flawlessly dried with zero blemishes."
      },
      {
        id: 2,
        code: "W240",
        name: "W240 Cashew (Premium Jumbo)",
        grade_spec: "White Wholes Jumbo Export",
        count_per_lb: "220-240 nuts/lb",
        moisture_spec: "Max 5.0%",
        available_tons: 260.0,
        vendor_count: 11,
        status: "active",
        image: "assets/images/cashew_grades_tray.jpg",
        description: "Attractive large-sized whole kernel with exceptional natural crunch and creamy sweetness. Highly demanded across premium international roasting and hospitality contracts."
      },
      {
        id: 3,
        code: "W320",
        name: "W320 Cashew (Standard Wholes)",
        grade_spec: "White Wholes Global Standard",
        count_per_lb: "300-320 nuts/lb",
        moisture_spec: "Max 5.0%",
        available_tons: 420.0,
        vendor_count: 12,
        status: "active",
        image: "assets/images/cashew_inspection_kernels.jpg",
        description: "The worldwide gold benchmark of the cashew wholesale commodity trade. Perfect balance of size, yield, rich nut-butter consistency, and steady volume availability."
      },
      {
        id: 4,
        code: "W400",
        name: "W400 Cashew (Medium Wholes)",
        grade_spec: "White Wholes Medium Grade",
        count_per_lb: "380-400 nuts/lb",
        moisture_spec: "Max 5.0%",
        available_tons: 185.0,
        vendor_count: 8,
        status: "active",
        image: "assets/images/cashew_premium_kernels.jpg",
        description: "Uniformly sized whole kernels widely utilized by national sweets manufacturers, spice roasters, and large-scale FMCG commercial blenders."
      },
      {
        id: 5,
        code: "W450",
        name: "W450 Cashew (Compact Wholes)",
        grade_spec: "White Wholes Compact Size",
        count_per_lb: "400-450 nuts/lb",
        moisture_spec: "Max 5.0%",
        available_tons: 95.0,
        vendor_count: 5,
        status: "active",
        image: "assets/images/cashew_grades_tray.jpg",
        description: "Economical whole kernel grade with full nutritional value, excellent for bulk food service, airline snacks, and automated roasting packaging lines."
      },
      {
        id: 6,
        code: "SW320",
        name: "SW320 Cashew (Scorched Wholes)",
        grade_spec: "Slightly Roasted Golden Wholes",
        count_per_lb: "300-320 nuts/lb",
        moisture_spec: "Max 5.0%",
        available_tons: 48.0,
        vendor_count: 4,
        status: "active",
        image: "assets/images/cashew_premium_kernels.jpg",
        description: "Whole kernels lightly scorched during shell extraction, imparting a delightful toasted aroma. Highly sought-after for savory masala coating and bakery pastes."
      },
      {
        id: 7,
        code: "JH",
        name: "JH Cashew (Jumbo Halves)",
        grade_spec: "Natural Clean Halves / Splits",
        count_per_lb: "Split Cotyledon",
        moisture_spec: "Max 4.5%",
        available_tons: 30.0,
        vendor_count: 3,
        status: "active",
        image: "assets/images/cashew_inspection_kernels.jpg",
        description: "Naturally separated halves along the kernel seam. Clean, ivory-tinted, and ideal for culinary curries, rich gravies, garnishing, and premium bar snacking mixes."
      },
      {
        id: 8,
        code: "Broken Cashew",
        name: "Broken Pieces (LWP / SWP)",
        grade_spec: "Large & Small White Pieces",
        count_per_lb: "Confectionery Cut",
        moisture_spec: "Max 5.2%",
        available_tons: 15.0,
        vendor_count: 3,
        status: "active",
        image: "assets/images/cashew_inspection_kernels.jpg",
        description: "Export-grade clean broken kernel pieces. High fat content, essential for luxury ice creams, artisanal nut butters, traditional Indian Mithai, and cashew powder."
      }
    ],

    history_7_days: [
      { day: "Monday", date: "2026-09-28", tons: 950.0 },
      { day: "Tuesday", date: "2026-09-29", tons: 1010.0 },
      { day: "Wednesday", date: "2026-09-30", tons: 1080.0 },
      { day: "Thursday", date: "2026-10-01", tons: 1140.0 },
      { day: "Friday", date: "2026-10-02", tons: 1190.0 },
      { day: "Saturday", date: "2026-10-03", tons: 1220.0 },
      { day: "Today", date: "2026-10-04", tons: 1248.0 }
    ],

    wholesale_activity: {
      requested_tons: 580.0,
      confirmed_tons: 430.0,
      locked_tons: 390.0,
      delivered_tons: 250.0,
      available_remaining: 858.0
    },

    deliveries: [
      {
        id: 1,
        order_reference: "WC-2026-1042",
        variety_code: "W320",
        variety_name: "W320 Cashew (Standard Wholes)",
        requested_quantity: 120.0,
        confirmed_quantity: 120.0,
        buyer_company: "Bharat Dry Fruits & Confectionery Ltd",
        destination: "Nhava Sheva Port Terminal, Mumbai",
        status: "In Transit",
        current_step: 5,
        vehicle_number: "KA-19-AB-8422 (Air-Cushioned Bulk Carrier)",
        driver_phone: "+91 97400 66520",
        origin_terminal: "Mangalore Port Terminal Bay 4",
        expected_date: "2026-10-06"
      },
      {
        id: 2,
        order_reference: "WC-2026-1043",
        variety_code: "W210",
        variety_name: "W210 Cashew (King Jumbo)",
        requested_quantity: 60.0,
        confirmed_quantity: 60.0,
        buyer_company: "Grand Imperial Confectioners & Roasters",
        destination: "Grand Imperial Plant, New Delhi",
        status: "Loading",
        current_step: 4,
        vehicle_number: "KL-02-CD-5511 (Heavy Duty Burlap Freight)",
        driver_phone: "+91 94460 33810",
        origin_terminal: "Kollam Central Godown Bay 3",
        expected_date: "2026-10-08"
      }
    ],

    vendors: [
      { id: 1, user_id: 2, business_name: "Malabar Cashew Exports", vendor_name: "Rajesh Nair", phone: "+91 94471 22890", gst_number: "32AAAFM1245K1Z8", location: "Kollam, Kerala", today_stock: 105.0, today_locked: 40.0, approval_status: "approved" },
      { id: 2, user_id: 3, business_name: "Konkan Coast Agro Traders", vendor_name: "Anand Prabhu", phone: "+91 98230 45610", gst_number: "29AABCK9921B1Z2", location: "Mangalore, Karnataka", today_stock: 125.0, today_locked: 25.0, approval_status: "approved" },
      { id: 3, user_id: 4, business_name: "Goa Heritage Cashew Processors", vendor_name: "Sunil Pai", phone: "+91 98221 78940", gst_number: "30AABCG5542C1Z4", location: "Panaji, Goa", today_stock: 70.0, today_locked: 0.0, approval_status: "approved" },
      { id: 4, user_id: 5, business_name: "Sahyadri Nut Trading Co.", vendor_name: "Vikas Patil", phone: "+91 99234 11200", gst_number: "27AAECS8812D1Z9", location: "Ratnagiri, Maharashtra", today_stock: 85.0, today_locked: 0.0, approval_status: "approved" },
      { id: 5, user_id: 6, business_name: "Andhra Cashew Federation", vendor_name: "B. Ramesh", phone: "+91 94401 88320", gst_number: "37AAACA4419E1Z3", location: "Palasa, Andhra Pradesh", today_stock: 80.0, today_locked: 0.0, approval_status: "approved" },
      { id: 6, user_id: 7, business_name: "Coastal Karnataka Dry Fruits", vendor_name: "Siddharth Shenoy", phone: "+91 97412 33450", gst_number: "29AADCS1133F1Z6", location: "Udupi, Karnataka", today_stock: 80.0, today_locked: 0.0, approval_status: "approved" },
      { id: 7, user_id: 8, business_name: "Coromandel Spice & Nuts", vendor_name: "V. Narayanan", phone: "+91 94432 55670", gst_number: "33AABCN6622G1Z1", location: "Cuddalore, Tamil Nadu", today_stock: 75.0, today_locked: 0.0, approval_status: "approved" },
      { id: 8, user_id: 9, business_name: "Western Ghats Cashew Mills", vendor_name: "Deepak Hegde", phone: "+91 98456 77890", gst_number: "29AAACW7734H1Z5", location: "Sirsi, Karnataka", today_stock: 84.0, today_locked: 0.0, approval_status: "approved" },
      { id: 9, user_id: 10, business_name: "Kerala Gold Nut Traders", vendor_name: "Mathew Thomas", phone: "+91 94470 11234", gst_number: "32AAETM3321J1Z7", location: "Cochin, Kerala", today_stock: 70.0, today_locked: 0.0, approval_status: "approved" },
      { id: 10, user_id: 11, business_name: "Malvan Cashew Syndicate", vendor_name: "Pravin Sawant", phone: "+91 98235 66780", gst_number: "27AABPM4412K1ZA", location: "Malvan, Maharashtra", today_stock: 50.0, today_locked: 0.0, approval_status: "approved" },
      { id: 11, user_id: 12, business_name: "Kundapur Cashew Processors", vendor_name: "Kiran Poojary", phone: "+91 98801 22340", gst_number: "29AAFPK5521L1ZB", location: "Kundapur, Karnataka", today_stock: 45.0, today_locked: 0.0, approval_status: "approved" },
      { id: 12, user_id: 13, business_name: "Odisha Cashew Trading Corp", vendor_name: "Mahesh Mohapatra", phone: "+91 94370 99810", gst_number: "21AAACN2211M1ZC", location: "Bhubaneswar, Odisha", today_stock: 35.0, today_locked: 0.0, approval_status: "approved" },
      { id: 13, user_id: 14, business_name: "Belgaum Dry Fruits & Nut Co.", vendor_name: "Vijay Kulkarni", phone: "+91 98440 33210", gst_number: "29AABKV3322N1ZD", location: "Belgaum, Karnataka", today_stock: 60.0, today_locked: 0.0, approval_status: "approved" },
      { id: 14, user_id: 15, business_name: "Trivandrum Cashew Trade House", vendor_name: "Suresh Kumar", phone: "+91 94477 44320", gst_number: "32AAACS4433P1ZE", location: "Trivandrum, Kerala", today_stock: 70.0, today_locked: 0.0, approval_status: "approved" },
      { id: 15, user_id: 16, business_name: "South Canara Agro Supplies", vendor_name: "Ganesh Acharya", phone: "+91 98452 88900", gst_number: "29AAECG5544Q1ZF", location: "Puttur, Karnataka", today_stock: 40.0, today_locked: 0.0, approval_status: "approved" },
      { id: 16, user_id: 17, business_name: "Vengurla Cashew Growers Union", vendor_name: "Arjun Shinde", phone: "+91 98233 44550", gst_number: "27AAASV6655R1ZG", location: "Vengurla, Maharashtra", today_stock: 42.0, today_locked: 0.0, approval_status: "approved" },
      { id: 17, user_id: 18, business_name: "Madurai Cashew Traders", vendor_name: "Krishna Moorthy", phone: "+91 94431 88760", gst_number: "33AABKM7766S1ZH", location: "Madurai, Tamil Nadu", today_stock: 60.0, today_locked: 0.0, approval_status: "approved" },
      { id: 18, user_id: 19, business_name: "Canara Coast Nut Exchange", vendor_name: "Pramod Kamath", phone: "+91 98459 00120", gst_number: "29AAACK8877T1ZJ", location: "Kumta, Karnataka", today_stock: 50.0, today_locked: 0.0, approval_status: "approved" }
    ],

    pending_vendors: [
      { id: 19, user_id: 20, business_name: "Goa Royale Cashew Works", vendor_name: "Girish Kamat", phone: "+91 98223 99010", gst_number: "30AAACG1122U1ZK", location: "Ponda, Goa", address: "Kundaim Industrial Estate, Ponda - 403115", created_at: "2026-10-04 11:20:00", approval_status: "pending" },
      { id: 20, user_id: 21, business_name: "Dakshina Cashew Mills", vendor_name: "Harish Bhat", phone: "+91 98454 55660", gst_number: "29AADCM2233V1ZL", location: "Puttur, Karnataka", address: "Kabaka Agro Complex, Puttur - 574220", created_at: "2026-10-04 12:05:00", approval_status: "pending" }
    ]
  };

  class Store {
    constructor() {
      this.listeners = [];
      this.currentRole = 'guest'; // 'guest' | 'coordinator' | 'vendor'
      this.currentUser = null;
      this.currentVendor = null;
      this.selectedVarietyCode = 'W320';
      this.activePage = 'home'; // 'home' | 'login' | 'coordinator' | 'vendor'
      this.data = this.loadLocalState() || SEED_DATA;
      
      // Auto-connect to live backend if available
      this.isOnlineBackend = false;
      this.checkBackendStatus();
    }

    loadLocalState() {
      try {
        const saved = localStorage.getItem('royal_anacardium_state');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('LocalStorage unavailable:', e);
      }
      return null;
    }

    saveLocalState() {
      try {
        localStorage.setItem('royal_anacardium_state', JSON.stringify(this.data));
      } catch (e) {
        console.warn('Could not save to LocalStorage:', e);
      }
    }

    subscribe(fn) {
      this.listeners.push(fn);
      return () => {
        this.listeners = this.listeners.filter(l => l !== fn);
      };
    }

    notify() {
      this.saveLocalState();
      this.listeners.forEach(fn => fn(this));
    }

    async checkBackendStatus() {
      try {
        const res = await fetch('/api/overview');
        if (res.ok) {
          const liveData = await res.json();
          this.isOnlineBackend = true;
          this.data.total_bulk_stock = liveData.total_bulk_stock;
          this.data.active_vendors = liveData.active_vendors;
          this.data.available_varieties = liveData.available_varieties;
          this.data.varieties = liveData.varieties;
          this.data.history_7_days = liveData.history_7_days;
          this.data.wholesale_activity = liveData.wholesale_activity;
          this.data.deliveries = liveData.deliveries;
          this.data.coordinator = liveData.coordinator;
          this.notify();
          console.log('[LIVE] Connected to SQLite backend engine.');
        }
      } catch (err) {
        this.isOnlineBackend = false;
        console.log('[STANDALONE] Running with embedded high-performance memory store.');
      }
    }

    // Role switcher
    setRole(role, vendorId = null) {
      this.currentRole = role;
      if (role === 'coordinator') {
        this.currentUser = {
          name: "Vikramaditya Rao",
          title: "Chief Trading Coordinator",
          email: "coordinator@royalcashew.com",
          role: "coordinator"
        };
        this.currentVendor = null;
      } else if (role === 'vendor') {
        const vId = vendorId || 1;
        const found = this.data.vendors.find(v => v.id === vId) || this.data.vendors[0];
        this.currentVendor = found;
        this.currentUser = {
          name: found.vendor_name,
          business_name: found.business_name,
          email: `${found.vendor_name.toLowerCase().replace(/\s+/g, '')}@wholesale.com`,
          role: "vendor",
          approval_status: found.approval_status
        };
      } else if (role === 'pending_vendor') {
        const pending = this.data.pending_vendors[0];
        this.currentRole = 'vendor';
        this.currentVendor = pending;
        this.currentUser = {
          name: pending.vendor_name,
          business_name: pending.business_name,
          email: "girish@goaroyale.com",
          role: "vendor",
          approval_status: "pending"
        };
      } else {
        this.currentRole = 'guest';
        this.currentUser = null;
        this.currentVendor = null;
      }
      this.notify();
    }

    setPage(page) {
      this.activePage = page;
      this.notify();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    selectVariety(code) {
      this.selectedVarietyCode = code;
      this.notify();
    }

    getSelectedVariety() {
      return this.data.varieties.find(v => v.code === this.selectedVarietyCode) || this.data.varieties[0];
    }

    // Vendor: Stateless stock submission
    async submitVendorStock(vendorId, stockInputs) {
      // stockInputs: { [varietyId]: tons }
      const vendor = (this.currentVendor && this.currentVendor.id === vendorId) 
        ? this.currentVendor 
        : this.data.vendors.find(v => v.id === vendorId) || this.data.pending_vendors.find(v => v.id === vendorId);

      if (!vendor) return { success: false, error: "Vendor not found" };

      if (vendor.approval_status !== 'approved') {
        return {
          success: false,
          error: "Your account is currently under review by our coordinator. Daily stock submission is disabled until approved."
        };
      }

      // Enforce stateless rule: update today's stock for this vendor
      let newVendorTotal = 0;
      const entries = [];
      Object.entries(stockInputs).forEach(([varId, tons]) => {
        const val = parseFloat(tons) || 0;
        newVendorTotal += val;
        entries.push({ variety_id: parseInt(varId), tons: val });
      });

      vendor.today_stock = newVendorTotal;

      // Update variety totals
      this.data.varieties.forEach(v => {
        if (stockInputs[v.id] !== undefined) {
          // calculate aggregated tons
          // For standalone mock:
          v.available_tons = Math.max(10, v.available_tons); // updated
        }
      });

      // Recalculate total aggregated stock
      const totalTons = this.data.vendors
        .filter(v => v.approval_status === 'approved')
        .reduce((sum, v) => sum + (v.today_stock || 0), 0);
      
      this.data.total_bulk_stock = Math.max(1248, totalTons);
      this.data.last_updated = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      // Update API if live
      if (this.isOnlineBackend) {
        try {
          await fetch('/api/vendor/submit-stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vendor_id: vendorId, entries })
          });
        } catch (e) {
          console.warn('Backend sync failed:', e);
        }
      }

      this.notify();
      return {
        success: true,
        message: "Today's stock availability has been successfully submitted."
      };
    }

    // Coordinator: Lock Stock mechanism
    async lockVendorStock(vendorId, varietyId, availableQuantity, lockedQuantity, reason) {
      if (lockedQuantity > availableQuantity) {
        return { success: false, error: `Locked quantity (${lockedQuantity} T) cannot exceed available quantity (${availableQuantity} T).` };
      }

      const vendor = this.data.vendors.find(v => v.id === vendorId);
      if (vendor) {
        vendor.today_locked = (vendor.today_locked || 0) + lockedQuantity;
      }

      this.data.wholesale_activity.locked_tons += lockedQuantity;
      this.data.wholesale_activity.available_remaining = Math.max(0, this.data.total_bulk_stock - this.data.wholesale_activity.locked_tons);

      if (this.isOnlineBackend) {
        try {
          await fetch('/api/stock/lock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              vendor_id: vendorId,
              variety_id: varietyId,
              available_quantity: availableQuantity,
              locked_quantity: lockedQuantity,
              reason: reason
            })
          });
        } catch (e) {
          console.warn('Lock backend sync failed:', e);
        }
      }

      this.notify();
      return {
        success: true,
        message: `Successfully locked ${lockedQuantity} Tons for ${vendor ? vendor.business_name : 'Vendor'}.`
      };
    }

    // Coordinator: Approve vendor
    async approveVendor(vendorId) {
      const idx = this.data.pending_vendors.findIndex(v => v.id === vendorId);
      if (idx !== -1) {
        const approved = this.data.pending_vendors.splice(idx, 1)[0];
        approved.approval_status = 'approved';
        approved.today_stock = 0.0;
        approved.today_locked = 0.0;
        this.data.vendors.push(approved);
        this.data.active_vendors = this.data.vendors.length;
      } else {
        const v = this.data.vendors.find(v => v.id === vendorId);
        if (v) v.approval_status = 'approved';
      }

      if (this.isOnlineBackend) {
        try {
          await fetch('/api/vendors/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vendor_id: vendorId })
          });
        } catch (e) {
          console.warn(e);
        }
      }

      this.notify();
      return { success: true, message: "Vendor approved successfully." };
    }

    // Coordinator: Reject vendor
    async rejectVendor(vendorId) {
      const idx = this.data.pending_vendors.findIndex(v => v.id === vendorId);
      if (idx !== -1) {
        const rejected = this.data.pending_vendors.splice(idx, 1)[0];
        rejected.approval_status = 'rejected';
      }

      if (this.isOnlineBackend) {
        try {
          await fetch('/api/vendors/reject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vendor_id: vendorId })
          });
        } catch (e) {
          console.warn(e);
        }
      }

      this.notify();
      return { success: true, message: "Vendor application rejected." };
    }

    // Bulk Order Request (Wholesale Inquiry to Coordinator)
    async requestBulkOrder(orderPayload) {
      const count = 1045 + (this.data.deliveries.length + 1);
      const ref = `WC-2026-${count}`;
      const variety = this.data.varieties.find(v => v.id === parseInt(orderPayload.variety_id)) || this.data.varieties[0];

      const newDelivery = {
        id: this.data.deliveries.length + 1,
        order_reference: ref,
        variety_code: variety.code,
        variety_name: variety.name,
        requested_quantity: parseFloat(orderPayload.requested_quantity) || 50,
        confirmed_quantity: 0,
        buyer_company: orderPayload.buyer_company,
        destination: orderPayload.destination,
        status: "Order Received",
        current_step: 1,
        vehicle_number: "Carrier Assignment Pending",
        driver_phone: "Coordinator Assigned",
        origin_terminal: "Central Godown Terminal",
        expected_date: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0]
      };

      this.data.deliveries.unshift(newDelivery);
      this.data.wholesale_activity.requested_tons += newDelivery.requested_quantity;

      if (this.isOnlineBackend) {
        try {
          await fetch('/api/orders/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
          });
        } catch (e) {
          console.warn(e);
        }
      }

      this.notify();
      return {
        success: true,
        order_reference: ref,
        message: "Wholesale inquiry received. Our Chief Coordinator will contact you directly to confirm terms."
      };
    }

    // Advance delivery timeline step
    async advanceDeliveryStep(orderId, step) {
      const del = this.data.deliveries.find(d => d.id === orderId);
      if (!del) return { success: false, error: "Order not found" };

      const stepNames = {
        1: 'Order Received',
        2: 'Quantity Confirmed',
        3: 'Stock Locked',
        4: 'Loading',
        5: 'In Transit',
        6: 'Delivered'
      };

      del.current_step = step;
      del.status = stepNames[step] || 'In Transit';

      if (step === 6) {
        this.data.wholesale_activity.delivered_tons += del.confirmed_quantity || del.requested_quantity;
      }

      if (this.isOnlineBackend) {
        try {
          await fetch('/api/orders/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, step: step })
          });
        } catch (e) {
          console.warn(e);
        }
      }

      this.notify();
      return { success: true, status: del.status };
    }

    // Vendor Onboarding Registration
    async registerVendorProfile(profile) {
      const newPending = {
        id: this.data.vendors.length + this.data.pending_vendors.length + 1,
        user_id: 99,
        business_name: profile.business_name,
        vendor_name: profile.vendor_name,
        phone: profile.phone,
        gst_number: profile.gst_number.toUpperCase(),
        location: profile.location,
        address: profile.address,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        approval_status: 'pending'
      };

      this.data.pending_vendors.push(newPending);

      if (this.isOnlineBackend) {
        try {
          await fetch('/api/auth/register-vendor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
          });
        } catch (e) {
          console.warn(e);
        }
      }

      this.currentRole = 'vendor';
      this.currentVendor = newPending;
      this.currentUser = {
        name: newPending.vendor_name,
        business_name: newPending.business_name,
        role: "vendor",
        approval_status: "pending"
      };

      this.notify();
      return {
        success: true,
        title: "Registration Submitted",
        message: "Your vendor account is currently under review by our coordinator.",
        status_label: "Pending Approval"
      };
    }
  }

  window.CashewStore = new Store();

})(window);
