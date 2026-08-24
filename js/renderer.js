/**
 * Timetable HTML/DOM Renderer
 * Supports Periods in Columns and Periods in Rows layout modes
 * Accurately spans multi-period labs across 2 (or more) periods in both orientations
 */

// Crisp Inline SVG Helpers
const SVG_ICONS = {
  clock: `<svg class="icon-svg" viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  pin: `<svg class="icon-svg" viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  user: `<svg class="icon-svg" viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  lab: `<svg class="icon-svg" viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31L4.66 18.23A2 2 0 0 0 6.38 21h11.24a2 2 0 0 0 1.72-2.77L14 9.31V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/><line x1="6.5" y1="15" x2="17.5" y2="15"/></svg>`
};

class TimetableRenderer {
  /**
   * Render complete timetable into target element
   * @param {HTMLElement} targetElement 
   * @param {object} parsedData 
   * @param {object} grid 
   * @param {object} options 
   * @param {boolean} isExportMode When true, applies fixed 1560px deterministic dimensions
   */
  static render(targetElement, parsedData, grid, options, isExportMode = false) {
    if (!targetElement || !parsedData || !grid) return;

    const {
      orientation = 'periods-in-rows', // 'periods-in-rows' | 'periods-in-columns'
      theme,
      showHeader = true,
      showLegend = true,
      showTimeLabels = true,
      highlightLabs = true,
      cellPadding = 'normal', // 'compact', 'normal', 'roomy'
      borderRadius = 'rounded', // 'square', 'slight', 'rounded', 'smooth'
      fontFamily = 'jakarta',
      showWatermark = true,
      canvasMargin = 'poster'
    } = options;

    const subjectColorMap = window.getSubjectColorMap(parsedData.schedule, parsedData.faculty, theme);
    const styles = theme.styles;

    // Font class
    const fontClassMap = {
      inter: 'font-inter',
      jakarta: 'font-jakarta',
      outfit: 'font-outfit',
      space: 'font-space',
      playfair: 'font-playfair',
      mono: 'font-mono'
    };
    const fontClass = fontClassMap[fontFamily] || 'font-jakarta';

    // Width definition
    const exportBaseWidth = 1560;
    const containerStyle = isExportMode 
      ? `width: ${exportBaseWidth}px; max-width: ${exportBaseWidth}px; min-width: ${exportBaseWidth}px;`
      : `width: 100%;`;

    // Cell padding & height configuration
    const padConfig = {
      compact: { pad: '6px 8px', minH: 70 },
      normal: { pad: '8px 10px', minH: 94 },
      roomy: { pad: '12px 14px', minH: 114 }
    };
    const currentPad = padConfig[cellPadding] || padConfig.normal;
    const baseMinH = currentPad.minH;

    // Radius mapping
    const radiusMap = {
      square: '0px',
      slight: '6px',
      rounded: '12px',
      smooth: '18px'
    };
    const cardRadius = radiusMap[borderRadius] || '12px';

    // Outer frame padding & background
    let framePadding = '0px';
    let frameBackground = 'transparent';
    let frameShadow = 'none';

    if (canvasMargin === 'compact') {
      framePadding = isExportMode ? '18px' : '14px';
      frameBackground = styles.bg;
      frameShadow = '0 10px 25px -5px rgba(0,0,0,0.3)';
    } else if (canvasMargin === 'poster') {
      framePadding = isExportMode ? '32px' : '26px';
      frameBackground = styles.bg;
      frameShadow = '0 20px 40px -10px rgba(0,0,0,0.5)';
    }

    // Build Poster HTML
    let html = `
      <div 
        id="${isExportMode ? 'offscreen-export-wrapper' : 'live-export-wrapper'}"
        class="timetable-export-wrapper ${fontClass}"
        style="
          ${containerStyle}
          padding: ${framePadding}; 
          background: ${frameBackground}; 
          box-shadow: ${frameShadow};
          border-radius: ${canvasMargin === 'none' ? '0px' : '20px'};
        "
      >
        <div 
          id="${isExportMode ? 'timetable-capture-node-export' : 'timetable-capture-node'}" 
          class="timetable-poster ${fontClass}"
          style="
            background: ${styles.cardBg}; 
            border: 1px solid ${styles.cardBorder}; 
            box-shadow: ${styles.cardShadow};
            color: ${styles.cellText};
            border-radius: ${cardRadius};
            overflow: hidden;
            width: 100%;
          "
        >
    `;

    // 1. Header Banner
    if (showHeader) {
      html += `
        <header 
          class="poster-header"
          style="background: ${styles.headerBg}; color: ${styles.headerText};"
        >
          <!-- Subtle Accent Glow -->
          <div style="position: absolute; right: -40px; top: -40px; width: 200px; height: 200px; border-radius: 9999px; background: ${styles.accent}; opacity: 0.15; filter: blur(35px); pointer-events: none;"></div>

          <div class="poster-header-content">
            <div style="min-width: 0; flex: 1;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span 
                  class="poster-title-badge" 
                  style="background: ${styles.accent}; color: ${styles.headerBg.includes('#0') || styles.headerBg.includes('#1') ? '#ffffff' : '#000000'};"
                >
                  ${parsedData.timetableInfo.title || 'TIME-TABLE'}
                </span>
                ${parsedData.timetableInfo.type ? `
                  <span 
                    class="poster-type-badge" 
                    style="background: ${styles.badgeBg}; color: ${styles.badgeText}; border: 1px solid ${styles.badgeBorder};"
                  >
                    ${SVG_ICONS.pin}
                    <span>${parsedData.timetableInfo.type}</span>
                  </span>
                ` : ''}
              </div>
              <h1 class="poster-univ-title" style="color: ${styles.headerText};">
                ${parsedData.university}
              </h1>
              ${parsedData.department ? `
                <p class="poster-dept-subtitle" style="color: ${styles.deptText};">
                  ${parsedData.department}
                </p>
              ` : ''}
            </div>

            <!-- Metadata Badges -->
            <div class="poster-meta-group">
              ${parsedData.timetableInfo.section ? `
                <div 
                  class="poster-meta-pill"
                  style="background: ${styles.badgeBg}; color: ${styles.badgeText}; border: 1px solid ${styles.badgeBorder};"
                >
                  <span style="opacity: 0.75; font-weight: 500;">Section:</span>
                  <span>${parsedData.timetableInfo.section}</span>
                </div>
              ` : ''}
              ${parsedData.timetableInfo.semester ? `
                <div 
                  class="poster-meta-pill"
                  style="background: ${styles.badgeBg}; color: ${styles.badgeText}; border: 1px solid ${styles.badgeBorder};"
                >
                  <span style="opacity: 0.75; font-weight: 500;">Sem:</span>
                  <span>${parsedData.timetableInfo.semester}</span>
                </div>
              ` : ''}
              ${parsedData.timetableInfo.year ? `
                <div 
                  class="poster-meta-pill"
                  style="background: ${styles.badgeBg}; color: ${styles.badgeText}; border: 1px solid ${styles.badgeBorder};"
                >
                  <span style="opacity: 0.75; font-weight: 500;">Year:</span>
                  <span>${parsedData.timetableInfo.year}</span>
                </div>
              ` : ''}
            </div>
          </div>
        </header>
      `;
    }

    // 2. Main Timetable Grid with Explicit Symmetrical Colgroups
    html += `
      <div class="timetable-table-container">
        <table 
          class="timetable-grid-table" 
          style="border: 1px solid ${styles.tableBorder}; width: 100%;"
        >
    `;

    if (orientation === 'periods-in-rows') {
      // ----------------------------------------------------
      // LAYOUT B: PERIODS IN ROWS (DAYS IN COLUMNS)
      // ----------------------------------------------------
      const firstColWidth = 160;
      const numDays = Math.max(1, grid.days.length);

      // Strict Column Group to guarantee 100% equal width across all day columns
      html += `
        <colgroup>
          <col style="width: ${firstColWidth}px;">
          ${grid.days.map(() => `<col style="width: calc((100% - ${firstColWidth}px) / ${numDays});">`).join('')}
        </colgroup>
        <thead>
          <tr style="border-bottom: 2px solid ${styles.tableBorder};">
            <th 
              class="th-corner-header"
              style="
                background: ${styles.headCellBg}; 
                color: ${styles.headCellText}; 
                border-right: 2px solid ${styles.tableBorder};
              "
            >
              Period / Day
            </th>
      `;

      grid.days.forEach(dayName => {
        html += `
          <th 
            class="th-day-col"
            style="
              background: ${styles.headCellBg}; 
              color: ${styles.headCellText}; 
              border-right: 1px solid ${styles.tableBorder};
            "
          >
            ${dayName}
          </th>
        `;
      });

      html += `
          </tr>
        </thead>
        <tbody>
      `;

      grid.timeSlots.forEach((slot, lecIdx) => {
        html += `
          <tr style="border-bottom: 1px solid ${styles.tableBorder};">
            <th 
              class="th-period-row"
              style="
                background: ${styles.headCellBg}; 
                color: ${styles.headCellText}; 
                border-right: 2px solid ${styles.tableBorder};
              "
            >
              <div class="period-title-row">
                <span style="width: 7px; height: 7px; border-radius: 9999px; background: ${styles.accent}; flex-shrink: 0;"></span>
                <span>Lecture ${slot.lecture}</span>
              </div>
              ${showTimeLabels && slot.time ? `
                <div class="period-time-sub" style="color: ${styles.timeText};">
                  ${SVG_ICONS.clock}
                  <span>${slot.time}</span>
                </div>
              ` : ''}
            </th>
        `;

        grid.days.forEach((dayName, dayIdx) => {
          const cell = grid.matrix[dayIdx][lecIdx];

          if (cell.type === 'spanned_over') {
            return;
          }

          const rowspanAttr = cell.span > 1 ? `rowspan="${cell.span}"` : '';

          html += `
            <td 
              ${rowspanAttr}
              style="
                padding: ${currentPad.pad};
                border-right: 1px solid ${styles.tableBorder};
                background: ${cell.type === 'empty' ? styles.emptyCellBg : styles.cellBg};
                vertical-align: top;
                height: 100%;
              "
            >
          `;

          if (cell.type === 'class') {
            html += TimetableRenderer.renderClassCard(cell, subjectColorMap, styles, highlightLabs, cardRadius, orientation, baseMinH);
          } else {
            html += TimetableRenderer.renderEmptyCell(styles);
          }

          html += `</td>`;
        });

        html += `</tr>`;
      });

      html += `</tbody>`;

    } else {
      // ----------------------------------------------------
      // LAYOUT A: PERIODS IN COLUMNS (DAYS IN ROWS)
      // ----------------------------------------------------
      const firstColWidth = 150;
      const numSlots = Math.max(1, grid.timeSlots.length);

      // Strict Column Group to guarantee 100% equal width across all slot columns
      html += `
        <colgroup>
          <col style="width: ${firstColWidth}px;">
          ${grid.timeSlots.map(() => `<col style="width: calc((100% - ${firstColWidth}px) / ${numSlots});">`).join('')}
        </colgroup>
        <thead>
          <tr style="border-bottom: 2px solid ${styles.tableBorder};">
            <th 
              class="th-corner-header"
              style="
                background: ${styles.headCellBg}; 
                color: ${styles.headCellText}; 
                border-right: 2px solid ${styles.tableBorder};
              "
            >
              Day / Period
            </th>
      `;

      grid.timeSlots.forEach(slot => {
        html += `
          <th 
            class="th-day-col"
            style="
              background: ${styles.headCellBg}; 
              color: ${styles.headCellText}; 
              border-right: 1px solid ${styles.tableBorder};
            "
          >
            <div>Lecture ${slot.lecture}</div>
            ${showTimeLabels && slot.time ? `
              <div style="font-size: 11px; font-weight: 600; margin-top: 3px; color: ${styles.timeText};">
                ${slot.time}
              </div>
            ` : ''}
          </th>
        `;
      });

      html += `
          </tr>
        </thead>
        <tbody>
      `;

      grid.days.forEach((dayName, dayIdx) => {
        html += `
          <tr style="border-bottom: 1px solid ${styles.tableBorder};">
            <th 
              class="th-period-row"
              style="
                background: ${styles.headCellBg}; 
                color: ${styles.headCellText}; 
                border-right: 2px solid ${styles.tableBorder};
              "
            >
              <div class="period-title-row">
                <span style="width: 7px; height: 7px; border-radius: 9999px; background: ${styles.accent}; flex-shrink: 0;"></span>
                <span>${dayName}</span>
              </div>
            </th>
        `;

        grid.timeSlots.forEach((slot, lecIdx) => {
          const cell = grid.matrix[dayIdx][lecIdx];

          if (cell.type === 'spanned_over') {
            return;
          }

          const colspanAttr = cell.span > 1 ? `colspan="${cell.span}"` : '';

          html += `
            <td 
              ${colspanAttr}
              style="
                padding: ${currentPad.pad};
                border-right: 1px solid ${styles.tableBorder};
                background: ${cell.type === 'empty' ? styles.emptyCellBg : styles.cellBg};
                vertical-align: top;
                height: 100%;
              "
            >
          `;

          if (cell.type === 'class') {
            html += TimetableRenderer.renderClassCard(cell, subjectColorMap, styles, highlightLabs, cardRadius, orientation, baseMinH);
          } else {
            html += TimetableRenderer.renderEmptyCell(styles);
          }

          html += `</td>`;
        });

        html += `</tr>`;
      });

      html += `</tbody>`;
    }

    html += `
        </table>
      </div>
    `;

    // 3. Faculty / Subject Legend Table
    if (showLegend && parsedData.faculty && parsedData.faculty.length > 0) {
      html += `
        <div class="poster-legend-section">
          <div 
            class="poster-legend-card"
            style="background: ${styles.legendBg}; border-color: ${styles.legendBorder};"
          >
            <div class="poster-legend-header" style="color: ${styles.cellText};">
              <span style="width: 7px; height: 7px; border-radius: 9999px; background: ${styles.accent}; flex-shrink: 0;"></span>
              <span>Faculty & Subject Directory (${parsedData.faculty.length} Courses)</span>
            </div>
            
            <div class="poster-legend-grid">
      `;

      parsedData.faculty.forEach(item => {
        const color = subjectColorMap[item.subject] || { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };
        html += `
          <div 
            class="legend-item-card"
            style="background: ${styles.cardBg}; border-color: ${styles.legendBorder};"
          >
            <span 
              class="legend-subject-badge"
              style="background: ${color.bg}; color: ${color.text}; border-color: ${color.border};"
            >
              ${item.subject}
            </span>
            <div class="legend-faculty-name" style="color: ${styles.subText};">
              ${SVG_ICONS.user}
              <span>${item.faculty}</span>
            </div>
          </div>
        `;
      });

      html += `
            </div>
          </div>
        </div>
      `;
    }

    // 4. Footer Bar
    if (showWatermark) {
      const now = new Date();
      const formattedDate = now.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });

      html += `
        <footer 
          class="poster-footer"
          style="border-color: ${styles.tableBorder}; color: ${styles.subText};"
        >
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 6px; height: 6px; border-radius: 9999px; background: ${styles.accent}; flex-shrink: 0;"></span>
            <span>Generated with <strong>Timetable Studio</strong></span>
          </div>
          <div>
            <span>Export Date: ${formattedDate}</span>
          </div>
        </footer>
      `;
    }

    html += `
        </div>
      </div>
    `;

    targetElement.innerHTML = html;
  }

  /**
   * Helper to render class cell card
   */
  static renderClassCard(cell, subjectColorMap, styles, highlightLabs, cardRadius, orientation = 'periods-in-rows', baseMinH = 94) {
    const color = subjectColorMap[cell.subject] || { bg: '#f1f5f9', text: '#0f172a', border: '#cbd5e1' };
    const isLab = cell.isLab;
    const span = cell.span || 1;

    // Calculate height for multi-period spanned cards
    let cardMinHeight = `${baseMinH}px`;
    if (orientation === 'periods-in-rows' && span > 1) {
      const computedSpanHeight = (baseMinH * span) + ((span - 1) * 16);
      cardMinHeight = `${computedSpanHeight}px`;
    }

    return `
      <div 
        class="class-card ${span > 1 ? 'class-card-spanned' : ''}"
        style="
          background: ${color.bg}; 
          border-color: ${color.border};
          color: ${color.text};
          border-radius: ${cardRadius};
          min-height: ${cardMinHeight};
          height: 100%;
        "
      >
        <!-- Top row: Subject name & Badges -->
        <div class="class-card-top">
          <div class="class-subject-text" title="${cell.subject}">
            ${cell.subject}
          </div>

          <div class="class-badges-group">
            ${(isLab && highlightLabs) ? `
              <span 
                class="class-lab-badge"
                style="background: ${styles.labTagBg}; color: ${styles.labTagText}; border-color: ${styles.labTagBorder};"
                title="Laboratory Session"
              >
                ${SVG_ICONS.lab}
                <span>LAB</span>
              </span>
            ` : ''}

            ${span > 1 ? `
              <span 
                class="class-span-badge"
                style="background: ${color.border}; color: ${color.text};"
                title="${span} Periods Continuous"
              >
                ${span}h
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Middle / Bottom details: Venue & Faculty -->
        <div class="class-card-bottom">
          ${cell.venue ? `
            <div class="class-venue-text" title="${cell.venue}">
              ${SVG_ICONS.pin}
              <span>${cell.venue}</span>
            </div>
          ` : ''}

          ${cell.faculty ? `
            <div class="class-faculty-text" title="${cell.faculty}">
              ${SVG_ICONS.user}
              <span>${cell.faculty}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Helper to render empty slot
   */
  static renderEmptyCell(styles) {
    return `
      <div class="empty-cell-wrap" style="color: ${styles.subText};">
        <span>—</span>
      </div>
    `;
  }
}

// Global browser export
window.TimetableRenderer = TimetableRenderer;
