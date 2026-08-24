/**
 * Timetable High-Resolution Image Exporter (JPEG / PNG / Clipboard)
 * Fully independent of screen size, device viewport, scrollbars, and zoom levels
 */

class TimetableExporter {
  /**
   * Create an in-document offscreen render sandbox with fixed deterministic dimensions
   */
  static createSandboxContainer() {
    const sandbox = document.createElement('div');
    sandbox.id = 'timetable-offscreen-sandbox';
    sandbox.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 1560px !important;
      min-width: 1560px !important;
      max-width: 1560px !important;
      z-index: -99999 !important;
      opacity: 1 !important;
      pointer-events: none !important;
      transform: none !important;
      overflow: visible !important;
    `;
    document.body.appendChild(sandbox);
    return sandbox;
  }

  /**
   * Capture timetable image completely independently of viewport or device
   * @param {object} parsedData 
   * @param {object} grid 
   * @param {object} options 
   * @returns {Promise<string>} Data URL
   */
  static async captureTimetable(parsedData, grid, options = {}) {
    const {
      format = 'jpeg', // 'jpeg' | 'png'
      scale = 2,       // 1, 2, 3
      quality = 0.95,  // 0.8 to 1.0
      theme
    } = options;

    if (!parsedData || !grid) {
      throw new Error('No timetable data provided for export.');
    }

    // 1. Create sandbox
    const sandbox = this.createSandboxContainer();

    try {
      // 2. Render timetable in deterministic export mode (fixed 1560px width)
      window.TimetableRenderer.render(sandbox, parsedData, grid, options, true);

      // Locate capture target inside sandbox
      const targetNode = sandbox.querySelector('#offscreen-export-wrapper') || sandbox.firstElementChild || sandbox;

      // 3. Ensure web fonts are loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Wait for layout and rasterizer to settle
      await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 150)));

      const activeTheme = theme || window.getTheme(options.themeId);
      const isMarginNone = options.canvasMargin === 'none';
      
      // Determine background color
      const bgColor = isMarginNone 
        ? (activeTheme?.styles?.cardBg || '#ffffff') 
        : (activeTheme?.styles?.bg?.includes('#') ? activeTheme.styles.bg.match(/#[a-fA-F0-9]{6}/)?.[0] || '#ffffff' : '#ffffff');

      // 4. Capture with html-to-image (now embedding properly linked Google fonts)
      if (window.htmlToImage) {
        try {
          const config = {
            pixelRatio: scale,
            quality: quality,
            backgroundColor: bgColor,
            cacheBust: true,
            style: {
              transform: 'none',
              margin: '0',
              maxWidth: 'none'
            }
          };

          if (format === 'jpeg' || format === 'jpg') {
            return await window.htmlToImage.toJpeg(targetNode, config);
          } else {
            return await window.htmlToImage.toPng(targetNode, config);
          }
        } catch (err) {
          console.warn('html-to-image error, attempting fallback:', err);
        }
      }

      // 5. Fallback capture using html2canvas
      if (window.html2canvas) {
        const canvas = await window.html2canvas(targetNode, {
          scale: scale,
          useCORS: true,
          allowTaint: true,
          backgroundColor: bgColor,
          logging: false,
          width: 1560,
          windowWidth: 1560,
          scrollX: 0,
          scrollY: 0
        });

        const mimeType = (format === 'jpeg' || format === 'jpg') ? 'image/jpeg' : 'image/png';
        return canvas.toDataURL(mimeType, quality);
      }

      throw new Error('Export libraries (html-to-image / html2canvas) are not available.');

    } finally {
      // 6. Clean up sandbox from DOM
      if (sandbox && sandbox.parentNode) {
        sandbox.parentNode.removeChild(sandbox);
      }
    }
  }

  /**
   * Download generated image file
   */
  static async downloadImage(parsedData, grid, filename, options = {}) {
    const format = options.format || 'jpeg';
    const ext = (format === 'jpeg' || format === 'jpg') ? 'jpg' : 'png';
    const cleanFilename = (filename || 'Timetable').replace(/[^a-z0-9_-]/gi, '_') + '.' + ext;

    const dataUrl = await this.captureTimetable(parsedData, grid, options);

    const link = document.createElement('a');
    link.download = cleanFilename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return cleanFilename;
  }

  /**
   * Copy generated image to Clipboard
   */
  static async copyToClipboard(parsedData, grid, options = {}) {
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error('Clipboard image writing is not supported by your browser.');
    }

    // PNG is standard for clipboard images
    const dataUrl = await this.captureTimetable(parsedData, grid, { ...options, format: 'png' });
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ]);

    return true;
  }

  /**
   * Export complete proprietary timetable bundle (.ttstudio)
   * Encapsulates raw schedule data, selected theme, orientation, and display options
   */
  static exportBundle(parsedData, options = {}, filename = 'Timetable') {
    if (!parsedData) {
      throw new Error('No timetable data provided to export bundle.');
    }

    const bundle = {
      $schema: 'https://ttstudio.app/schema/v1.json',
      format: 'TTStudioBundle',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      timetable: parsedData,
      displaySettings: {
        orientation: options.orientation || 'periods-in-rows',
        themeId: options.themeId || 'cyberpunk-neon',
        fontFamily: options.fontFamily || 'jakarta',
        cellPadding: options.cellPadding || 'normal',
        borderRadius: options.borderRadius || 'rounded',
        showHeader: options.showHeader !== false,
        showLegend: options.showLegend !== false,
        showTimeLabels: options.showTimeLabels !== false,
        highlightLabs: options.highlightLabs !== false,
        showWatermark: options.showWatermark !== false,
        canvasMargin: options.canvasMargin || 'poster',
        scale: options.scale || 2,
        jpegQuality: options.jpegQuality || 0.95
      },
      metadata: {
        appName: 'Timetable Studio',
        customTitle: filename || 'Timetable Bundle'
      }
    };

    const jsonStr = JSON.stringify(bundle, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const cleanFilename = (filename || 'Timetable').replace(/[^a-z0-9_-]/gi, '_') + '.ttstudio';

    const link = document.createElement('a');
    link.download = cleanFilename;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    return cleanFilename;
  }

  /**
   * Parse a .ttstudio bundle file string and extract timetable and display settings
   */
  static parseBundle(bundleStr) {
    try {
      const bundle = typeof bundleStr === 'string' ? JSON.parse(bundleStr) : bundleStr;
      
      // If it is a full TTStudio bundle
      if (bundle && bundle.format === 'TTStudioBundle' && bundle.timetable) {
        return {
          isBundle: true,
          timetable: bundle.timetable,
          displaySettings: bundle.displaySettings || {},
          metadata: bundle.metadata || {}
        };
      }

      // If standard raw JSON timetable
      if (bundle && (bundle.university || bundle.schedule)) {
        return {
          isBundle: false,
          timetable: bundle,
          displaySettings: {},
          metadata: {}
        };
      }

      throw new Error('Invalid timetable bundle or JSON file structure.');
    } catch (err) {
      throw new Error(`Failed to parse timetable file: ${err.message}`);
    }
  }

  /**
   * Generate mobile launch URL containing encoded timetable bundle
   */
  static generateMobileLaunchUrl(parsedData, options = {}) {
    const payload = {
      t: parsedData,
      d: {
        o: options.orientation || 'periods-in-rows',
        th: options.themeId || 'cyberpunk-neon',
        f: options.fontFamily || 'jakarta'
      }
    };
    const json = JSON.stringify(payload);
    const encoded = encodeURIComponent(json);
    return `mobile/index.html#data=${encoded}`;
  }
}

// Global browser export
window.TimetableExporter = TimetableExporter;
