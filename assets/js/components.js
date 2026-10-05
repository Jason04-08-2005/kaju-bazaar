/**
 * KAJU BAZAAR - Luxury Wholesale Cashew Trading House
 * UI Component Renderers
 */

(function(window) {
  'use strict';

  const Components = {

    // Top Persona Switcher Bar (Removed as requested)
    renderRoleBanner(store) {
      return '';
    },

    // Main Navigation Header
    renderNav(store) {
      const page = store.activePage;
      const role = store.currentRole;

      let portalLink = '';
      if (role === 'coordinator') {
        portalLink = `
          <li>
            <a class="${page === 'coordinator' ? 'active' : ''}" onclick="CashewApp.navigate('coordinator')">
              👑 Coordinator Ops
            </a>
          </li>
        `;
      } else if (role === 'vendor') {
        portalLink = `
          <li>
            <a class="${page === 'vendor' ? 'active' : ''}" onclick="CashewApp.navigate('vendor')">
              🌾 Vendor Stock Portal
            </a>
          </li>
        `;
      }

      return `
        <nav class="main-nav">
          <div class="nav-container">
            <a class="brand-logo" href="#" onclick="CashewApp.navigate('home')">
              <div class="brand-crest">KB</div>
              <div class="brand-text">
                <h1>KAJU BAZAAR</h1>
              </div>
            </a>

            <ul class="nav-links">
              <li><a class="${page === 'home' ? 'active' : ''}" onclick="CashewApp.navigate('home')">Home</a></li>
              <li><a href="#today-stock" onclick="CashewApp.scrollToSection('today-stock')">Today's Stock</a></li>
              <li><a href="#varieties-grid" onclick="CashewApp.scrollToSection('varieties-grid')">Varieties</a></li>
              <li><a href="#variety-explorer" onclick="CashewApp.scrollToSection('variety-explorer')">Variety Explorer</a></li>
              <li><a href="#weekly-stock" onclick="CashewApp.scrollToSection('weekly-stock')">Weekly Availability</a></li>
              <li><a href="#delivery-status" onclick="CashewApp.scrollToSection('delivery-status')">Bulk Delivery</a></li>
              ${portalLink}
            </ul>

            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <a href="tel:${store.data.coordinator.phone_raw}" class="btn-outline-gold" style="padding: 0.55rem 1.15rem; font-size: 0.78rem;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Call Coordinator
              </a>

              ${role !== 'guest' ? `
                <div style="display: flex; align-items: center; gap: 0.65rem;">
                  <button class="btn-gold" style="padding: 0.55rem 1rem; font-size: 0.75rem;" onclick="CashewApp.navigate('${role}')">
                    ${role === 'coordinator' ? 'Coordinator Panel' : 'My Stock'}
                  </button>
                  <button class="btn-outline-gold" style="padding: 0.55rem 0.85rem; font-size: 0.75rem;" onclick="CashewApp.switchRole('guest')">
                    Logout
                  </button>
                </div>
              ` : ''}
            </div>
          </div>
        </nav>
      `;
    },

    // Personalized Namaste Banner (Section 24 - Clean, badge & line below removed)
    renderNamasteBanner(store) {
      const role = store.currentRole;
      const vendor = store.currentVendor;

      let title = "Namaste — Welcome to KAJU BAZAAR Wholesale Trading House.";

      if (role === 'coordinator') {
        title = "Namaste, Coordinator Vikramaditya Rao";
      } else if (role === 'vendor' && vendor) {
        if (vendor.approval_status === 'approved') {
          title = `Namaste, ${vendor.vendor_name} (${vendor.business_name})`;
        } else {
          title = `Namaste, ${vendor.vendor_name} — Account Under Review`;
        }
      }

      return `
        <div style="background: radial-gradient(circle at 50% 0%, rgba(28, 75, 55, 0.4) 0%, rgba(6, 20, 14, 0.95) 100%); border-bottom: 1px solid rgba(212, 176, 85, 0.25); padding: 1.25rem 1.5rem;">
          <div style="max-width: 1360px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h2 style="font-family: var(--font-serif); font-size: 1.5rem; color: #fff; margin: 0;">
                ${title}
              </h2>
            </div>
            <div>
              <button class="btn-outline-gold" onclick="CashewApp.openBulkInquiryModal()" style="font-size: 0.78rem; padding: 0.55rem 1.25rem;">
                Request Bulk Quantity
              </button>
            </div>
          </div>
        </div>
      `;
    },

    // 01. Short Hero Section (Section 4 & 5 & 33)
    renderHero(store) {
      return `
        <section style="padding-top: 2rem; padding-bottom: 3.5rem;">
          <div class="hero-wrapper" id="hero-wrapper-box">
            <!-- Behind-the-Intro Docked Cinema Mount -->
            <div id="hero-cinema-mount" style="position: absolute; inset: 0; z-index: 1;"></div>
            <div class="hero-bg" style="background-image: url('assets/images/velvet_cashew_settle.jpg');"></div>
            <div class="hero-overlay"></div>
            <div class="hero-content">
              <h2 class="hero-headline" style="margin-bottom: 2rem;">
                One Call. <span>Bulk Cashew.</span><br />Trusted Supply.
              </h2>
              <div class="hero-buttons">
                <button class="btn-gold" onclick="CashewApp.scrollToSection('today-stock')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                  View Today's Bulk Stock
                </button>
                <button class="btn-outline-gold" onclick="CashewApp.openCoordinatorContactModal()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Contact Coordinator
                </button>
                <button class="btn-outline-gold" onclick="CashewCinema.replay()" style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(6, 20, 14, 0.65); backdrop-filter: blur(8px);">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Replay Godown Film (3s)
                </button>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // 02. Today's Available Bulk Stock Section (Section 6 & 33 - Line below, active vendors, request allocation removed)
    renderTodayStock(store) {
      const totalTons = store.data.total_bulk_stock;
      const varietiesCount = store.data.available_varieties;
      const updatedTime = store.data.last_updated;

      return `
        <section id="today-stock">
          <h2 class="section-title">Today's Available Bulk Stock</h2>

          <div class="stock-grid" style="margin-top: 1.5rem;">
            <!-- Large Premium Stock Card -->
            <div class="stock-headline-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div class="stock-tag">TODAY'S BULK STOCK</div>
                <div class="badge-available">Live Supply Network</div>
              </div>

              <div style="display: flex; align-items: baseline; margin: 1.5rem 0;">
                <span class="stock-big-number" id="animated-total-stock">${totalTons.toLocaleString()}</span>
                <span class="stock-big-unit">Tons</span>
              </div>
              <div class="stock-subheading">Available Across Certified Warehouses Today</div>

              <div class="stock-divider"></div>

              <div class="stock-meta-row">
                <div class="stock-meta-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-400)" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <span>Available Varieties: <strong>${varietiesCount} Grades</strong></span>
                </div>
                <div class="stock-meta-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-400)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>Last Updated: <strong>${updatedTime}</strong></span>
                </div>
              </div>

              <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                <button class="btn-outline-gold" onclick="CashewApp.scrollToSection('variety-explorer')" style="font-size: 0.8rem; padding: 0.75rem 1.5rem;">
                  Inspect Grade Breakdown
                </button>
              </div>
            </div>

            <!-- Luxury Godown Warehouse Visual (Full of wooden boxes, no jute bags) -->
            <div class="stock-image-card">
              <img src="assets/images/cashew_godown_stock.jpg" alt="Luxury Cashew Godown Wooden Boxes Stock" />
              <div class="stock-image-caption">
                <div style="font-family: var(--font-serif); font-size: 0.95rem; font-weight: 700; color: var(--gold-300);">
                  Central Godowns — Wooden Bulk Box Storage Facility
                </div>
                <div style="font-size: 0.78rem; color: var(--cream-muted);">
                  Floor-to-ceiling bulk wooden storage boxes and sealed export containers stacked under strict climate control. Zero burlap or jute bags.
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // 03. Today's Cashew Varieties (Commodity Grades Whole details & Network supply removed)
    renderVarietiesGrid(store) {
      const varieties = store.data.varieties;

      return `
        <section id="varieties-grid">
          <h2 class="section-title">Today's Cashew Varieties</h2>

          <div class="varieties-grid" style="margin-top: 1.5rem;">
            ${varieties.map(v => `
              <div class="variety-card" onclick="CashewApp.selectAndExplore('${v.code}')">
                <div class="variety-img-wrap">
                  <img src="${v.image}" alt="${v.name}" />
                  <div class="variety-code-badge">${v.code}</div>
                  <div style="position: absolute; bottom: 8px; right: 8px;">
                    <span class="badge-available">Available</span>
                  </div>
                </div>

                <h3 style="margin-bottom: 1.25rem;">${v.code} Cashew</h3>

                <div class="variety-stat-row">
                  <div>
                    <div style="font-size: 0.7rem; text-transform: uppercase; color: var(--cream-muted);">Available Stock</div>
                    <div class="variety-tons">${v.available_tons.toLocaleString()} <span style="font-size: 0.85rem; font-weight: 500; color: var(--gold-400);">Tons</span></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    },

    // 04. Variety Explorer (Side Nav + Detail View) (Section 8, 9, 33)
    renderVarietyExplorer(store) {
      const varieties = store.data.varieties;
      const selected = store.getSelectedVariety();

      return `
        <section id="variety-explorer">
          <div class="section-label">04 — VARIETY EXPLORER</div>
          <h2 class="section-title">Interactive Variety Inspector</h2>
          <p class="section-subtitle">
            Select a variety from the left side panel to review granular specifications, current tonnage availability, kernel moisture metrics, and wholesale procurement options.
          </p>

          <div class="explorer-container">
            <!-- Left Side Variety Navigation -->
            <div class="explorer-sidebar">
              <h4>CASHEW VARIETIES</h4>
              ${varieties.map(v => `
                <div class="variety-nav-item ${v.code === selected.code ? 'active' : ''}" onclick="CashewApp.selectVariety('${v.code}')">
                  <span style="font-weight: 600;">${v.code}</span>
                  <span class="nav-tons">${v.available_tons} T</span>
                </div>
              `).join('')}
            </div>

            <!-- Detail View -->
            <div class="explorer-detail">
              <div class="explorer-image-box">
                <img src="${selected.image}" alt="${selected.name}" />
                <div style="position: absolute; top: 15px; left: 15px;">
                  <span class="variety-code-badge" style="font-size: 1rem; padding: 0.4rem 0.9rem;">
                    GRADE ${selected.code}
                  </span>
                </div>
              </div>

              <div>
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                  <span class="badge-available">Available Today</span>
                  <span style="font-size: 0.75rem; color: var(--gold-400);">Export Quality White Wholes</span>
                </div>

                <h3 style="font-family: var(--font-serif); font-size: 2rem; color: #fff; margin-bottom: 0.35rem;">
                  ${selected.name}
                </h3>
                <div style="font-size: 0.9rem; color: var(--gold-300); font-weight: 500; margin-bottom: 1.25rem;">
                  ${selected.grade_spec} • Kernel Benchmark
                </div>

                <p style="font-size: 0.92rem; color: var(--cream-200); line-height: 1.7; margin-bottom: 1.5rem;">
                  ${selected.description}
                </p>

                <div class="detail-specs-grid">
                  <div class="spec-box">
                    <div class="spec-label">Today's Available Stock</div>
                    <div class="spec-value text-gold-gradient">${selected.available_tons.toLocaleString()} Tons</div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-label">Active Approved Vendors</div>
                    <div class="spec-value">${selected.vendor_count} Processors</div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-label">Kernel Count Spec</div>
                    <div class="spec-value" style="font-size: 0.95rem;">${selected.count_per_lb}</div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-label">Moisture Specification</div>
                    <div class="spec-value" style="font-size: 0.95rem;">${selected.moisture_spec}</div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                  <button class="btn-gold" onclick="CashewApp.openBulkInquiryModal('${selected.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Request Bulk Quantity (${selected.code})
                  </button>
                  <a href="tel:${store.data.coordinator.phone_raw}" class="btn-outline-gold">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Speak With Coordinator
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // 05. Last 7 Days Stock (Weekly Stock Availability) (Section 10 & 33)
    renderWeeklyStock(store) {
      const history = store.data.history_7_days;
      const maxVal = Math.max(...history.map(h => h.tons), 1300);

      return `
        <section id="weekly-stock">
          <div class="section-label">05 — HISTORICAL SURVEILLANCE</div>
          <h2 class="section-title">Weekly Stock Availability</h2>
          <p class="section-subtitle">
            Track aggregate daily stock availability across the previous 7 trading sessions. Observe wholesale supply trends, harvesting inflows, and high/low availability windows.
          </p>

          <div class="chart-card">
            <div class="chart-header">
              <div>
                <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: #fff;">Wholesale Stock Movement (Last 7 Days)</h3>
                <div style="font-size: 0.85rem; color: var(--cream-muted);">Daily Aggregated Volume (Metric Tons)</div>
              </div>
              <div style="display: flex; align-items: center; gap: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem;">
                  <span style="width: 12px; height: 12px; border-radius: 2px; background: #d4b055;"></span>
                  <span>Previous Days</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem;">
                  <span style="width: 12px; height: 12px; border-radius: 2px; background: #e2c66d; box-shadow: 0 0 8px #d4b055;"></span>
                  <span style="font-weight: 700; color: var(--gold-300);">Today's Availability</span>
                </div>
              </div>
            </div>

            <!-- CSS Bar Chart with Tooltips & Interactive Click Animation -->
            <div class="chart-bars-wrap">
              ${history.map((h, i) => {
                const heightPct = Math.round((h.tons / maxVal) * 95);
                const isToday = h.day === 'Today';
                const isSelected = isToday;
                return `
                  <div class="chart-col" onclick="CashewApp.selectWeeklyDay('${h.day}', ${h.tons}, '${h.date}', ${i})">
                    <div class="chart-bar ${isToday ? 'today-bar' : ''} ${isSelected ? 'selected-day-bar' : ''}" style="height: ${heightPct}%;">
                      <div class="bar-tooltip">${h.tons} T</div>
                    </div>
                    <div class="chart-label ${isToday ? 'today-label' : ''}">
                      ${h.day}<br />
                      <span style="font-size: 0.72rem; color: var(--cream-muted);">${h.date.substring(5)}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Historical Data Cards with Interactive Click Animation -->
            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.75rem; text-align: center; margin-bottom: 1.5rem;">
              ${history.map((h, i) => {
                const isToday = h.day === 'Today';
                return `
                  <div class="weekly-day-card ${isToday ? 'selected-day-card' : ''}" onclick="CashewApp.selectWeeklyDay('${h.day}', ${h.tons}, '${h.date}', ${i})">
                    <div style="font-size: 0.7rem; color: var(--cream-muted); text-transform: uppercase;">${h.day}</div>
                    <div style="font-size: 1.1rem; font-weight: 700; color: ${isToday ? 'var(--gold-300)' : '#fff'};">${h.tons} T</div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Interactive Day Inspector Card (Reveals on Click with Animation) -->
            <div id="weekly-day-inspector" class="weekly-day-inspector inspector-animate" style="margin-bottom: 1.5rem;">
              <div class="inspector-inner-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.65rem;">
                    <span class="badge-gold" style="font-size: 0.75rem; padding: 0.25rem 0.65rem;">Today • ${history[history.length - 1].date}</span>
                    <span style="font-size: 0.82rem; color: var(--gold-300); font-weight: 600;">Verified Daily Ledger Entry</span>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--cream-muted);">
                    Batch Ref: #KB-SURV-${history[history.length - 1].date.replace(/-/g, '')}
                  </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: center;">
                  <div>
                    <div style="font-size: 0.72rem; color: var(--cream-muted); text-transform: uppercase; letter-spacing: 0.08em;">Total Volume Recorded</div>
                    <div style="font-family: var(--font-serif); font-size: 1.85rem; font-weight: 800; color: #fff;">${history[history.length - 1].tons.toLocaleString()} <span style="font-size: 1rem; color: var(--gold-300);">Metric Tons</span></div>
                  </div>
                  <div>
                    <div style="font-size: 0.72rem; color: var(--cream-muted); text-transform: uppercase; letter-spacing: 0.08em;">Supply Movement Status</div>
                    <div style="font-size: 0.95rem; font-weight: 600; color: #86efac; display: flex; align-items: center; gap: 0.35rem;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                      Active Live Allocations
                    </div>
                  </div>
                  <div>
                    <div style="font-size: 0.72rem; color: var(--cream-muted); text-transform: uppercase; letter-spacing: 0.08em;">Grade Distribution Breakdown</div>
                    <div style="font-size: 0.85rem; color: var(--cream-200);">
                      W320 (424 T) • W240 (287 T) • W210 (212 T)
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <button class="btn-outline-gold" style="font-size: 0.78rem; padding: 0.5rem 1rem;" onclick="CashewApp.openBulkInquiryModal()">
                      Inquire Allocation
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="chart-disclaimer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-400)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div>
                <strong>Stateless Fresh Daily Entries:</strong> Our platform strictly avoids automatic mathematical roll-overs. Every day represents an authentic fresh declaration by verified processors. The weekly chart reflects pure historical availability records.
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // 06. Wholesale Order Activity (Commerce Coordinator details removed per user instruction)
    renderWholesaleActivity(store) {
      return '';
    },

    // 07. Bulk Delivery Flow Chart (One Call -> Collective -> Confirmed)
    renderDeliveryStatus(store) {
      return `
        <section id="delivery-status" style="margin-bottom: 3.5rem;">
          <h2 class="section-title">Bulk Delivery</h2>

          <div class="delivery-flowchart">
            <!-- Step 1: One Call -->
            <div class="flow-card">
              <div class="flow-step-tag">01</div>
              <div class="flow-icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold-300)" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <h3 class="flow-card-title">One Call</h3>
              <span class="flow-badge">Direct Call</span>
            </div>

            <!-- Flow Connector 1 -->
            <div class="flow-connector">
              <div class="flow-line"></div>
              <div class="flow-arrow-circle">
                <svg class="flow-arrow-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div class="flow-line"></div>
            </div>

            <!-- Step 2: Collective (Consortium Network Theme & Icon) -->
            <div class="flow-card flow-card-collective">
              <div class="flow-step-tag">02</div>
              <div class="flow-icon-circle flow-icon-collective">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold-300)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 class="flow-card-title">Collective</h3>
              <span class="flow-badge">Partner Network</span>
            </div>

            <!-- Flow Connector 2 -->
            <div class="flow-connector">
              <div class="flow-line"></div>
              <div class="flow-arrow-circle">
                <svg class="flow-arrow-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div class="flow-line"></div>
            </div>

            <!-- Step 3: Confirmed -->
            <div class="flow-card">
              <div class="flow-step-tag">03</div>
              <div class="flow-icon-circle flow-icon-success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#86efac" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 class="flow-card-title">Confirmed</h3>
              <span class="flow-badge flow-badge-success">Stock Locked</span>
            </div>
          </div>
        </section>
      `;
    },

    // 08. Bulk Order / Coordinator CTA (Section 13 & 33)
    renderCoordinatorCTA(store) {
      const coord = store.data.coordinator;

      return `
        <section id="coordinator-cta">
          <div class="cta-banner">
            <div>
              <div class="section-label" style="color: var(--gold-300);">08 — DIRECT PROCUREMENT</div>
              <h2 style="font-family: var(--font-serif); font-size: 2.6rem; color: #fff; font-weight: 700; margin-bottom: 1rem; line-height: 1.2;">
                Need Bulk Cashew Supply?
              </h2>
              <p style="font-size: 1.1rem; color: var(--cream-200); margin-bottom: 2rem; max-width: 580px; font-weight: 300;">
                Discuss your required quantity directly with our Chief Coordinator. We confirm quality specs, allocate bonded warehouse stock, and coordinate prompt multi-ton dispatches.
              </p>

              <div style="display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;">
                <a href="tel:${coord.phone_raw}" class="btn-gold" style="padding: 1rem 2.25rem; font-size: 0.95rem;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Call Coordinator (${coord.phone})
                </a>
                <button class="btn-outline-gold" onclick="CashewApp.openBulkInquiryModal()" style="padding: 1rem 1.85rem; font-size: 0.95rem;">
                  Request Bulk Quantity
                </button>
              </div>
            </div>

            <!-- Coordinator Contact Card -->
            <div class="cta-coordinator-badge">
              <img src="assets/images/cashew_coordinator_interaction.jpg" alt="Trading House Coordinator" class="coordinator-avatar" />
              <div>
                <div style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: #fff;">
                  ${coord.name}
                </div>
                <div style="font-size: 0.8rem; color: var(--gold-400); margin-bottom: 0.35rem;">
                  ${coord.title}
                </div>
                <div style="font-size: 0.82rem; color: var(--cream-muted);">
                  📍 ${coord.location}
                </div>
                <div style="margin-top: 0.65rem;">
                  <span class="badge-available">Available on Line</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
    },

    // Footer
    renderFooter(store) {
      return `
        <footer style="background: #040d08; border-top: 1px solid rgba(212, 176, 85, 0.2); padding: 4rem 1.5rem 2rem; color: var(--cream-muted);">
          <div style="max-width: 1360px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1.2fr 1.2fr; gap: 3rem; margin-bottom: 3rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.25rem;">
                <div class="brand-crest">KB</div>
                <div>
                  <h3 style="font-family: var(--font-serif); font-size: 1.2rem; color: #fff; letter-spacing: 0.1em; margin: 0;">KAJU BAZAAR</h3>
                </div>
              </div>
              <p style="font-size: 0.85rem; line-height: 1.7; max-width: 320px;">
                Premier wholesale platform for primary cashew processors, commodity traders, and commercial confectionery buyers. Built for trusted bulk transactions.
              </p>
            </div>

            <div>
              <h4 style="font-family: var(--font-serif); font-size: 0.9rem; color: var(--gold-300); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem;">Trading Navigation</h4>
              <ul style="list-style: none; font-size: 0.88rem; line-height: 2;">
                <li><a href="#today-stock" style="color: var(--cream-muted); text-decoration: none;" onclick="CashewApp.scrollToSection('today-stock')">Today's Available Stock</a></li>
                <li><a href="#varieties-grid" style="color: var(--cream-muted); text-decoration: none;" onclick="CashewApp.scrollToSection('varieties-grid')">Commodity Varieties</a></li>
                <li><a href="#variety-explorer" style="color: var(--cream-muted); text-decoration: none;" onclick="CashewApp.scrollToSection('variety-explorer')">Variety Explorer</a></li>
                <li><a href="#weekly-stock" style="color: var(--cream-muted); text-decoration: none;" onclick="CashewApp.scrollToSection('weekly-stock')">Weekly Stock Movement</a></li>
                <li><a href="#delivery-status" style="color: var(--cream-muted); text-decoration: none;" onclick="CashewApp.scrollToSection('delivery-status')">Delivery Tracking</a></li>
              </ul>
            </div>

            <div>
              <h4 style="font-family: var(--font-serif); font-size: 0.9rem; color: var(--gold-300); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.25rem;">Chief Coordinator</h4>
              <div style="font-size: 0.88rem; line-height: 1.8;">
                <div style="color: #fff; font-weight: 600;">Vikramaditya Rao</div>
                <div>Mangalore Port Trading Terminal</div>
                <div style="color: var(--gold-400); font-weight: 600;">+91 98450 82190</div>
                <div>coordinator@kajubazaar.com</div>
              </div>
            </div>
          </div>

          <div style="max-width: 1360px; margin: 0 auto; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; font-size: 0.78rem;">
            <div>© 2026 KAJU BAZAAR Wholesale Trading House. All rights reserved.</div>
            <div style="color: var(--gold-400);">Stateless Daily Stock Intelligence • Certified Quality Grading</div>
          </div>
        </footer>
      `;
    },

    // Coordinator / Admin Operations Dashboard (Sections 14 - 19)
    renderCoordinatorPortal(store) {
      const totalTons = store.data.total_bulk_stock;
      const activeVendors = store.data.vendors;
      const pendingVendors = store.data.pending_vendors;
      const varieties = store.data.varieties;
      const act = store.data.wholesale_activity;
      const deliveries = store.data.deliveries;

      return `
        <div style="max-width: 1360px; margin: 2rem auto; padding: 0 1.5rem;">
          <!-- Top Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div class="section-label">COORDINATOR CONTROL ROOM</div>
              <h1 style="font-family: var(--font-serif); font-size: 2.4rem; color: #fff;">
                Wholesale Operations & Vendor Network
              </h1>
              <p style="font-size: 0.95rem; color: var(--cream-muted);">
                Global stock aggregation, vendor management, verbal stock locking, and bulk fulfillment oversight.
              </p>
            </div>
            <div style="display: flex; gap: 0.75rem;">
              <button class="btn-gold" onclick="CashewApp.openVarietyConfigModal()">
                + Manage Varieties
              </button>
              <button class="btn-outline-gold" onclick="CashewApp.navigate('home')">
                ← Return to Homepage
              </button>
            </div>
          </div>

          <!-- Section 15: Admin Global Stock KPI Cards -->
          <div class="activity-grid" style="margin-bottom: 2.5rem;">
            <div class="activity-metric-card">
              <div class="label">Total Available Today</div>
              <div class="tons text-gold-gradient">${totalTons.toLocaleString()} T</div>
              <div style="font-size: 0.8rem; color: var(--cream-muted);">Aggregated across ${activeVendors.length} active approved vendors</div>
            </div>
            <div class="activity-metric-card">
              <div class="label">Active Approved Vendors</div>
              <div class="tons">${activeVendors.length}</div>
              <div style="font-size: 0.8rem; color: var(--cream-muted);">${pendingVendors.length} pending applications under review</div>
            </div>
            <div class="activity-metric-card">
              <div class="label">Total Locked Quantity</div>
              <div class="tons" style="color: #f59e0b;">${act.locked_tons} T</div>
              <div style="font-size: 0.8rem; color: var(--cream-muted);">Agreed verbal & export locks</div>
            </div>
            <div class="activity-metric-card">
              <div class="label">Available Free Quantity</div>
              <div class="tons" style="color: #a3e635;">${act.available_remaining} T</div>
              <div style="font-size: 0.8rem; color: var(--cream-muted);">Ready for immediate spot allocation</div>
            </div>
          </div>

          <!-- Section 18: Pending Vendor Registrations -->
          <div class="luxury-card" style="padding: 2rem; margin-bottom: 2.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <div>
                <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: #fff;">
                  Pending Vendor Registrations (${pendingVendors.length})
                </h3>
                <p style="font-size: 0.85rem; color: var(--cream-muted);">
                  Vendors who signed in via Google and completed business profile submission. Daily stock entry is blocked until approved.
                </p>
              </div>
            </div>

            ${pendingVendors.length === 0 ? `
              <div style="padding: 2rem; text-align: center; color: var(--cream-muted); background: rgba(6,20,14,0.3); border-radius: 8px;">
                No pending vendor registrations. All vendors are currently processed.
              </div>
            ` : `
              <div class="luxury-table-wrap">
                <table class="luxury-table">
                  <thead>
                    <tr>
                      <th>Vendor / Business</th>
                      <th>Representative</th>
                      <th>Phone</th>
                      <th>GST Number</th>
                      <th>Location</th>
                      <th>Registered</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${pendingVendors.map(pv => `
                      <tr>
                        <td><strong style="color: #fff;">${pv.business_name}</strong></td>
                        <td>${pv.vendor_name}</td>
                        <td><a href="tel:${pv.phone.replace(/\s+/g,'')}" style="color: var(--gold-300);">${pv.phone}</a></td>
                        <td><code style="color: var(--gold-400); font-size: 0.8rem;">${pv.gst_number}</code></td>
                        <td>${pv.location}</td>
                        <td style="font-size: 0.8rem; color: var(--cream-muted);">${pv.created_at || 'Today'}</td>
                        <td><span class="badge-pending">Pending Review</span></td>
                        <td>
                          <div style="display: flex; gap: 0.5rem;">
                            <button class="btn-gold" style="padding: 0.4rem 0.85rem; font-size: 0.75rem;" onclick="CashewApp.approveVendor(${pv.id})">
                              Approve
                            </button>
                            <button class="btn-outline-gold" style="padding: 0.4rem 0.85rem; font-size: 0.75rem; border-color: #ef4444; color: #f87171;" onclick="CashewApp.rejectVendor(${pv.id})">
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>

          <!-- Section 16 & 17: Vendor Management Table & Stock Locking -->
          <div class="luxury-card" style="padding: 2rem; margin-bottom: 2.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: #fff;">
                  Active Vendor Network (${activeVendors.length})
                </h3>
                <p style="font-size: 0.85rem; color: var(--cream-muted);">
                  Direct verbal telephone coordination and manual stock locking.
                </p>
              </div>
            </div>

            <div class="luxury-table-wrap">
              <table class="luxury-table">
                <thead>
                  <tr>
                    <th>Vendor Business</th>
                    <th>Contact Person</th>
                    <th>Phone (Direct)</th>
                    <th>GST Number</th>
                    <th>Location</th>
                    <th>Today's Stock</th>
                    <th>Locked Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${activeVendors.map(v => `
                    <tr>
                      <td><strong style="color: #fff;">${v.business_name}</strong></td>
                      <td>${v.vendor_name}</td>
                      <td>
                        <a href="tel:${v.phone.replace(/\s+/g,'')}" style="color: var(--gold-300); text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          ${v.phone}
                        </a>
                      </td>
                      <td><code style="color: var(--gold-400); font-size: 0.8rem;">${v.gst_number}</code></td>
                      <td>${v.location}</td>
                      <td><strong style="color: #fff;">${v.today_stock || 0} T</strong></td>
                      <td>
                        ${(v.today_locked && v.today_locked > 0) ? `
                          <span class="badge-locked" style="font-size: 0.75rem;">Locked: ${v.today_locked} T</span>
                        ` : `
                          <span style="color: var(--cream-muted); font-size: 0.8rem;">0 T</span>
                        `}
                      </td>
                      <td><span class="badge-available">Active</span></td>
                      <td>
                        <div style="display: flex; gap: 0.5rem;">
                          <a href="tel:${v.phone.replace(/\s+/g,'')}" class="btn-outline-gold" style="padding: 0.35rem 0.75rem; font-size: 0.72rem;">
                            Call
                          </a>
                          <button class="btn-gold" style="padding: 0.35rem 0.75rem; font-size: 0.72rem;" onclick="CashewApp.openStockLockModal(${v.id})">
                            Lock Stock
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 19: Variety Configuration Management -->
          <div class="luxury-card" style="padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <div>
                <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: #fff;">
                  Cashew Variety Management (${varieties.length} Configured)
                </h3>
                <p style="font-size: 0.85rem; color: var(--cream-muted);">
                  When a variety is enabled, approved vendors can select it during their daily stock entry.
                </p>
              </div>
            </div>

            <div class="varieties-grid">
              ${varieties.map(v => `
                <div style="background: rgba(6, 20, 14, 0.6); border: 1px solid rgba(212, 176, 85, 0.2); border-radius: 8px; padding: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <span class="variety-code-badge" style="position: static;">${v.code}</span>
                    <span class="${v.status === 'active' ? 'badge-available' : 'badge-pending'}">${v.status}</span>
                  </div>
                  <h4 style="font-family: var(--font-serif); font-size: 1.1rem; color: #fff; margin-bottom: 0.35rem;">${v.name}</h4>
                  <div style="font-size: 0.8rem; color: var(--gold-300); margin-bottom: 0.75rem;">${v.count_per_lb} • ${v.grade_spec}</div>
                  <div style="font-size: 0.82rem; color: var(--cream-muted); margin-bottom: 1rem;">
                    Today's Available: <strong>${v.available_tons} Tons</strong> (${v.vendor_count} vendors)
                  </div>
                  <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-outline-gold" style="width: 100%; padding: 0.4rem; font-size: 0.72rem;" onclick="CashewApp.toggleVarietyStatus(${v.id})">
                      ${v.status === 'active' ? 'Disable Variety' : 'Enable Variety'}
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    },

    // Vendor Operations Portal (Sections 20 - 23)
    renderVendorPortal(store) {
      const vendor = store.currentVendor || store.data.vendors[0];
      const varieties = store.data.varieties.filter(v => v.status === 'active');
      const isPending = vendor.approval_status === 'pending';

      return `
        <div style="max-width: 1100px; margin: 2rem auto; padding: 0 1.5rem;">
          <!-- Top Vendor Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div class="section-label">VENDOR OPERATIONS PORTAL</div>
              <h1 style="font-family: var(--font-serif); font-size: 2.2rem; color: #fff;">
                Namaste, ${vendor.vendor_name}
              </h1>
              <p style="font-size: 0.95rem; color: var(--cream-muted);">
                ${vendor.business_name} • GST: <code style="color: var(--gold-400);">${vendor.gst_number}</code> • ${vendor.location}
              </p>
            </div>
            <div>
              <button class="btn-outline-gold" onclick="CashewApp.navigate('home')">
                ← Return to Homepage
              </button>
            </div>
          </div>

          <!-- Pending Approval Warning Banner -->
          ${isPending ? `
            <div style="background: rgba(180, 83, 9, 0.25); border: 1px solid #f59e0b; border-radius: 12px; padding: 2rem; margin-bottom: 2.5rem; text-align: center;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" style="margin-bottom: 0.75rem;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <h2 style="font-family: var(--font-serif); font-size: 1.6rem; color: #fff; margin-bottom: 0.5rem;">
                Registration Submitted — Under Review
              </h2>
              <p style="font-size: 1rem; color: var(--cream-200); max-width: 600px; margin: 0 auto 1.5rem; line-height: 1.6;">
                Your vendor account for <strong>${vendor.business_name}</strong> is currently under review by our coordinator.
                You will receive verbal phone verification on <strong>${vendor.phone}</strong>. Daily stock submission is temporarily disabled until approved.
              </p>
              <div style="display: inline-block;">
                <span class="badge-pending" style="font-size: 0.85rem; padding: 0.4rem 1rem;">Status: Pending Approval</span>
              </div>
            </div>
          ` : `
            <!-- Section 21 & 22: Today's Daily Stock Entry (Stateless Rule) -->
            <div class="luxury-card" style="padding: 2.5rem; margin-bottom: 2.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <div style="font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold-400);">STATELESS FRESH SUBMISSION</div>
                  <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: #fff; margin-top: 0.25rem;">
                    Today's Stock Entry (${store.data.today_date})
                  </h3>
                  <p style="font-size: 0.88rem; color: var(--cream-muted);">
                    Enter your fresh warehouse availability for each variety. This submission sets today's active stock (yesterday's numbers are never rolled over).
                  </p>
                </div>
                <div>
                  <span class="badge-available">Approved Processor</span>
                </div>
              </div>

              <form id="vendor-stock-form" onsubmit="CashewApp.handleVendorStockSubmit(event, ${vendor.id})">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                  ${varieties.map(v => `
                    <div style="background: rgba(6, 20, 14, 0.6); border: 1px solid rgba(212, 176, 85, 0.25); border-radius: 8px; padding: 1.25rem;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span class="variety-code-badge" style="position: static;">${v.code}</span>
                        <span style="font-size: 0.72rem; color: var(--cream-muted);">${v.count_per_lb}</span>
                      </div>
                      <label style="display: block; font-size: 0.78rem; text-transform: uppercase; color: var(--gold-300); margin-bottom: 0.4rem;">
                        Available (Tons)
                      </label>
                      <input 
                        type="number" 
                        step="0.5" 
                        min="0" 
                        name="variety_${v.id}" 
                        placeholder="Enter Tons" 
                        class="form-input" 
                        style="font-size: 1.2rem; font-weight: 700; color: var(--gold-300);"
                        value="${v.id === 1 ? '35' : v.id === 2 ? '25' : v.id === 3 ? '45' : '0'}"
                      />
                    </div>
                  `).join('')}
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                  <div style="font-size: 0.82rem; color: var(--cream-muted);">
                    ⚠️ Submitting replaces today's declared availability across the coordinator network.
                  </div>
                  <button type="submit" class="btn-gold" style="padding: 0.9rem 2.25rem; font-size: 0.9rem;">
                    Submit Today's Availability
                  </button>
                </div>
              </form>
            </div>
          `}

          <!-- Section 23: Vendor Weekly History (Own entries only - Strict privacy) -->
          <div class="luxury-card" style="padding: 2.25rem;">
            <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: #fff; margin-bottom: 0.5rem;">
              My Weekly Stock History (Private Log)
            </h3>
            <p style="font-size: 0.85rem; color: var(--cream-muted); margin-bottom: 1.5rem;">
              Displaying historical entries strictly for <strong>${vendor.business_name}</strong>. Global numbers and other vendors are hidden.
            </p>

            <div class="luxury-table-wrap">
              <table class="luxury-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>W210</th>
                    <th>W240</th>
                    <th>W320</th>
                    <th>W400</th>
                    <th>Other Grades</th>
                    <th>My Daily Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Today (${store.data.today_date})</strong></td>
                    <td>35 T</td>
                    <td>25 T</td>
                    <td>45 T</td>
                    <td>0 T</td>
                    <td>0 T</td>
                    <td><strong style="color: var(--gold-300);">${vendor.today_stock || 105} Tons</strong></td>
                  </tr>
                  <tr>
                    <td>Oct 03</td>
                    <td>20 T</td>
                    <td>40 T</td>
                    <td>95 T</td>
                    <td>0 T</td>
                    <td>0 T</td>
                    <td>155 Tons</td>
                  </tr>
                  <tr>
                    <td>Oct 02</td>
                    <td>30 T</td>
                    <td>45 T</td>
                    <td>100 T</td>
                    <td>0 T</td>
                    <td>0 T</td>
                    <td>175 Tons</td>
                  </tr>
                  <tr>
                    <td>Oct 01</td>
                    <td>25 T</td>
                    <td>50 T</td>
                    <td>85 T</td>
                    <td>0 T</td>
                    <td>0 T</td>
                    <td>160 Tons</td>
                  </tr>
                  <tr>
                    <td>Sep 30</td>
                    <td>30 T</td>
                    <td>40 T</td>
                    <td>90 T</td>
                    <td>0 T</td>
                    <td>0 T</td>
                    <td>160 Tons</td>
                  </tr>
                  <tr>
                    <td>Sep 29</td>
                    <td>25 T</td>
                    <td>35 T</td>
                    <td>75 T</td>
                    <td>0 T</td>
                    <td>0 T</td>
                    <td>135 Tons</td>
                  </tr>
                  <tr>
                    <td>Sep 28</td>
                    <td>20 T</td>
                    <td>40 T</td>
                    <td>80 T</td>
                    <td>0 T</td>
                    <td>0 T</td>
                    <td>140 Tons</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    },

    // Clean, Familiar Login Experience (Section 2)
    renderLoginPage(store) {
      return `
        <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1.5rem;">
          <div style="width: 100%; max-width: 440px; background: radial-gradient(circle at 50% 0%, #153e2d 0%, #0b2218 60%, #06140e 100%); border: 1px solid var(--gold-400); border-radius: 14px; box-shadow: 0 25px 60px rgba(0,0,0,0.85), var(--glow-gold); padding: 2.75rem 2.25rem;">
            <!-- Brand Crest -->
            <div style="text-align: center; margin-bottom: 2rem;">
              <div class="brand-crest" style="margin: 0 auto 1rem; width: 54px; height: 54px; font-size: 1.5rem;">KB</div>
              <h2 style="font-family: var(--font-serif); font-size: 1.6rem; color: #fff; margin-bottom: 0.35rem;">
                KAJU BAZAAR
              </h2>
              <div style="font-size: 0.85rem; color: var(--gold-300); letter-spacing: 0.05em;">
                Wholesale Stock & Bulk Order Management
              </div>
            </div>

            <!-- Primary Login Buttons -->
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
              <button class="btn-gold" style="width: 100%; padding: 0.95rem; font-size: 0.88rem;" onclick="CashewApp.startGoogleAuth()">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                Continue with Google
              </button>

              <button class="btn-outline-gold" style="width: 100%; padding: 0.95rem; font-size: 0.88rem;" onclick="CashewApp.switchRole('vendor', 1)">
                🌾 Vendor Login (Direct)
              </button>

              <button class="btn-outline-gold" style="width: 100%; padding: 0.95rem; font-size: 0.88rem;" onclick="CashewApp.switchRole('coordinator')">
                👑 Coordinator Login (Admin)
              </button>
            </div>

            <!-- Supporting Notice -->
            <div style="border-top: 1px solid rgba(212, 176, 85, 0.2); padding-top: 1.5rem; text-align: center;">
              <p style="font-size: 0.78rem; color: var(--cream-muted); line-height: 1.6;">
                By signing in, you agree to KAJU BAZAAR's Wholesale Terms of Trade & Direct Negotiation Code.
              </p>
              <div style="margin-top: 1rem;">
                <a href="#" onclick="CashewApp.navigate('home')" style="color: var(--gold-400); font-size: 0.8rem; text-decoration: none;">
                  ← Back to Public Wholesale Stock
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };

  window.CashewComponents = Components;

})(window);
