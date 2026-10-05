/**
 * KAJU BAZAAR - Luxury Wholesale Cashew Trading House
 * Godown Entry Cinema Video Controller & Behind-the-Intro Docking
 * 
 * Continuous 3.8s Broadcast-Quality Video:
 * 1. (0.0s - 1.2s): In godown filled with wooden cashew boxes, opening a bulk box.
 * 2. (1.2s - 2.7s): Tilting the box & pouring cascading golden cashew nuts onto emerald velvet cloth.
 * 3. (2.7s - 3.8s): Cashews settled on velvet + Grand Golden "NAMASTE" finale card.
 * 4. (3.8s+): Video docks seamlessly BEHIND the Intro/Hero screen.
 */

(function(window) {
  'use strict';

  const CashewCinema = {
    duration: 4.0, // seconds
    state: 'initial', // 'fullscreen', 'docked', 'playing'

    init() {
      console.log('[CINEMA] Initializing Godown Entry Video Engine...');
      
      if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => this.setupVideo());
      } else {
        this.setupVideo();
      }
    },

    getVideo() {
      return document.getElementById('godown-video');
    },

    setupVideo() {
      const video = this.getVideo();
      const stage = document.getElementById('godown-cinema-stage');
      if (!video || !stage) return;

      this.state = 'playing';
      stage.className = 'cinema-stage cinema-fullscreen';

      // Ensure initial properties
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;

      // Timeupdate listener for timeline progress & badge text
      video.addEventListener('timeupdate', () => {
        const t = video.currentTime;
        const dur = video.duration || this.duration;
        const p = Math.min(100, (t / dur) * 100);

        const pBar = document.getElementById('cinema-progress-fill');
        if (pBar) {
          pBar.style.width = p + '%';
        }

        const badge = document.getElementById('cinema-badge-text');
        if (badge) {
          if (t < 1.0) {
            badge.innerText = 'CENTRAL GODOWN • BULK WOODEN BOXES';
          } else if (t < 2.0) {
            badge.innerText = 'INSPECTION • OPENING BULK JUMBO CASHEW CRATE';
          } else if (t < 3.0) {
            badge.innerText = 'POURING CASHEW NUTS ONTO EMERALD VELVET';
          } else {
            badge.innerText = 'नमस्ते • WELCOME TO KAJU BAZAAR';
          }
        }
      });

      // Video ended event -> transition behind the intro screen
      video.addEventListener('ended', () => {
        if (this.state === 'playing') {
          this.dockBehindIntro();
        }
      });

      // Start playing
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('[CINEMA] Autoplay prevented, waiting for interaction:', err);
          video.muted = true;
          video.play();
        });
      }

      // Safety timeout in case video event doesn't fire
      setTimeout(() => {
        if (this.state === 'playing') {
          this.dockBehindIntro();
        }
      }, 4500);
    },

    toggleAudio() {
      const video = this.getVideo();
      const btn = document.getElementById('cinema-sound-btn');
      if (!video) return;

      video.muted = !video.muted;
      if (!video.muted) {
        video.volume = 1.0;
      }

      if (btn) {
        btn.innerHTML = !video.muted ? '🔊 Sound: ON' : '🔈 Sound: OFF';
        btn.classList.toggle('active', !video.muted);
      }
    },

    dockBehindIntro() {
      this.state = 'docked';
      const stage = document.getElementById('godown-cinema-stage');
      const video = this.getVideo();
      const heroMount = document.getElementById('hero-cinema-mount');

      if (!stage) return;

      // Animate from fullscreen to docked behind intro
      stage.classList.remove('cinema-fullscreen');
      stage.classList.add('cinema-docking');

      setTimeout(() => {
        stage.classList.remove('cinema-docking');
        stage.classList.add('cinema-docked');

        // Attach into heroMount behind the intro screen
        if (heroMount && stage.parentElement !== heroMount) {
          heroMount.appendChild(stage);
        }

        // Loop the video continuously in the background
        if (video) {
          video.loop = true;
          video.currentTime = 0;
          video.play().catch(() => {});
        }

        // Reveal hero content smoothly
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
          heroContent.classList.add('hero-content-revealed');
        }
      }, 650);
    },

    replay() {
      const stage = document.getElementById('godown-cinema-stage');
      const video = this.getVideo();
      if (!stage || !video) return;

      // Move back to document body for fullscreen playback
      if (stage.parentElement !== document.body) {
        document.body.prepend(stage);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });

      this.state = 'playing';
      stage.className = 'cinema-stage cinema-fullscreen';

      video.loop = false;
      video.currentTime = 0;

      const pBar = document.getElementById('cinema-progress-fill');
      if (pBar) pBar.style.width = '0%';

      video.play().catch(() => {});
    },

    skip() {
      this.dockBehindIntro();
    }
  };

  window.CashewCinema = CashewCinema;

  // Initialize
  CashewCinema.init();

})(window);
