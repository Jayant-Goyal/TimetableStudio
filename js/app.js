/**
 * Timetable Studio Application Controller
 */

class TimetableApp {
  constructor() {
    this.state = {
      rawJson: JSON.stringify(window.SAMPLE_JECRC, null, 2),
      parsedData: null,
      grid: null,
      options: {
        orientation: 'periods-in-rows', // 'periods-in-rows' | 'periods-in-columns'
        themeId: 'modern-slate',
        fontFamily: 'jakarta',
        showHeader: true,
        showLegend: true,
        showTimeLabels: true,
        highlightLabs: true,
        showWatermark: true,
        cellPadding: 'normal',
        borderRadius: 'rounded',
        scale: 2,
        jpegQuality: 0.95,
        canvasMargin: 'poster',
        filename: ''
      },
      zoom: 1.0,
      isExporting: false
    };

    this.debounceTimer = null;
  }

  /**
   * Initialize the application
   */
  init() {
    this.renderThemeGallery();
    this.bindEvents();
    this.loadJsonData(this.state.rawJson);
    this.refreshIcons();
  }

  /**
   * Refresh Lucide Icons in DOM
   */
  refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Render theme cards into sidebar
   */
  renderThemeGallery() {
    const galleryEl = document.getElementById('theme-gallery-grid');
    if (!galleryEl || !window.THEMES) return;

    galleryEl.innerHTML = window.THEMES.map(theme => {
      const isActive = theme.id === this.state.options.themeId;
      const isDark = theme.category === 'dark';

      return `
        <div 
          class="theme-card p-3 rounded-xl border ${isActive ? 'active bg-slate-900 border-blue-500 shadow-md' : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80'} flex items-center justify-between gap-3 transition-all"
          data-theme-id="${theme.id}"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <!-- Palette Color Chips -->
            <div class="flex -space-x-1.5 shrink-0">
              ${theme.preview.map(color => `
                <span class="w-4 h-4 rounded-full border border-slate-950 shadow-xs" style="background-color: ${color};"></span>
              `).join('')}
            </div>
            <div class="truncate">
              <div class="text-xs font-bold text-slate-200 truncate flex items-center gap-1.5">
                <span>${theme.name}</span>
                ${isDark ? '<span class="text-[9px] font-bold px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded">Dark</span>' : ''}
              </div>
              <div class="text-[10px] text-slate-400 truncate">${theme.description}</div>
            </div>
          </div>
          <div class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isActive ? 'border-blue-500 bg-blue-500' : 'border-slate-700'}">
            ${isActive ? '<i data-lucide="check" class="w-2.5 h-2.5 text-white"></i>' : ''}
          </div>
        </div>
      `;
    }).join('');

    // Attach click handlers to theme cards
    galleryEl.querySelectorAll('.theme-card').forEach(card => {
      card.addEventListener('click', () => {
        const themeId = card.getAttribute('data-theme-id');
        this.setTheme(themeId);
      });
    });

    this.refreshIcons();
  }

  /**
   * Set theme
   */
  setTheme(themeId) {
    this.state.options.themeId = themeId;
    const theme = window.getTheme(themeId);
    
    // Update theme title display
    const activeThemeNameEl = document.getElementById('active-theme-name');
    if (activeThemeNameEl) {
      activeThemeNameEl.textContent = theme.name;
    }

    this.renderThemeGallery();
    this.renderTimetable();
  }

  /**
   * Load JSON data or .ttstudio bundle into state and editor
   */
  loadJsonData(jsonString) {
    let rawTimetableStr = jsonString;
    let loadedSettings = null;

    // Check if input is a .ttstudio bundle
    try {
      const parsedObj = JSON.parse(jsonString);
      if (parsedObj && parsedObj.format === 'TTStudioBundle' && parsedObj.timetable) {
        rawTimetableStr = JSON.stringify(parsedObj.timetable, null, 2);
        loadedSettings = parsedObj.displaySettings || null;
      }
    } catch (e) {
      // not a json string, will fail in parser below
    }

    this.state.rawJson = rawTimetableStr;
    const editorEl = document.getElementById('json-editor-textarea');
    if (editorEl && editorEl.value !== rawTimetableStr) {
      editorEl.value = rawTimetableStr;
    }

    const parseResult = window.TimetableParser.parse(rawTimetableStr);
    const errorBox = document.getElementById('json-error-box');
    const errorMsg = document.getElementById('json-error-msg');
    const statusIndicator = document.getElementById('json-status-indicator');

    if (!parseResult.valid) {
      if (errorBox && errorMsg) {
        errorBox.classList.remove('hidden');
        errorMsg.textContent = parseResult.error;
      }
      if (statusIndicator) {
        statusIndicator.className = 'text-red-400 flex items-center gap-1 text-[11px]';
        statusIndicator.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-red-400"></span> Error';
      }
      return;
    }

    // Success
    if (errorBox) errorBox.classList.add('hidden');
    if (statusIndicator) {
      statusIndicator.className = 'text-emerald-400 flex items-center gap-1 text-[11px]';
      statusIndicator.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Valid';
    }

    this.state.parsedData = parseResult.data;
    this.state.grid = window.TimetableParser.buildGridMatrix(parseResult.data);

    // Apply bundle display settings if available
    if (loadedSettings) {
      if (loadedSettings.themeId) this.setTheme(loadedSettings.themeId);
      if (loadedSettings.orientation) this.setOrientation(loadedSettings.orientation);
      if (loadedSettings.fontFamily) {
        this.state.options.fontFamily = loadedSettings.fontFamily;
        const fontSelect = document.getElementById('font-family-select');
        if (fontSelect) fontSelect.value = loadedSettings.fontFamily;
      }
      if (loadedSettings.cellPadding) {
        this.state.options.cellPadding = loadedSettings.cellPadding;
        const padSelect = document.getElementById('cell-padding-select');
        if (padSelect) padSelect.value = loadedSettings.cellPadding;
      }
      this.showToast('Loaded complete .ttstudio bundle settings!', 'success');
    }

    // Update filename placeholder if empty
    this.updateDefaultFilename();
    this.updateStats();
    this.updateMobileLaunchUrl();
    this.renderTimetable();
  }

  /**
   * Update mobile companion launch URLs
   */
  updateMobileLaunchUrl() {
    if (!this.state.parsedData) return;
    const launchUrl = window.TimetableExporter.generateMobileLaunchUrl(this.state.parsedData, this.state.options);
    const topBtn = document.getElementById('open-mobile-app-btn');
    const tabBtn = document.getElementById('export-tab-mobile-btn');
    if (topBtn) topBtn.href = launchUrl;
    if (tabBtn) tabBtn.href = launchUrl;
  }

  /**
   * Update suggested default filename
   */
  updateDefaultFilename() {
    const filenameInput = document.getElementById('export-filename-input');
    if (!filenameInput || filenameInput.value.trim().length > 0) return;

    if (this.state.parsedData) {
      const p = this.state.parsedData;
      const parts = [
        p.university || 'Timetable',
        p.timetableInfo?.section,
        p.timetableInfo?.semester,
        'Schedule'
      ].filter(Boolean);
      
      filenameInput.placeholder = parts.join('_').replace(/[^a-z0-9_-]/gi, '_');
    }
  }

  /**
   * Update stats in sidebar footer
   */
  updateStats() {
    const statsEl = document.getElementById('stats-summary-text');
    const stageBadge = document.getElementById('stage-layout-badge');
    if (!this.state.parsedData || !this.state.grid) return;

    const stats = window.TimetableParser.getStats(this.state.parsedData, this.state.grid);
    if (statsEl) {
      statsEl.textContent = `${stats.totalDays} Days • ${stats.totalSlots} Slots • ${stats.totalClasses} Classes (${stats.totalLabs} Labs)`;
    }

    if (stageBadge) {
      const orientText = this.state.options.orientation === 'periods-in-rows' 
        ? 'Periods in Rows' 
        : 'Periods in Columns';
      stageBadge.textContent = `${orientText} (${stats.totalDays}x${stats.totalSlots})`;
    }
  }

  /**
   * Render Timetable to canvas target
   */
  renderTimetable() {
    const targetEl = document.getElementById('timetable-render-target');
    if (!targetEl || !this.state.parsedData || !this.state.grid) return;

    const theme = window.getTheme(this.state.options.themeId);

    window.TimetableRenderer.render(targetEl, this.state.parsedData, this.state.grid, {
      ...this.state.options,
      theme
    });

    this.applyZoom();
    this.refreshIcons();
  }

  /**
   * Apply zoom scale to preview target
   */
  applyZoom() {
    const targetEl = document.getElementById('timetable-render-target');
    const zoomDisplay = document.getElementById('zoom-display');
    if (!targetEl) return;

    targetEl.style.transform = `scale(${this.state.zoom})`;
    if (zoomDisplay) {
      zoomDisplay.textContent = `${Math.round(this.state.zoom * 100)}%`;
    }
  }

  /**
   * Bind DOM event handlers
   */
  bindEvents() {
    // 1. Sidebar Tab Switching
    const tabs = [
      { btn: 'tab-btn-themes', pane: 'tab-content-themes' },
      { btn: 'tab-btn-json', pane: 'tab-content-json' },
      { btn: 'tab-btn-export', pane: 'tab-content-export' }
    ];

    tabs.forEach(t => {
      const btnEl = document.getElementById(t.btn);
      if (!btnEl) return;

      btnEl.addEventListener('click', () => {
        tabs.forEach(other => {
          const b = document.getElementById(other.btn);
          const p = document.getElementById(other.pane);
          if (b && p) {
            b.className = 'sidebar-tab flex-1 py-2 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all text-slate-400 hover:text-slate-200';
            p.classList.add('hidden');
          }
        });

        btnEl.className = 'sidebar-tab active flex-1 py-2 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all bg-blue-600/10 text-blue-400 border border-blue-500/20';
        document.getElementById(t.pane)?.classList.remove('hidden');
      });
    });

    // 2. Layout Orientation Switches
    const setOrientation = (orient) => {
      this.state.options.orientation = orient;

      // Update sidebar buttons
      const rowsBtn = document.getElementById('orient-rows-btn');
      const colsBtn = document.getElementById('orient-cols-btn');
      if (rowsBtn && colsBtn) {
        if (orient === 'periods-in-rows') {
          rowsBtn.className = 'orient-btn active p-3 rounded-xl border text-left flex flex-col gap-1 transition-all bg-blue-600/10 border-blue-500 text-slate-100';
          rowsBtn.querySelector('span.rounded-full').className = 'w-2 h-2 rounded-full bg-blue-500';
          colsBtn.className = 'orient-btn p-3 rounded-xl border border-slate-800 text-left flex flex-col gap-1 transition-all hover:border-slate-700 text-slate-300';
          colsBtn.querySelector('span.rounded-full').className = 'w-2 h-2 rounded-full bg-transparent';
        } else {
          colsBtn.className = 'orient-btn active p-3 rounded-xl border text-left flex flex-col gap-1 transition-all bg-blue-600/10 border-blue-500 text-slate-100';
          colsBtn.querySelector('span.rounded-full').className = 'w-2 h-2 rounded-full bg-blue-500';
          rowsBtn.className = 'orient-btn p-3 rounded-xl border border-slate-800 text-left flex flex-col gap-1 transition-all hover:border-slate-700 text-slate-300';
          rowsBtn.querySelector('span.rounded-full').className = 'w-2 h-2 rounded-full bg-transparent';
        }
      }

      // Update navbar quick buttons
      const qRowsBtn = document.getElementById('quick-orient-rows-btn');
      const qColsBtn = document.getElementById('quick-orient-cols-btn');
      if (qRowsBtn && qColsBtn) {
        if (orient === 'periods-in-rows') {
          qRowsBtn.className = 'px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 bg-blue-600 text-white shadow-sm';
          qColsBtn.className = 'px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 text-slate-400 hover:text-slate-200';
        } else {
          qColsBtn.className = 'px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 bg-blue-600 text-white shadow-sm';
          qRowsBtn.className = 'px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 text-slate-400 hover:text-slate-200';
        }
      }

      this.updateStats();
      this.renderTimetable();
      this.showToast(`Layout changed: ${orient === 'periods-in-rows' ? 'Periods in Rows' : 'Periods in Columns'}`);
    };

    document.getElementById('orient-rows-btn')?.addEventListener('click', () => setOrientation('periods-in-rows'));
    document.getElementById('orient-cols-btn')?.addEventListener('click', () => setOrientation('periods-in-columns'));
    document.getElementById('quick-orient-rows-btn')?.addEventListener('click', () => setOrientation('periods-in-rows'));
    document.getElementById('quick-orient-cols-btn')?.addEventListener('click', () => setOrientation('periods-in-columns'));

    // 3. Font Family Selector
    document.getElementById('font-family-select')?.addEventListener('change', (e) => {
      this.state.options.fontFamily = e.target.value;
      this.renderTimetable();
    });

    // 4. Appearance Toggles
    const bindToggle = (id, optKey) => {
      document.getElementById(id)?.addEventListener('change', (e) => {
        this.state.options[optKey] = e.target.checked;
        this.renderTimetable();
      });
    };

    bindToggle('toggle-show-header', 'showHeader');
    bindToggle('toggle-show-legend', 'showLegend');
    bindToggle('toggle-show-time', 'showTimeLabels');
    bindToggle('toggle-highlight-labs', 'highlightLabs');
    bindToggle('toggle-show-watermark', 'showWatermark');

    // 5. Padding & Border Radius
    document.getElementById('cell-padding-select')?.addEventListener('change', (e) => {
      this.state.options.cellPadding = e.target.value;
      this.renderTimetable();
    });

    document.getElementById('border-radius-select')?.addEventListener('change', (e) => {
      this.state.options.borderRadius = e.target.value;
      this.renderTimetable();
    });

    // 6. JSON Editor Realtime Typing (Debounced)
    const jsonEditor = document.getElementById('json-editor-textarea');
    if (jsonEditor) {
      jsonEditor.addEventListener('input', (e) => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.loadJsonData(e.target.value);
        }, 300);
      });
    }

    // 7. Sample Buttons
    document.getElementById('load-sample-jecrc-btn')?.addEventListener('click', () => {
      this.loadJsonData(JSON.stringify(window.SAMPLE_JECRC, null, 2));
      this.showToast('Reset to JECRC University timetable dataset', 'info');
    });

    document.getElementById('load-sample-tech-btn')?.addEventListener('click', () => {
      this.loadJsonData(JSON.stringify(window.SAMPLE_TECH_INSTITUTE, null, 2));
      this.showToast('Loaded AI & Data Science Institute dataset', 'info');
    });

    // 8. File Upload
    document.getElementById('json-file-input')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result;
        this.loadJsonData(text);
        this.showToast(`Uploaded ${file.name} successfully!`, 'success');
      };
      reader.onerror = () => {
        this.showToast('Failed to read file', 'error');
      };
      reader.readAsText(file);
    });

    // 9. Format / Prettify JSON
    document.getElementById('format-json-btn')?.addEventListener('click', () => {
      try {
        const parsed = JSON.parse(this.state.rawJson);
        const formatted = JSON.stringify(parsed, null, 2);
        this.loadJsonData(formatted);
        this.showToast('JSON formatted cleanly', 'success');
      } catch (err) {
        this.showToast('Cannot format: JSON is invalid', 'error');
      }
    });

    // 10. Export Settings
    const scaleSelectTop = document.getElementById('export-scale-select');
    const scaleSelectTab = document.getElementById('export-tab-scale-select');

    const updateScale = (val) => {
      const scaleInt = parseInt(val, 10) || 2;
      this.state.options.scale = scaleInt;
      if (scaleSelectTop && scaleSelectTop.value !== String(scaleInt)) scaleSelectTop.value = String(scaleInt);
      if (scaleSelectTab && scaleSelectTab.value !== String(scaleInt)) scaleSelectTab.value = String(scaleInt);
    };

    scaleSelectTop?.addEventListener('change', (e) => updateScale(e.target.value));
    scaleSelectTab?.addEventListener('change', (e) => updateScale(e.target.value));

    const qualitySlider = document.getElementById('jpeg-quality-slider');
    const qualityDisplay = document.getElementById('quality-val-display');
    if (qualitySlider && qualityDisplay) {
      qualitySlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.state.options.jpegQuality = val;
        qualityDisplay.textContent = `${Math.round(val * 100)}%`;
      });
    }

    document.getElementById('canvas-margin-select')?.addEventListener('change', (e) => {
      this.state.options.canvasMargin = e.target.value;
      this.renderTimetable();
    });

    document.getElementById('export-filename-input')?.addEventListener('input', (e) => {
      this.state.options.filename = e.target.value.trim();
    });

    // 11. Export Trigger Buttons
    const handleExport = async (format) => {
      await this.exportImage(format);
    };

    const handleCopy = async () => {
      await this.copyImage();
    };

    document.getElementById('download-jpeg-btn')?.addEventListener('click', () => handleExport('jpeg'));
    document.getElementById('download-png-btn')?.addEventListener('click', () => handleExport('png'));
    document.getElementById('copy-image-btn')?.addEventListener('click', handleCopy);

    document.getElementById('export-tab-jpeg-btn')?.addEventListener('click', () => handleExport('jpeg'));
    document.getElementById('export-tab-png-btn')?.addEventListener('click', () => handleExport('png'));
    document.getElementById('export-tab-copy-btn')?.addEventListener('click', handleCopy);

    document.getElementById('export-bundle-btn')?.addEventListener('click', () => {
      try {
        const name = this.getFilename();
        const filename = window.TimetableExporter.exportBundle(this.state.parsedData, this.state.options, name);
        this.showToast(`Exported ${filename} successfully!`, 'success');
      } catch (err) {
        this.showToast(`Failed to export bundle: ${err.message}`, 'error');
      }
    });

    // 12. Zoom Controls
    document.getElementById('zoom-in-btn')?.addEventListener('click', () => {
      this.state.zoom = Math.min(2.0, this.state.zoom + 0.1);
      this.applyZoom();
    });

    document.getElementById('zoom-out-btn')?.addEventListener('click', () => {
      this.state.zoom = Math.max(0.4, this.state.zoom - 0.1);
      this.applyZoom();
    });

    document.getElementById('zoom-reset-btn')?.addEventListener('click', () => {
      this.state.zoom = 1.0;
      this.applyZoom();
    });
  }

  /**
   * Execute Image Download (100% device & preview independent)
   */
  async exportImage(format = 'jpeg') {
    if (this.state.isExporting) return;
    this.state.isExporting = true;
    this.setLoading(true, `Exporting ${format.toUpperCase()}...`);

    try {
      const filename = this.getFilename();
      const theme = window.getTheme(this.state.options.themeId);

      const downloadedName = await window.TimetableExporter.downloadImage(
        this.state.parsedData, 
        this.state.grid, 
        filename, 
        {
          ...this.state.options,
          format,
          theme,
          scale: this.state.options.scale,
          quality: this.state.options.jpegQuality
        }
      );

      this.showToast(`Saved as ${downloadedName}!`, 'success');
    } catch (err) {
      console.error('Export Error:', err);
      this.showToast(`Export failed: ${err.message}`, 'error');
    } finally {
      this.setLoading(false);
      this.state.isExporting = false;
    }
  }

  /**
   * Execute Image Copy to Clipboard (100% device & preview independent)
   */
  async copyImage() {
    if (this.state.isExporting) return;
    this.state.isExporting = true;
    this.setLoading(true, 'Copying image to clipboard...');

    try {
      const theme = window.getTheme(this.state.options.themeId);

      await window.TimetableExporter.copyToClipboard(
        this.state.parsedData, 
        this.state.grid, 
        {
          ...this.state.options,
          theme,
          scale: Math.min(2, this.state.options.scale)
        }
      );

      this.showToast('Copied high-res image to clipboard! Ready to paste.', 'success');
    } catch (err) {
      console.error('Copy to Clipboard Error:', err);
      this.showToast(`Copy failed: ${err.message}`, 'error');
    } finally {
      this.setLoading(false);
      this.state.isExporting = false;
    }
  }

  /**
   * Determine filename based on user inputs or metadata
   */
  getFilename() {
    if (this.state.options.filename && this.state.options.filename.trim()) {
      return this.state.options.filename.trim();
    }

    if (this.state.parsedData) {
      const p = this.state.parsedData;
      const parts = [
        p.university || 'Timetable',
        p.timetableInfo?.section,
        p.timetableInfo?.semester,
        this.state.options.orientation === 'periods-in-rows' ? 'Vertical' : 'Horizontal'
      ].filter(Boolean);
      return parts.join('_');
    }

    return 'Timetable_Schedule';
  }

  /**
   * Toggle loading state in top navbar
   */
  setLoading(isLoading, text = 'Exporting...') {
    const btnText = document.getElementById('download-btn-text');
    const icon = document.getElementById('download-icon');

    if (isLoading) {
      if (btnText) btnText.textContent = text;
      if (icon) {
        icon.setAttribute('data-lucide', 'loader-2');
        icon.classList.add('spinner-spin');
      }
    } else {
      if (btnText) btnText.textContent = 'Export JPEG';
      if (icon) {
        icon.setAttribute('data-lucide', 'download');
        icon.classList.remove('spinner-spin');
      }
    }
    this.refreshIcons();
  }

  /**
   * Show animated Toast notification
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    
    const typeStyles = {
      success: 'bg-emerald-950/90 border-emerald-700 text-emerald-200',
      error: 'bg-red-950/90 border-red-700 text-red-200',
      info: 'bg-slate-900/90 border-slate-700 text-slate-200'
    };

    const icons = {
      success: 'check-circle-2',
      error: 'alert-circle',
      info: 'info'
    };

    toast.className = `toast px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-bold backdrop-blur-md ${typeStyles[type] || typeStyles.info}`;
    toast.innerHTML = `
      <i data-lucide="${icons[type] || 'info'}" class="w-4 h-4 shrink-0"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    this.refreshIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.9)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Global browser export and bootstrap
window.TimetableApp = TimetableApp;

document.addEventListener('DOMContentLoaded', () => {
  const app = new TimetableApp();
  app.init();
  window.timetableApp = app;
});
