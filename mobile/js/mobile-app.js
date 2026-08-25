/**
 * Timetable Mobile Companion App
 * Fullscreen Interactive Vector Timetable with Hamburger Drawer & Card Modals
 */

class MobileTimetableApp {
  constructor() {
    this.state = {
      parsedData: null,
      grid: null,
      themeId: localStorage.getItem('ttstudio_mobile_theme') || 'cyberpunk-neon',
      orientation: localStorage.getItem('ttstudio_mobile_orientation') || 'periods-in-rows',
      viewMode: 'fill', // 'fill' (default pannable) or 'fit' (whole screen)
      showFacultyDirectory: localStorage.getItem('ttstudio_show_faculty_directory') !== 'false',
      attendance: this.loadAttendanceState(),
      spotlightSubject: null,
      activeModalClass: null,
      deferredInstallPrompt: null
    };
  }

  /**
   * Initialize mobile application
   */
  async init() {
    this.registerServiceWorker();
    this.setupPWAInstall();
    this.setupDrawer();
    this.setupModals();
    this.setupEventListeners();

    // 1. Check for URL data parameter first
    const loadedFromUrl = this.loadFromUrlHash();
    if (!loadedFromUrl) {
      // 2. Load from localStorage or fallback to default sample
      this.loadSavedTimetable();
    }

    // 3. Render full-screen timetable & theme gallery
    this.renderTimetable();
    this.renderThemeGallery();
    this.updateDrawerHeader();
  }

  /**
   * Register offline Service Worker
   */
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      const isLocalOrSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocalOrSecure) {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
          .then((reg) => {
            console.log('[PWA] Service Worker registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err);
          });
      }
    }
  }

  /**
   * Capture PWA install prompt & appinstalled events
   */
  setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.state.deferredInstallPrompt = e;
      const installBtn = document.getElementById('drawer-pwa-install-btn');
      if (installBtn) installBtn.classList.remove('hidden');
    });

    window.addEventListener('appinstalled', () => {
      this.state.deferredInstallPrompt = null;
      const installBtn = document.getElementById('drawer-pwa-install-btn');
      if (installBtn) installBtn.classList.add('hidden');
      this.showToast('App installed to Home Screen!', 'success');
    });

    document.getElementById('drawer-pwa-install-btn')?.addEventListener('click', async () => {
      if (this.state.deferredInstallPrompt) {
        this.state.deferredInstallPrompt.prompt();
        const choice = await this.state.deferredInstallPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          this.showToast('Installing to Home Screen...', 'success');
        }
        this.state.deferredInstallPrompt = null;
      } else {
        this.showToast('To add to Home Screen: tap your browser menu (⋮) and choose "Add to Home screen"');
      }
    });
  }

  /**
   * Load timetable from URL hash if provided
   */
  loadFromUrlHash() {
    try {
      const hash = window.location.hash;
      if (hash && hash.includes('data=')) {
        const encoded = hash.split('data=')[1];
        const jsonStr = decodeURIComponent(encoded);
        const parsed = JSON.parse(jsonStr);
        
        if (parsed.t) {
          this.setTimetableData(parsed.t);
          if (parsed.d?.th) this.state.themeId = parsed.d.th;
          if (parsed.d?.o) this.state.orientation = parsed.d.o;
          if (parsed.att) this.mergeAttendance(parsed.att);
          this.saveCurrentTimetable();
          return true;
        }
      }
    } catch (e) {
      console.warn('Could not parse timetable from URL hash:', e);
    }
    return false;
  }

  /**
   * Load saved timetable from localStorage or default sample
   */
  loadSavedTimetable() {
    try {
      const saved = localStorage.getItem('ttstudio_saved_timetable');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.university || parsed.schedule)) {
          this.setTimetableData(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved timetable from localStorage:', e);
    }

    // Default sample (JECRC dataset)
    if (window.SAMPLE_JECRC) {
      this.setTimetableData(window.SAMPLE_JECRC);
    }
  }

  /**
   * Save active timetable to localStorage
   */
  saveCurrentTimetable() {
    if (this.state.parsedData) {
      localStorage.setItem('ttstudio_saved_timetable', JSON.stringify(this.state.parsedData));
      localStorage.setItem('ttstudio_mobile_theme', this.state.themeId);
      localStorage.setItem('ttstudio_mobile_orientation', this.state.orientation);
    }
  }

  /**
   * Set and build timetable data
   */
  setTimetableData(data) {
    this.state.parsedData = data;
    this.state.grid = window.TimetableParser.buildGridMatrix(data);
    this.updateDrawerHeader();
  }

  /**
   * Update drawer header metadata
   */
  updateDrawerHeader() {
    if (!this.state.parsedData) return;
    const p = this.state.parsedData;
    
    const univEl = document.getElementById('drawer-univ-title');
    const deptEl = document.getElementById('drawer-dept-subtitle');
    const secEl = document.getElementById('drawer-badge-sec');
    const semEl = document.getElementById('drawer-badge-sem');

    if (univEl) univEl.textContent = p.university || 'Timetable';
    if (deptEl) deptEl.textContent = p.department || (p.timetableInfo?.title || 'Schedule');
    if (secEl) secEl.textContent = `Sec ${p.timetableInfo?.section || 'DF'}`;
    if (semEl) semEl.textContent = p.timetableInfo?.semester || 'V Sem';
  }

  /**
   * Setup slide-out drawer menu
   */
  setupDrawer() {
    const toggleBtn = document.getElementById('drawer-toggle-btn');
    const closeBtn = document.getElementById('drawer-close-btn');
    const drawer = document.getElementById('drawer-menu');
    const backdrop = document.getElementById('drawer-backdrop');

    const openDrawer = () => {
      drawer?.classList.remove('-translate-x-full');
      backdrop?.classList.remove('opacity-0', 'pointer-events-none');
    };

    const closeDrawer = () => {
      drawer?.classList.add('-translate-x-full');
      backdrop?.classList.add('opacity-0', 'pointer-events-none');
    };

    toggleBtn?.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);
    backdrop?.addEventListener('click', closeDrawer);
  }

  /**
   * Setup modals and triggers
   */
  setupModals() {
    // Attendance modal
    const attModal = document.getElementById('attendance-modal');
    document.getElementById('drawer-att-btn')?.addEventListener('click', () => {
      this.renderAttendanceModal();
      attModal?.classList.remove('hidden');
      attModal?.classList.add('flex');
    });
    document.getElementById('attendance-modal-close')?.addEventListener('click', () => {
      attModal?.classList.add('hidden');
      attModal?.classList.remove('flex');
    });

    // Attendance Backup, Restore & CSV triggers
    document.getElementById('att-backup-btn')?.addEventListener('click', () => {
      this.downloadAttendanceBackup();
    });

    document.getElementById('att-restore-file-input')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) this.restoreAttendanceFromFile(file);
    });

    document.getElementById('att-export-csv-btn')?.addEventListener('click', () => {
      this.downloadAttendanceCSV();
    });

    // Insights modal
    const insModal = document.getElementById('insights-modal');
    document.getElementById('drawer-insights-btn')?.addEventListener('click', () => {
      this.renderInsightsModal();
      insModal?.classList.remove('hidden');
      insModal?.classList.add('flex');
    });
    document.getElementById('insights-modal-close')?.addEventListener('click', () => {
      insModal?.classList.add('hidden');
      insModal?.classList.remove('flex');
    });

    // Theme Picker modal
    const themeModal = document.getElementById('theme-modal');
    document.getElementById('drawer-theme-btn')?.addEventListener('click', () => {
      this.renderThemeGallery();
      themeModal?.classList.remove('hidden');
      themeModal?.classList.add('flex');
    });
    document.getElementById('theme-modal-close')?.addEventListener('click', () => {
      themeModal?.classList.add('hidden');
      themeModal?.classList.remove('flex');
    });
    themeModal?.addEventListener('click', (e) => {
      if (e.target === themeModal) {
        themeModal.classList.add('hidden');
        themeModal.classList.remove('flex');
      }
    });

    // Drawer Fullscreen Notch Button
    document.getElementById('drawer-fullscreen-btn')?.addEventListener('click', () => {
      this.enableFullscreen();
      document.getElementById('drawer-close-btn')?.click();
      this.showToast('Immersive Notch Fullscreen enabled', 'success');
    });

    // Card Detail modal
    const cardModal = document.getElementById('card-modal-backdrop');
    document.getElementById('card-modal-close-btn')?.addEventListener('click', () => {
      cardModal?.classList.add('hidden');
      cardModal?.classList.remove('flex');
    });
    cardModal?.addEventListener('click', (e) => {
      if (e.target === cardModal) {
        cardModal.classList.add('hidden');
        cardModal.classList.remove('flex');
      }
    });

    // Attendance buttons inside card modal
    document.getElementById('modal-card-att-add')?.addEventListener('click', () => {
      if (this.state.activeModalClass) {
        this.markAttendance(this.state.activeModalClass.subject, true);
        this.updateCardModalAttendanceDisplay();
      }
    });

    document.getElementById('modal-card-att-miss')?.addEventListener('click', () => {
      if (this.state.activeModalClass) {
        this.markAttendance(this.state.activeModalClass.subject, false);
        this.updateCardModalAttendanceDisplay();
      }
    });

    // Spotlight button in card modal
    document.getElementById('modal-card-spotlight-btn')?.addEventListener('click', () => {
      if (this.state.activeModalClass) {
        this.setSpotlight(this.state.activeModalClass.subject);
        cardModal?.classList.add('hidden');
        cardModal?.classList.remove('flex');
      }
    });

    // Spotlight clear button in top bar
    document.getElementById('spotlight-clear-btn')?.addEventListener('click', () => {
      this.clearSpotlight();
    });
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // 1. HUD Auto-Hide & Reveal Controller
    this.hudTimer = null;
    this.fullscreenRequested = false;

    const stage = document.getElementById('mobile-fullscreen-stage');
    let touchStartX = 0;
    let touchStartY = 0;
    let isDragging = false;
    let wasDragging = false;
    let wasDraggingTimer = null;
    let isPinching = false;
    const DRAG_THRESHOLD = 10; // px

    // Touch Event Tracking & Pinch-to-Zoom on Stage
    let lastTouchClientX = window.innerWidth / 2;
    let lastTouchClientY = window.innerHeight / 2;
    let initialPinchDistance = 0;
    let initialScaleOnPinch = 1.0;
    let pinchMidX = window.innerWidth / 2;
    let pinchMidY = window.innerHeight / 2;

    stage?.addEventListener('touchstart', (e) => {
      this.enableFullscreen();
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        lastTouchClientX = e.touches[0].clientX;
        lastTouchClientY = e.touches[0].clientY;
        isDragging = false;
        isPinching = false;
      } else if (e.touches.length === 2) {
        isPinching = true;
        isDragging = true;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.hypot(dx, dy);
        initialScaleOnPinch = this.state.currentScale || this.getHeightFitScale();
        pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      }
    }, { passive: true });

    stage?.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && !isDragging) {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        if (Math.hypot(dx, dy) > DRAG_THRESHOLD) {
          isDragging = true;
        }
      } else if (e.touches.length === 2 && initialPinchDistance > 10) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.hypot(dx, dy);
        const pinchRatio = currentDistance / initialPinchDistance;
        const fitScale = this.getHeightFitScale();
        const newScale = Math.max(fitScale * 0.7, Math.min(3.0, initialScaleOnPinch * pinchRatio));
        this.zoomTo(newScale, pinchMidX, pinchMidY, false);
      }
    }, { passive: true });

    stage?.addEventListener('touchend', (e) => {
      if (e.touches.length < 2 && initialPinchDistance > 0) {
        initialPinchDistance = 0;
      }
      if (isDragging || isPinching) {
        wasDragging = true;
        if (wasDraggingTimer) clearTimeout(wasDraggingTimer);
        wasDraggingTimer = setTimeout(() => {
          wasDragging = false;
        }, 120);
      }
      isDragging = false;
      isPinching = false;
    }, { passive: true });

    // Edge swipe listener for opening drawer (only when drawer is closed)
    let edgeStartX = -1;
    let edgeStartY = -1;

    window.addEventListener('touchstart', (e) => {
      const drawer = document.getElementById('drawer-menu');
      const isDrawerOpen = drawer && !drawer.classList.contains('-translate-x-full');
      if (!isDrawerOpen && e.touches.length === 1 && e.touches[0].clientX < 35) {
        edgeStartX = e.touches[0].clientX;
        edgeStartY = e.touches[0].clientY;
      } else {
        edgeStartX = -1;
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (edgeStartX >= 0 && e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - edgeStartX;
        const deltaY = Math.abs(e.changedTouches[0].clientY - edgeStartY);
        if (deltaX > 45 && deltaY < 60) {
          const drawer = document.getElementById('drawer-menu');
          const backdrop = document.getElementById('drawer-backdrop');
          drawer?.classList.remove('-translate-x-full');
          backdrop?.classList.remove('opacity-0', 'pointer-events-none');
        }
        edgeStartX = -1;
      }
    }, { passive: true });

    // 2. View Mode Toggle (Fit / Fill)
    const toggleViewMode = () => {
      this.toggleViewMode();
      this.showHUD(3000);
    };

    document.getElementById('view-mode-toggle-btn')?.addEventListener('click', toggleViewMode);
    document.getElementById('drawer-viewmode-btn')?.addEventListener('click', () => {
      this.toggleViewMode();
      document.getElementById('drawer-close-btn')?.click();
    });

    // 3. Faculty Visibility Toggle
    document.getElementById('drawer-faculty-btn')?.addEventListener('click', () => {
      this.toggleFacultyVisibility();
    });

    // 4. Resize listener for Fit mode adjustment
    window.addEventListener('resize', () => {
      if (this.state.viewMode === 'fit') {
        this.applyViewMode(false);
      }
    });

    // 5. Global Stage Click / Tap & Double-Tap Anywhere Listener (with Drag Filtering)
    let stageLastTapTime = 0;
    let stageSingleTapTimer = null;
    const DOUBLE_TAP_DELAY = 260;

    stage?.addEventListener('click', (e) => {
      // IF USER WAS DRAGGING / PANNING THE TIMETABLE -> SUPPRESS CLICK ACTION!
      if (isDragging || wasDragging) {
        return;
      }

      this.enableFullscreen();
      const now = Date.now();
      const timeSinceLast = now - stageLastTapTime;
      const card = e.target.closest('.class-card');
      const tapX = (e.clientX && e.clientX > 0) ? e.clientX : lastTouchClientX;
      const tapY = (e.clientY && e.clientY > 0) ? e.clientY : lastTouchClientY;

      if (timeSinceLast < DOUBLE_TAP_DELAY && timeSinceLast > 0) {
        // === DOUBLE TAP DETECTED ANYWHERE ===
        stageLastTapTime = 0;
        if (stageSingleTapTimer) {
          clearTimeout(stageSingleTapTimer);
          stageSingleTapTimer = null;
        }
        this.handleDoubleTap(tapX, tapY, card);
      } else {
        // === POTENTIAL SINGLE TAP ===
        stageLastTapTime = now;
        if (card) {
          const subjectText = card.querySelector('.class-subject-text')?.textContent?.trim();
          if (stageSingleTapTimer) clearTimeout(stageSingleTapTimer);

          stageSingleTapTimer = setTimeout(() => {
            stageSingleTapTimer = null;
            stageLastTapTime = 0;
            if (subjectText && !wasDragging) {
              this.openCardModal(subjectText, card);
            }
          }, DOUBLE_TAP_DELAY);
        } else {
          // Single tap on empty space / canvas: Toggle HUD buttons visibility!
          if (stageSingleTapTimer) clearTimeout(stageSingleTapTimer);
          stageSingleTapTimer = setTimeout(() => {
            stageSingleTapTimer = null;
            stageLastTapTime = 0;
            if (!wasDragging) {
              this.toggleHUD();
            }
          }, DOUBLE_TAP_DELAY);
        }
      }
    });

    // 6. Quick flip & drawer flip
    const toggleOrientation = () => {
      this.state.orientation = this.state.orientation === 'periods-in-rows' ? 'periods-in-columns' : 'periods-in-rows';
      localStorage.setItem('ttstudio_mobile_orientation', this.state.orientation);
      const orientText = document.getElementById('drawer-orient-text');
      if (orientText) orientText.textContent = this.state.orientation === 'periods-in-rows' ? 'Periods in Rows' : 'Periods in Columns';
      this.renderTimetable();
      this.showToast(`Switched: ${this.state.orientation === 'periods-in-rows' ? 'Periods in Rows' : 'Periods in Columns'}`);
      this.showHUD(3000);
    };

    document.getElementById('quick-flip-btn')?.addEventListener('click', toggleOrientation);
    document.getElementById('drawer-orient-btn')?.addEventListener('click', toggleOrientation);

    // 7. Save Image button
    document.getElementById('drawer-save-image-btn')?.addEventListener('click', async () => {
      await this.saveTimetableImage();
    });

    // 8. File import in drawer
    document.getElementById('drawer-file-input')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed.format === 'TTStudioBundle' && parsed.timetable) {
            this.setTimetableData(parsed.timetable);
            if (parsed.displaySettings?.themeId) this.applyTheme(parsed.displaySettings.themeId);
            if (parsed.displaySettings?.orientation) this.state.orientation = parsed.displaySettings.orientation;
            if (parsed.attendance) this.mergeAttendance(parsed.attendance);
          } else if (parsed.university || parsed.schedule) {
            this.setTimetableData(parsed);
            if (parsed.attendance) this.mergeAttendance(parsed.attendance);
          } else {
            throw new Error('Unrecognized timetable structure');
          }

          this.saveCurrentTimetable();
          this.renderTimetable();
          this.renderThemeGallery();
          this.showToast(`Loaded ${file.name}!`, 'success');
          document.getElementById('drawer-close-btn')?.click();
        } catch (err) {
          this.showToast(`Import failed: ${err.message}`, 'error');
        }
      };
      reader.readAsText(file);
    });

    // 9. Export .ttstudio bundle
    document.getElementById('drawer-export-bundle-btn')?.addEventListener('click', () => {
      if (!this.state.parsedData) return;
      const cleanName = (this.state.parsedData.university || 'Timetable').replace(/[^a-z0-9_-]/gi, '_');
      window.TimetableExporter.exportBundle(this.state.parsedData, {
        themeId: this.state.themeId,
        orientation: this.state.orientation,
        attendance: this.state.attendance
      }, cleanName);
      this.showToast('Downloaded .ttstudio package with attendance!', 'success');
    });
  }

  /**
   * Request Android Immersive Fullscreen Mode safely
   */
  enableFullscreen() {
    if (this.fullscreenRequested) return;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches || window.navigator.standalone;
    if (!isStandalone && !document.fullscreenElement && document.documentElement.requestFullscreen) {
      this.fullscreenRequested = true;
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  /**
   * Show floating HUD controls with auto-hide timer
   */
  showHUD(duration = 4000) {
    const hud = document.getElementById('mobile-hud-layer');
    if (!hud) return;
    hud.classList.remove('hud-hidden');
    if (this.hudTimer) clearTimeout(this.hudTimer);
    if (duration > 0) {
      this.hudTimer = setTimeout(() => {
        this.hideHUD();
      }, duration);
    }
  }

  /**
   * Hide floating HUD controls
   */
  hideHUD() {
    const hud = document.getElementById('mobile-hud-layer');
    if (hud) hud.classList.add('hud-hidden');
    if (this.hudTimer) {
      clearTimeout(this.hudTimer);
      this.hudTimer = null;
    }
  }

  /**
   * Toggle floating HUD visibility
   */
  toggleHUD() {
    const hud = document.getElementById('mobile-hud-layer');
    if (hud && hud.classList.contains('hud-hidden')) {
      this.showHUD(4000);
    } else {
      this.hideHUD();
    }
  }

  /**
   * Toggle Bottom Faculty Directory Visibility (Immediate dynamic re-render)
   */
  toggleFacultyVisibility() {
    this.state.showFacultyDirectory = !this.state.showFacultyDirectory;
    localStorage.setItem('ttstudio_show_faculty_directory', String(this.state.showFacultyDirectory));
    
    // 1. Re-render the timetable DOM immediately with new bottom directory setting
    this.renderTimetable();
    
    // 2. Update the drawer UI text and toggle badge
    this.updateFacultyDrawerUI();
    
    this.showToast(this.state.showFacultyDirectory ? 'Bottom Directory: Visible' : 'Bottom Directory: Hidden', 'success');
  }

  /**
   * Update Faculty Toggle Drawer UI safely
   */
  updateFacultyDrawerUI() {
    const iconWrap = document.getElementById('faculty-toggle-icon-wrap');
    const text = document.getElementById('drawer-faculty-text');
    const badge = document.getElementById('faculty-toggle-badge');

    if (text) text.textContent = `Bottom Directory: ${this.state.showFacultyDirectory ? 'Visible' : 'Hidden'}`;
    if (badge) badge.textContent = this.state.showFacultyDirectory ? 'Hide' : 'Show';
    if (iconWrap) {
      iconWrap.innerHTML = `<i data-lucide="${this.state.showFacultyDirectory ? 'book-open' : 'book-x'}" class="w-4 h-4 ${this.state.showFacultyDirectory ? 'text-emerald-400' : 'text-slate-400'}"></i>`;
      if (window.lucide) {
        try { lucide.createIcons({ root: iconWrap }); } catch (e) {}
      }
    }
  }

  /**
   * Calculate exact Height-Fit scale factor (fits 100% of display height)
   */
  getHeightFitScale() {
    const container = document.getElementById('mobile-timetable-container');
    const poster = container?.querySelector('.timetable-poster') || container;
    const posterH = poster ? poster.offsetHeight || 880 : 880;
    const displayH = window.innerHeight;
    return displayH / posterH;
  }

  /**
   * Direct focal zoom engine
   */
  zoomTo(targetScale, focalX = null, focalY = null, animate = true) {
    const stage = document.getElementById('mobile-fullscreen-stage');
    const container = document.getElementById('mobile-timetable-container');
    if (!stage || !container) return;

    if (focalX === null) focalX = window.innerWidth / 2;
    if (focalY === null) focalY = window.innerHeight / 2;

    const posterW = 1400;
    const poster = container.querySelector('.timetable-poster');
    const posterH = poster ? poster.offsetHeight || 880 : 880;

    const currentScale = this.state.currentScale || this.getHeightFitScale();

    // Map screen focal coordinate to unscaled poster coordinate
    const unscaledPosterX = (stage.scrollLeft + focalX) / currentScale;
    const unscaledPosterY = (stage.scrollTop + focalY) / currentScale;

    // Calculate new scroll offset to keep focal point anchored
    const targetScrollX = (unscaledPosterX * targetScale) - focalX;
    const targetScrollY = (unscaledPosterY * targetScale) - focalY;

    const maxScrollX = Math.max(0, (posterW * targetScale) - window.innerWidth);
    const maxScrollY = Math.max(0, (posterH * targetScale) - window.innerHeight);

    const clampedScrollX = Math.max(0, Math.min(maxScrollX, targetScrollX));
    const clampedScrollY = Math.max(0, Math.min(maxScrollY, targetScrollY));

    this.state.currentScale = targetScale;

    // Adjust container margin compensation so scroll container dimensions match exact scaled pixels
    container.style.marginRight = `${(posterW * targetScale) - posterW}px`;
    container.style.marginBottom = `${(posterH * targetScale) - posterH}px`;
    container.style.marginLeft = '0px';
    container.style.marginTop = '0px';

    if (animate) {
      this.isAnimating = true;
      container.style.transition = 'transform 0.32s cubic-bezier(0.2, 0, 0, 1)';
      container.style.transform = `scale(${targetScale})`;

      stage.scrollTo({
        left: clampedScrollX,
        top: clampedScrollY,
        behavior: 'smooth'
      });

      setTimeout(() => {
        container.style.transition = 'none';
        this.isAnimating = false;
      }, 340);
    } else {
      container.style.transition = 'none';
      container.style.transform = `scale(${targetScale})`;
      stage.scrollLeft = clampedScrollX;
      stage.scrollTop = clampedScrollY;
    }

    this.updateHUDLabels();
  }

  /**
   * Double-Tap anywhere on the canvas
   */
  handleDoubleTap(tapX, tapY, cardElement) {
    if (this.isAnimating) return;

    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      tapX = rect.left + rect.width / 2;
      tapY = rect.top + rect.height / 2;
    }

    const fitScale = this.getHeightFitScale();

    if (this.state.viewMode === 'fit') {
      this.state.viewMode = 'fill';
      localStorage.setItem('ttstudio_mobile_view_mode', 'fill');
      this.zoomTo(1.0, tapX, tapY, true);
      this.showToast('Fill View (1:1 Full Scale)');
    } else if (this.state.viewMode === 'fill' && cardElement) {
      this.state.viewMode = 'zoom';
      localStorage.setItem('ttstudio_mobile_view_mode', 'zoom');
      this.zoomTo(1.75, tapX, tapY, true);
      this.showToast('Detail Zoom (1.75x)');
    } else {
      this.state.viewMode = 'fit';
      localStorage.setItem('ttstudio_mobile_view_mode', 'fit');
      this.zoomTo(fitScale, tapX, tapY, true);
      this.showToast('Height-Fit (100% Display)');
    }
  }

  /**
   * Toggle View Mode (from button)
   */
  toggleViewMode() {
    if (this.isAnimating) return;
    const fitScale = this.getHeightFitScale();

    if (this.state.viewMode === 'fit') {
      this.state.viewMode = 'fill';
      localStorage.setItem('ttstudio_mobile_view_mode', 'fill');
      this.zoomTo(1.0, window.innerWidth / 2, window.innerHeight / 2, true);
      this.showToast('Fill View (1:1 Full Scale)');
    } else {
      this.state.viewMode = 'fit';
      localStorage.setItem('ttstudio_mobile_view_mode', 'fit');
      this.zoomTo(fitScale, window.innerWidth / 2, window.innerHeight / 2, true);
      this.showToast('Height-Fit (100% Display)');
    }
  }

  /**
   * Apply View Mode
   */
  applyViewMode(animate = false) {
    if (this.state.viewMode === 'fit') {
      const fitScale = this.getHeightFitScale();
      this.zoomTo(fitScale, window.innerWidth / 2, window.innerHeight / 2, animate);
    } else if (this.state.viewMode === 'zoom') {
      this.zoomTo(1.75, window.innerWidth / 2, window.innerHeight / 2, animate);
    } else {
      this.zoomTo(1.0, window.innerWidth / 2, window.innerHeight / 2, animate);
    }
  }

  /**
   * Update HUD labels
   */
  updateHUDLabels() {
    const modeIconWrap = document.getElementById('view-mode-icon-wrap');
    const modeText = document.getElementById('view-mode-text');
    const drawerModeText = document.getElementById('drawer-viewmode-text');

    if (this.state.viewMode === 'fit') {
      if (modeIconWrap) {
        modeIconWrap.innerHTML = `<i data-lucide="maximize-2" class="w-4 h-4 text-blue-400"></i>`;
        if (window.lucide) {
          try { lucide.createIcons({ root: modeIconWrap }); } catch (e) {}
        }
      }
      if (modeText) modeText.textContent = 'Fill';
      if (drawerModeText) drawerModeText.textContent = 'Height-Fit (100% Height)';
    } else if (this.state.viewMode === 'zoom') {
      if (modeIconWrap) {
        modeIconWrap.innerHTML = `<i data-lucide="minimize-2" class="w-4 h-4 text-purple-400"></i>`;
        if (window.lucide) {
          try { lucide.createIcons({ root: modeIconWrap }); } catch (e) {}
        }
      }
      if (modeText) modeText.textContent = 'Fit';
      if (drawerModeText) drawerModeText.textContent = 'Detail Zoom (1.75x)';
    } else {
      if (modeIconWrap) {
        modeIconWrap.innerHTML = `<i data-lucide="minimize-2" class="w-4 h-4 text-blue-400"></i>`;
        if (window.lucide) {
          try { lucide.createIcons({ root: modeIconWrap }); } catch (e) {}
        }
      }
      if (modeText) modeText.textContent = 'Fit';
      if (drawerModeText) drawerModeText.textContent = 'Fill View (1:1 Scale)';
    }
  }

  /**
   * Render Fullscreen Vector Timetable (100% Edge-to-Edge with 0px margins)
   */
  renderTimetable() {
    const container = document.getElementById('mobile-timetable-container');
    if (!container || !this.state.parsedData || !this.state.grid) return;

    const theme = window.getTheme(this.state.themeId);

    // Render using official renderer with full vector precision & canvasMargin: 'none' for 0px notch immersion
    window.TimetableRenderer.render(container, this.state.parsedData, this.state.grid, {
      orientation: this.state.orientation,
      theme: theme,
      showHeader: true,
      showLegend: this.state.showFacultyDirectory,
      showTimeLabels: true,
      highlightLabs: true,
      cellPadding: 'normal',
      borderRadius: 'square',
      fontFamily: 'jakarta',
      showWatermark: true,
      canvasMargin: 'none', // 0px margin, 0px padding, 0px border-radius: extends under notch!
      showFaculty: true
    }, false);

    // Apply View Mode scaling
    this.applyViewMode(false);
    this.updateFacultyDrawerUI();

    // Reapply spotlight if active
    if (this.state.spotlightSubject) {
      this.applySpotlightClasses();
    }
  }

  /**
   * Open interactive card modal
   */
  openCardModal(subjectName, cardElement) {
    if (!this.state.parsedData || !this.state.grid) return;

    // Find class details from grid matrix
    let foundCell = null;
    let foundDay = 'Schedule';
    let foundSlot = null;

    this.state.grid.matrix.forEach((daySlots, dayIdx) => {
      daySlots.forEach((cell, lecIdx) => {
        if (cell.type === 'class' && cell.subject === subjectName) {
          if (!foundCell) {
            foundCell = cell;
            foundDay = this.state.grid.days[dayIdx];
            foundSlot = this.state.grid.timeSlots[lecIdx];
          }
        }
      });
    });

    if (!foundCell) {
      foundCell = { subject: subjectName, venue: 'Room TBA', faculty: 'Instructor' };
    }

    this.state.activeModalClass = foundCell;

    // Populate modal fields
    document.getElementById('modal-card-subject').textContent = foundCell.subject;
    document.getElementById('modal-card-day').textContent = foundDay;
    document.getElementById('modal-card-time').textContent = foundSlot?.time ? `${foundSlot.time} (${foundCell.span || 1} Period)` : `Lecture ${foundCell.lecture || 1}`;
    document.getElementById('modal-card-venue').textContent = foundCell.venue || 'TBA';
    document.getElementById('modal-card-faculty').textContent = foundCell.faculty || 'Faculty TBA';

    this.updateCardModalAttendanceDisplay();

    // Open modal
    const modal = document.getElementById('card-modal-backdrop');
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
  }

  /**
   * Update attendance indicator inside card modal
   */
  updateCardModalAttendanceDisplay() {
    if (!this.state.activeModalClass) return;
    const subj = this.state.activeModalClass.subject;
    const att = this.state.attendance[subj] || { attended: 0, total: 0 };
    const pct = att.total > 0 ? Math.round((att.attended / att.total) * 100) : 100;

    const displayEl = document.getElementById('modal-card-att-pct');
    if (displayEl) {
      displayEl.textContent = `${pct}% (${att.attended}/${att.total})`;
      displayEl.className = `font-mono font-black ${pct >= 75 ? 'text-emerald-400' : 'text-rose-400'}`;
    }
  }

  /**
   * Set Spotlight Mode (highlight subject across the entire week)
   */
  setSpotlight(subjectName) {
    this.state.spotlightSubject = subjectName;
    this.applySpotlightClasses();

    const clearBtn = document.getElementById('spotlight-clear-btn');
    const subjText = document.getElementById('spotlight-subj-text');
    if (clearBtn && subjText) {
      subjText.textContent = subjectName;
      clearBtn.classList.remove('hidden');
    }
    this.showToast(`Spotlighting all "${subjectName}" classes!`);
  }

  /**
   * Apply CSS classes for spotlight
   */
  applySpotlightClasses() {
    const container = document.getElementById('mobile-timetable-container');
    if (!container) return;

    if (this.state.spotlightSubject) {
      container.classList.add('spotlight-active');
      const cards = container.querySelectorAll('.class-card');
      cards.forEach(card => {
        const text = card.querySelector('.class-subject-text')?.textContent?.trim();
        if (text === this.state.spotlightSubject) {
          card.classList.add('spotlight-highlight');
        } else {
          card.classList.remove('spotlight-highlight');
        }
      });
    } else {
      container.classList.remove('spotlight-active');
      container.querySelectorAll('.class-card').forEach(c => c.classList.remove('spotlight-highlight'));
    }
  }

  /**
   * Clear Spotlight Mode
   */
  clearSpotlight() {
    this.state.spotlightSubject = null;
    this.applySpotlightClasses();
    document.getElementById('spotlight-clear-btn')?.classList.add('hidden');
  }

  /**
   * Render Theme Gallery inside theme modal
   */
  renderThemeGallery() {
    const container = document.getElementById('theme-modal-list');
    if (!container || !window.THEMES) return;

    let html = '';
    window.THEMES.forEach(t => {
      const isActive = t.id === this.state.themeId;
      html += `
        <button 
          type="button"
          class="theme-card-picker w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between active:scale-98 ${
            isActive ? 'bg-blue-950/70 border-blue-500 shadow-md ring-2 ring-blue-500/50' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }"
          data-theme-id="${t.id}"
        >
          <div class="flex items-center gap-3 pointer-events-none">
            <div class="flex gap-1 p-1 bg-slate-950/60 rounded-lg border border-white/5">
              ${(t.preview || []).map(c => `<span class="w-3.5 h-3.5 rounded-full border border-black/30 shadow-sm" style="background: ${c};"></span>`).join('')}
            </div>
            <div>
              <div class="text-xs font-bold text-white">${t.name}</div>
              <div class="text-[10px] text-slate-400 font-medium line-clamp-1">${t.description || ''}</div>
            </div>
          </div>
          ${isActive ? '<span class="text-xs text-blue-400 font-black pointer-events-none bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/30">Active ✓</span>' : ''}
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.theme-card-picker').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeId = btn.getAttribute('data-theme-id');
        if (themeId) {
          this.applyTheme(themeId);
          this.renderTimetable();
          this.renderThemeGallery();
          const themeObj = window.THEMES?.find(x => x.id === themeId);
          this.showToast(`Theme: ${themeObj?.name || themeId}`, 'success');

          // Auto close theme modal after brief visual confirmation
          setTimeout(() => {
            const themeModal = document.getElementById('theme-modal');
            themeModal?.classList.add('hidden');
            themeModal?.classList.remove('flex');
          }, 180);
        }
      });
    });
  }

  /**
   * Apply Theme and update page background
   */
  applyTheme(themeId) {
    this.state.themeId = themeId;
    localStorage.setItem('ttstudio_mobile_theme', themeId);

    const themeObj = window.getTheme ? window.getTheme(themeId) : (window.THEMES?.find(t => t.id === themeId) || window.THEMES?.[0]);
    if (themeObj) {
      const nameEl = document.getElementById('drawer-theme-name');
      if (nameEl) nameEl.textContent = themeObj.name;

      if (themeObj.styles?.bg) {
        document.body.style.background = themeObj.styles.bg;
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.setAttribute('content', themeObj.styles.bg);
      }
    }
  }

  // =========================================================================
  // ATTENDANCE STORAGE & BACKUP ENGINE (PERMANENT RETENTION)
  // =========================================================================

  loadAttendanceState() {
    try {
      const saved = localStorage.getItem('ttstudio_attendance');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.warn('Failed to read attendance from localStorage:', e);
      return {};
    }
  }

  saveAttendanceState() {
    try {
      localStorage.setItem('ttstudio_attendance', JSON.stringify(this.state.attendance));
      // Redundant backup snapshot in localStorage
      localStorage.setItem('ttstudio_attendance_backup', JSON.stringify({
        updatedAt: new Date().toISOString(),
        data: this.state.attendance
      }));
    } catch (e) {
      console.warn('Could not save attendance to localStorage:', e);
    }
  }

  /**
   * Intelligently merge attendance records (prevents loss on timetable changes)
   */
  mergeAttendance(importedAttendance) {
    if (!importedAttendance || typeof importedAttendance !== 'object') return;
    
    Object.entries(importedAttendance).forEach(([subj, record]) => {
      if (!record || typeof record !== 'object') return;
      const current = this.state.attendance[subj] || { attended: 0, total: 0 };
      
      this.state.attendance[subj] = {
        attended: Math.max(current.attended || 0, record.attended || 0),
        total: Math.max(current.total || 0, record.total || 0)
      };
    });

    this.saveAttendanceState();
    this.renderAttendanceModal();
    this.updateCardModalAttendanceDisplay();
  }

  /**
   * Mark attendance increment
   */
  markAttendance(subject, isAttended) {
    if (!this.state.attendance[subject]) {
      this.state.attendance[subject] = { attended: 0, total: 0 };
    }

    this.state.attendance[subject].total += 1;
    if (isAttended) {
      this.state.attendance[subject].attended += 1;
    }

    this.saveAttendanceState();
    this.showToast(`Attendance updated for ${subject}!`, 'success');
  }

  /**
   * Edit attendance counts directly
   */
  editAttendanceCounts(subject) {
    const current = this.state.attendance[subject] || { attended: 0, total: 0 };
    const newAtt = prompt(`Enter number of classes attended for "${subject}":`, current.attended);
    if (newAtt === null) return;
    
    const newTot = prompt(`Enter total classes conducted for "${subject}":`, current.total);
    if (newTot === null) return;

    const parsedAtt = parseInt(newAtt, 10);
    const parsedTot = parseInt(newTot, 10);

    if (isNaN(parsedAtt) || isNaN(parsedTot) || parsedAtt < 0 || parsedTot < 0 || parsedAtt > parsedTot) {
      alert('Invalid numbers. Attended classes must be a positive number and cannot exceed total conducted classes.');
      return;
    }

    this.state.attendance[subject] = { attended: parsedAtt, total: parsedTot };
    this.saveAttendanceState();
    this.renderAttendanceModal();
    this.updateCardModalAttendanceDisplay();
    this.showToast(`Updated "${subject}" counts!`, 'success');
  }

  /**
   * 1-Click Download Attendance Backup (.json)
   */
  downloadAttendanceBackup() {
    const backup = {
      app: 'Timetable Studio Attendance Backup',
      exportedAt: new Date().toISOString(),
      university: this.state.parsedData?.university || 'University',
      attendance: this.state.attendance
    };

    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const filename = `attendance_backup_${new Date().toISOString().slice(0, 10)}.json`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    this.showToast(`Downloaded ${filename}!`, 'success');
  }

  /**
   * Restore Attendance from Backup File
   */
  restoreAttendanceFromFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const importedData = parsed.attendance || (parsed.format === 'TTStudioBundle' ? parsed.attendance : parsed);
        
        if (importedData && typeof importedData === 'object') {
          this.mergeAttendance(importedData);
          this.showToast(`Restored attendance from ${file.name}!`, 'success');
        } else {
          throw new Error('No valid attendance structure found in file.');
        }
      } catch (err) {
        this.showToast(`Restore failed: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
  }

  /**
   * Export Attendance Spreadsheet (.csv)
   */
  downloadAttendanceCSV() {
    const subjects = Object.keys(this.calculateInsights().subjectHours);
    let csv = 'Subject,Attended Classes,Total Conducted,Attendance %,Status,Recommendation\n';

    subjects.forEach(subj => {
      const att = this.state.attendance[subj] || { attended: 0, total: 0 };
      const pct = att.total > 0 ? Math.round((att.attended / att.total) * 100) : 100;
      const isSafe = pct >= 75;
      
      let note = 'No classes logged';
      if (att.total > 0) {
        if (isSafe) {
          const safeSkips = Math.floor((att.attended - 0.75 * att.total) / 0.75);
          note = safeSkips > 0 ? `Can miss ${safeSkips} more` : 'At 75% threshold';
        } else {
          const needed = Math.ceil((0.75 * att.total - att.attended) / 0.25);
          note = `Attend ${needed} consecutive`;
        }
      }

      csv += `"${subj}",${att.attended},${att.total},${pct}%,${isSafe ? 'SAFE' : 'SHORTAGE'},"${note}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const filename = `attendance_report_${new Date().toISOString().slice(0, 10)}.csv`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    this.showToast(`Exported ${filename}!`, 'success');
  }

  renderAttendanceModal() {
    const list = document.getElementById('attendance-modal-list');
    if (!list || !this.state.parsedData) return;

    // Combine subjects from current schedule + any previously tracked subjects in attendance storage
    const scheduleSubjects = Object.keys(this.calculateInsights().subjectHours);
    const trackedSubjects = Object.keys(this.state.attendance);
    const allSubjects = Array.from(new Set([...scheduleSubjects, ...trackedSubjects]));

    let html = '';

    allSubjects.forEach(subj => {
      const att = this.state.attendance[subj] || { attended: 0, total: 0 };
      const pct = att.total > 0 ? Math.round((att.attended / att.total) * 100) : 100;
      const isSafe = pct >= 75;

      let advice = '';
      if (att.total > 0) {
        if (isSafe) {
          const safeSkips = Math.floor((att.attended - 0.75 * att.total) / 0.75);
          advice = safeSkips > 0 ? `🟢 Can safely miss ${safeSkips} more class${safeSkips > 1 ? 'es' : ''}` : '🟢 At 75% threshold';
        } else {
          const needed = Math.ceil((0.75 * att.total - att.attended) / 0.25);
          advice = `🔴 Attend ${needed} consecutive class${needed > 1 ? 'es' : ''} to reach 75%`;
        }
      } else {
        advice = '⚪ No attendance logged yet';
      }

      html += `
        <div class="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-1.5">
                <h4 class="font-black text-white text-sm">${subj}</h4>
                <button class="modal-att-edit text-slate-400 hover:text-blue-400 text-[10px] p-0.5" data-subject="${subj}" title="Edit counts manually">✏️</button>
              </div>
              <div class="text-slate-400 font-mono text-[11px]">${att.attended} / ${att.total} Conducted</div>
            </div>
            <span class="text-base font-black ${isSafe ? 'text-emerald-400' : 'text-rose-400'}">${pct}%</span>
          </div>

          <div class="p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-semibold text-slate-300">
            ${advice}
          </div>

          <div class="flex gap-2">
            <button class="modal-att-add flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all active:scale-95" data-subject="${subj}">
              + Attended
            </button>
            <button class="modal-att-miss flex-1 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-bold transition-all active:scale-95" data-subject="${subj}">
              - Missed
            </button>
          </div>
        </div>
      `;
    });

    list.innerHTML = html;

    list.querySelectorAll('.modal-att-add').forEach(b => {
      b.addEventListener('click', () => {
        this.markAttendance(b.dataset.subject, true);
        this.renderAttendanceModal();
      });
    });
    list.querySelectorAll('.modal-att-miss').forEach(b => {
      b.addEventListener('click', () => {
        this.markAttendance(b.dataset.subject, false);
        this.renderAttendanceModal();
      });
    });
    list.querySelectorAll('.modal-att-edit').forEach(b => {
      b.addEventListener('click', () => {
        this.editAttendanceCounts(b.dataset.subject);
      });
    });
  }

  // =========================================================================
  // INSIGHTS MODAL
  // =========================================================================

  calculateInsights() {
    let totalClasses = 0;
    let totalHours = 0;
    let labHours = 0;
    let lectureHours = 0;
    const subjectHours = {};
    const facultyLoad = {};

    if (this.state.grid) {
      this.state.grid.matrix.forEach(day => {
        day.forEach(cell => {
          if (cell.type === 'class') {
            const span = cell.span || 1;
            totalClasses += 1;
            totalHours += span;

            if (cell.isLab) labHours += span;
            else lectureHours += span;

            subjectHours[cell.subject] = (subjectHours[cell.subject] || 0) + span;
            if (cell.faculty) {
              if (!facultyLoad[cell.faculty]) {
                facultyLoad[cell.faculty] = { faculty: cell.faculty, subject: cell.subject, hours: 0 };
              }
              facultyLoad[cell.faculty].hours += span;
            }
          }
        });
      });
    }

    return {
      totalClasses,
      totalHours,
      labHours,
      lectureHours,
      subjectHours,
      facultyList: Object.values(facultyLoad)
    };
  }

  renderInsightsModal() {
    const body = document.getElementById('insights-modal-body');
    if (!body || !this.state.parsedData) return;

    const insights = this.calculateInsights();
    const theme = window.getTheme(this.state.themeId);
    const subjectColorMap = window.getSubjectColorMap(this.state.parsedData.schedule, this.state.parsedData.faculty, theme);

    let html = `
      <!-- Metrics Overview -->
      <div class="grid grid-cols-2 gap-2 text-xs mb-3">
        <div class="p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div class="text-[10px] text-slate-400 uppercase font-bold">Total Workload</div>
          <div class="text-lg font-black text-white">${insights.totalHours} Hours/Wk</div>
          <div class="text-[10px] text-emerald-400 font-semibold">${insights.totalClasses} Total Sessions</div>
        </div>

        <div class="p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div class="text-[10px] text-slate-400 uppercase font-bold">Theory vs Labs</div>
          <div class="text-lg font-black text-amber-400">${insights.labHours}h Labs</div>
          <div class="text-[10px] text-slate-400 font-semibold">${insights.lectureHours}h Theory</div>
        </div>
      </div>

      <!-- Subject Hours -->
      <div class="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 mb-3">
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-300">Subject Distribution</h4>
        <div class="space-y-2">
    `;

    Object.entries(insights.subjectHours).forEach(([subj, hours]) => {
      const pct = Math.round((hours / insights.totalHours) * 100);
      const color = subjectColorMap[subj] || { border: '#3b82f6' };

      html += `
        <div class="space-y-1 text-xs">
          <div class="flex items-center justify-between font-bold text-slate-200">
            <span>${subj}</span>
            <span class="text-slate-400 font-mono text-[11px]">${hours}h (${pct}%)</span>
          </div>
          <div class="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div class="h-full rounded-full" style="width: ${pct}%; background: ${color.border || '#3b82f6'};"></div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>

      <!-- Faculty List -->
      <div class="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-300">Faculty Directory</h4>
        <div class="space-y-1.5">
    `;

    insights.facultyList.forEach(fac => {
      html += `
        <div class="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <div class="font-bold text-white">👤 ${fac.faculty}</div>
            <div class="text-[10px] text-blue-400 font-semibold">${fac.subject}</div>
          </div>
          <span class="font-mono text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">${fac.hours}h/wk</span>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    body.innerHTML = html;
  }

  /**
   * Save Timetable Image
   */
  async saveTimetableImage() {
    if (!this.state.parsedData || !this.state.grid) return;
    this.showToast('Generating high-res image...', 'info');

    try {
      const filename = (this.state.parsedData.university || 'Timetable').replace(/[^a-z0-9_-]/gi, '_') + '_Mobile';
      await window.TimetableExporter.downloadImage(
        this.state.parsedData,
        this.state.grid,
        filename,
        {
          format: 'jpeg',
          scale: 2,
          quality: 0.95,
          theme: window.getTheme(this.state.themeId),
          orientation: this.state.orientation,
          canvasMargin: 'poster'
        }
      );
      this.showToast('Saved image to downloads!', 'success');
    } catch (err) {
      this.showToast(`Export failed: ${err.message}`, 'error');
    }
  }

  /**
   * Toast notification
   */
  showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white shadow-2xl z-50 transition-all ${
      type === 'success' ? 'bg-emerald-600 shadow-emerald-900/50' : type === 'error' ? 'bg-rose-600 shadow-rose-900/50' : 'bg-slate-900 border border-slate-700 shadow-black/80'
    }`;
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.mobileApp = new MobileTimetableApp();
  window.mobileApp.init();
});
