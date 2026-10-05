/**
 * KAJU BAZAAR - Luxury Wholesale Cashew Trading House
 * Main Application Orchestrator & Event Controller
 */

(function(window) {
  'use strict';

  const App = {
    init() {
      console.log('[APP] Initializing KAJU BAZAAR Web Platform...');
      this.store = window.CashewStore;
      this.components = window.CashewComponents;

      // Listen to store updates
      this.store.subscribe(() => {
        this.render();
      });

      this.render();
      this.setupNumberAnimation();
    },

    render() {
      const root = document.getElementById('app-root');
      if (!root) return;

      const page = this.store.activePage;
      let content = '';

      // Main Navigation Header
      content += this.components.renderNav(this.store);

      if (page === 'home') {
        // Homepage Flow
        content += this.components.renderNamasteBanner(this.store);
        content += this.components.renderHero(this.store);
        content += this.components.renderTodayStock(this.store);
        content += this.components.renderVarietiesGrid(this.store);
        content += this.components.renderVarietyExplorer(this.store);
        content += this.components.renderWeeklyStock(this.store);
        content += this.components.renderDeliveryStatus(this.store);
        content += this.components.renderCoordinatorCTA(this.store);
        content += this.components.renderFooter(this.store);
      } else if (page === 'coordinator') {
        content += this.components.renderCoordinatorPortal(this.store);
        content += this.components.renderFooter(this.store);
      } else if (page === 'vendor') {
        content += this.components.renderVendorPortal(this.store);
        content += this.components.renderFooter(this.store);
      } else if (page === 'login') {
        content += this.components.renderLoginPage(this.store);
        content += this.components.renderFooter(this.store);
      }

      root.innerHTML = content;

      // Ensure Godown Cinema is docked behind the hero screen if in docked state
      if (page === 'home' && window.CashewCinema && window.CashewCinema.state === 'docked') {
        const stage = document.getElementById('godown-cinema-stage');
        const heroMount = document.getElementById('hero-cinema-mount');
        if (stage && heroMount && stage.parentElement !== heroMount) {
          heroMount.appendChild(stage);
        }
      }
    },

    navigate(page) {
      this.store.setPage(page);
    },

    scrollToSection(id) {
      if (this.store.activePage !== 'home') {
        this.store.setPage('home');
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },

    playLuxuryClickTone() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(680, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1020, ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.10);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.10);
      } catch (e) {}
    },

    selectVariety(code) {
      this.playLuxuryClickTone();
      this.store.selectVariety(code);
      setTimeout(() => {
        const detail = document.querySelector('.explorer-detail');
        if (detail) {
          detail.classList.remove('variety-animating');
          void detail.offsetWidth;
          detail.classList.add('variety-animating');
        }
      }, 10);
    },

    selectAndExplore(code) {
      this.selectVariety(code);
      this.scrollToSection('variety-explorer');
    },

    selectWeeklyDay(day, tons, date, clickedIndex) {
      this.playLuxuryClickTone();
      
      const allBars = document.querySelectorAll('.chart-bar');
      const allCards = document.querySelectorAll('.weekly-day-card');
      
      allBars.forEach((bar, idx) => {
        bar.classList.remove('selected-day-bar', 'bar-pulse-active');
        if (idx === clickedIndex) {
          bar.classList.add('selected-day-bar', 'bar-pulse-active');
        }
      });

      allCards.forEach((card, idx) => {
        card.classList.remove('selected-day-card');
        if (idx === clickedIndex) {
          card.classList.add('selected-day-card');
        }
      });

      const inspector = document.getElementById('weekly-day-inspector');
      if (inspector) {
        const isToday = day === 'Today';
        const formattedDate = date ? date : 'Historical Date';
        const w320Tons = Math.round(tons * 0.34);
        const w240Tons = Math.round(tons * 0.23);
        const otherTons = tons - w320Tons - w240Tons;
        
        inspector.innerHTML = `
          <div class="inspector-inner-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <span class="badge-gold" style="font-size: 0.75rem; padding: 0.25rem 0.65rem;">${day} • ${formattedDate}</span>
                <span style="font-size: 0.82rem; color: var(--gold-300); font-weight: 600;">Verified Daily Ledger Entry</span>
              </div>
              <div style="font-size: 0.78rem; color: var(--cream-muted);">
                Batch Ref: #KB-SURV-${formattedDate.replace(/-/g, '')}
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: center;">
              <div>
                <div style="font-size: 0.72rem; color: var(--cream-muted); text-transform: uppercase; letter-spacing: 0.08em;">Total Volume Recorded</div>
                <div style="font-family: var(--font-serif); font-size: 1.85rem; font-weight: 800; color: #fff;">${tons.toLocaleString()} <span style="font-size: 1rem; color: var(--gold-300);">Metric Tons</span></div>
              </div>
              <div>
                <div style="font-size: 0.72rem; color: var(--cream-muted); text-transform: uppercase; letter-spacing: 0.08em;">Supply Movement Status</div>
                <div style="font-size: 0.95rem; font-weight: 600; color: #86efac; display: flex; align-items: center; gap: 0.35rem;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  ${isToday ? 'Active Live Allocations' : 'Confirmed Inflow Sealed'}
                </div>
              </div>
              <div>
                <div style="font-size: 0.72rem; color: var(--cream-muted); text-transform: uppercase; letter-spacing: 0.08em;">Grade Distribution Breakdown</div>
                <div style="font-size: 0.85rem; color: var(--cream-200);">
                  W320 (${w320Tons} T) • W240 (${w240Tons} T) • Other (${otherTons} T)
                </div>
              </div>
              <div style="text-align: right;">
                <button class="btn-outline-gold" style="font-size: 0.78rem; padding: 0.5rem 1rem;" onclick="CashewApp.openBulkInquiryModal()">
                  Inquire Allocation
                </button>
              </div>
            </div>
          </div>
        `;
        inspector.classList.remove('inspector-animate');
        void inspector.offsetWidth;
        inspector.classList.add('inspector-animate');
      }
    },

    switchRole(role, vendorId = null) {
      this.store.setRole(role, vendorId);
      if (role === 'coordinator') {
        this.showToast("Logged in as Coordinator (Vikramaditya Rao)", "success");
      } else if (role === 'vendor') {
        const v = this.store.currentVendor;
        this.showToast(`Logged in as Vendor: ${v ? v.vendor_name : 'Vendor'}`, "success");
      } else if (role === 'pending_vendor') {
        this.showToast("Logged in as Pending Vendor: Girish Kamat (Under Review)", "warning");
      } else {
        this.showToast("Operating as Wholesale Buyer (Public)", "info");
      }
    },

    // Modal Control
    openModal(modalId) {
      const el = document.getElementById(modalId);
      if (el) el.classList.add('open');
    },

    closeModal(modalId) {
      const el = document.getElementById(modalId);
      if (el) el.classList.remove('open');
    },

    // 1. Bulk Procurement Modal
    openBulkInquiryModal(defaultVarietyId = null) {
      const select = document.getElementById('inquiry-variety-select');
      if (select && defaultVarietyId) {
        select.value = defaultVarietyId;
      }
      this.openModal('modal-bulk-inquiry');
    },

    async handleBulkInquirySubmit(e) {
      e.preventDefault();
      const form = e.target;
      const payload = {
        buyer_company: form.buyer_company.value.trim(),
        buyer_name: form.buyer_name.value.trim(),
        buyer_phone: form.buyer_phone.value.trim(),
        variety_id: form.variety_id.value,
        requested_quantity: form.requested_quantity.value,
        destination: form.destination.value.trim(),
        notes: form.notes.value.trim()
      };

      const res = await this.store.requestBulkOrder(payload);
      this.closeModal('modal-bulk-inquiry');
      form.reset();
      this.showToast(`${res.message} (Reference #${res.order_reference})`, "success");
      this.scrollToSection('delivery-status');
    },

    // 2. Coordinator Contact Modal
    openCoordinatorContactModal() {
      this.openModal('modal-coordinator-contact');
    },

    // 3. Stock Lock Modal (Section 17)
    openStockLockModal(vendorId) {
      const vendor = this.store.data.vendors.find(v => v.id === vendorId);
      if (!vendor) return;

      const vNameEl = document.getElementById('lock-vendor-name');
      const vTonsEl = document.getElementById('lock-available-tons');
      const vIdInput = document.getElementById('lock-vendor-id');

      if (vNameEl) vNameEl.textContent = `${vendor.business_name} (${vendor.vendor_name})`;
      if (vTonsEl) vTonsEl.textContent = `${vendor.today_stock || 100} Tons`;
      if (vIdInput) vIdInput.value = vendor.id;

      this.openModal('modal-stock-lock');
    },

    async handleStockLockSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const vendorId = parseInt(form.vendor_id.value);
      const varietyId = parseInt(form.variety_id.value);
      const lockQty = parseFloat(form.locked_quantity.value);
      const reason = form.reason.value.trim();

      const vendor = this.store.data.vendors.find(v => v.id === vendorId);
      const available = vendor ? (vendor.today_stock || 100) : 100;

      const res = await this.store.lockVendorStock(vendorId, varietyId, available, lockQty, reason);
      if (res.success) {
        this.closeModal('modal-stock-lock');
        form.reset();
        this.showToast(res.message, "success");
      } else {
        alert(res.error);
      }
    },

    // 4. Vendor Stock Entry Submit
    async handleVendorStockSubmit(e, vendorId) {
      e.preventDefault();
      const form = e.target;
      const inputs = {};
      const elements = form.querySelectorAll('input[name^="variety_"]');
      elements.forEach(input => {
        const varId = input.name.replace('variety_', '');
        inputs[varId] = parseFloat(input.value) || 0;
      });

      const res = await this.store.submitVendorStock(vendorId, inputs);
      if (res.success) {
        this.showToast(res.message, "success");
      } else {
        alert(res.error);
      }
    },

    // 5. Vendor Approval
    async approveVendor(vendorId) {
      const res = await this.store.approveVendor(vendorId);
      this.showToast(res.message, "success");
    },

    async rejectVendor(vendorId) {
      const res = await this.store.rejectVendor(vendorId);
      this.showToast(res.message, "info");
    },

    // 6. Delivery Advancement
    async advanceOrderStage(orderId, step) {
      const res = await this.store.advanceDeliveryStep(orderId, step);
      if (res.success) {
        this.showToast(`Delivery status updated to: ${res.status}`, "success");
      }
    },

    // 7. Google Auth Simulation & Vendor Onboarding (Section 2)
    startGoogleAuth() {
      this.openModal('modal-vendor-onboarding');
    },

    async handleVendorOnboardingSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const profile = {
        business_name: form.business_name.value.trim(),
        vendor_name: form.vendor_name.value.trim(),
        phone: form.phone.value.trim(),
        gst_number: form.gst_number.value.trim(),
        location: form.location.value.trim(),
        address: form.address.value.trim()
      };

      const res = await this.store.registerVendorProfile(profile);
      this.closeModal('modal-vendor-onboarding');
      form.reset();

      // Show the exact screen requested in Section 2:
      // "Registration Submitted - Your vendor account is currently under review by our coordinator. Status: Pending Approval"
      this.navigate('vendor');
      this.showToast(`${res.title}: ${res.message} Status: ${res.status_label}`, "warning");
    },

    // Toast Notification helper
    showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = 'toast';
      const borderColors = {
        success: '#a3e635',
        warning: '#f59e0b',
        info: 'var(--gold-400)'
      };
      toast.style.borderColor = borderColors[type] || 'var(--gold-400)';

      toast.innerHTML = `
        <span style="color: ${borderColors[type]}; font-size: 1.1rem;">✦</span>
        <div style="line-height: 1.4;">${message}</div>
      `;

      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 4500);
    },

    setupNumberAnimation() {
      // Gentle count-up on load
      setTimeout(() => {
        const el = document.getElementById('animated-total-stock');
        if (!el) return;
        const target = this.store.data.total_bulk_stock;
        let start = Math.max(0, target - 150);
        const duration = 1200;
        const stepTime = 30;
        const increment = (target - start) / (duration / stepTime);

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            el.textContent = Math.round(start).toLocaleString();
          }
        }, stepTime);
      }, 200);
    }
  };

  window.CashewApp = App;

  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });

})(window);
