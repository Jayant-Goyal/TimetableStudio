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
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('ServiceWorker registration error:', err);
      });
    }
  }

  /**
   * Capture PWA install prompt
   */
  setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.state.deferredInstallPrompt = e;
      const installBtn = document.getElementById('drawer-pwa-install-btn');
      if (installBtn) installBtn.classList.remove('hidden');
    });

    document.getElementById('drawer-pwa-install-btn')?.addEventListener('click', async () => {
      if (this.state.deferredInstallPrompt) {
        this.state.deferredInstallPrompt.prompt();
        const { outcome } = await this.state.deferredInstallPrompt.userChoice;
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
    // Quick flip & drawer flip
    const toggleOrientation = () => {
      this.state.orientation = this.state.orientation === 'periods-in-rows' ? 'periods-in-columns' : 'periods-in-rows';
      localStorage.setItem('ttstudio_mobile_orientation', this.state.orientation);
      const orientText = document.getElementById('drawer-orient-text');
      if (orientText) orientText.textContent = this.state.orientation === 'periods-in-rows' ? 'Periods in Rows' : 'Periods in Columns';
      this.renderTimetable();
      this.showToast(`Switched: ${this.state.orientation === 'periods-in-rows' ? 'Periods in Rows' : 'Periods in Columns'}`);
    };

    document.getElementById('quick-flip-btn')?.addEventListener('click', toggleOrientation);
    document.getElementById('drawer-orient-btn')?.addEventListener('click', toggleOrientation);

    // Save Image button
    document.getElementById('drawer-save-image-btn')?.addEventListener('click', async () => {
      await this.saveTimetableImage();
    });

    // File import in drawer
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
          } else if (parsed.university || parsed.schedule) {
            this.setTimetableData(parsed);
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

    // Export .ttstudio bundle
    document.getElementById('drawer-export-bundle-btn')?.addEventListener('click', () => {
      if (!this.state.parsedData) return;
      const cleanName = (this.state.parsedData.university || 'Timetable').replace(/[^a-z0-9_-]/gi, '_');
      window.TimetableExporter.exportBundle(this.state.parsedData, {
        themeId: this.state.themeId,
        orientation: this.state.orientation
      }, cleanName);
      this.showToast('Downloaded .ttstudio package!', 'success');
    });
  }

  /**
   * Render Fullscreen Vector Timetable
   */
  renderTimetable() {
    const container = document.getElementById('mobile-timetable-container');
    if (!container || !this.state.parsedData || !this.state.grid) return;

    const theme = window.getTheme(this.state.themeId);

    // Render using official renderer with full vector precision
    window.TimetableRenderer.render(container, this.state.parsedData, this.state.grid, {
      orientation: this.state.orientation,
      theme: theme,
      showHeader: true,
      showLegend: true,
      showTimeLabels: true,
      highlightLabs: true,
      cellPadding: 'normal',
      borderRadius: 'rounded',
      fontFamily: 'jakarta',
      showWatermark: true,
      canvasMargin: 'poster'
    }, false);

    // Attach interactive card clicks
    this.attachCardInteractivity();

    // Reapply spotlight if active
    if (this.state.spotlightSubject) {
      this.applySpotlightClasses();
    }
  }

  /**
   * Attach click / tap listener on every class card
   */
  attachCardInteractivity() {
    const container = document.getElementById('mobile-timetable-container');
    if (!container || !this.state.grid) return;

    const cards = container.querySelectorAll('.class-card');
    cards.forEach(card => {
      const subjectText = card.querySelector('.class-subject-text')?.textContent?.trim();
      if (!subjectText) return;

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openCardModal(subjectText, card);
      });
    });
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
   * Render Theme Gallery inside drawer
   */
  renderThemeGallery() {
    const container = document.getElementById('drawer-theme-gallery');
    if (!container) return;

    let html = '';
    window.THEMES.forEach(t => {
      const isActive = t.id === this.state.themeId;
      html += `
        <div 
          class="theme-card-drawer p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
            isActive ? 'bg-blue-950/40 border-blue-500 shadow-sm ring-1 ring-blue-500/40' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }"
          data-theme-id="${t.id}"
        >
          <div class="flex items-center gap-2">
            <div class="flex gap-0.5">
              ${t.preview.map(c => `<span class="w-3 h-3 rounded-full border border-black/20" style="background: ${c};"></span>`).join('')}
            </div>
            <div class="text-[11px] font-bold text-white">${t.name}</div>
          </div>
          ${isActive ? '<span class="text-[10px] text-blue-400 font-bold">Active ✓</span>' : ''}
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.theme-card-drawer').forEach(card => {
      card.addEventListener('click', () => {
        this.applyTheme(card.dataset.themeId);
        this.renderTimetable();
        this.renderThemeGallery();
        this.showToast(`Theme: ${card.dataset.themeId}`);
      });
    });
  }

  /**
   * Apply Theme
   */
  applyTheme(themeId) {
    this.state.themeId = themeId;
    localStorage.setItem('ttstudio_mobile_theme', themeId);
  }

  // =========================================================================
  // ATTENDANCE MODAL
  // =========================================================================

  loadAttendanceState() {
    try {
      const saved = localStorage.getItem('ttstudio_attendance');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  saveAttendanceState() {
    localStorage.setItem('ttstudio_attendance', JSON.stringify(this.state.attendance));
  }

  markAttendance(subject, isAttended) {
    if (!this.state.attendance[subject]) {
      this.state.attendance[subject] = { attended: 0, total: 0 };
    }

    this.state.attendance[subject].total += 1;
    if (isAttended) {
      this.state.attendance[subject].attended += 1;
    }

    this.saveAttendanceState();
    this.showToast(`Attendance recorded for ${subject}!`, 'success');
  }

  renderAttendanceModal() {
    const list = document.getElementById('attendance-modal-list');
    if (!list || !this.state.parsedData) return;

    const subjects = Object.keys(this.calculateInsights().subjectHours);
    let html = '';

    subjects.forEach(subj => {
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
              <h4 class="font-black text-white text-sm">${subj}</h4>
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
