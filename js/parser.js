/**
 * Timetable Data Parser & Grid Matrix Builder
 */

class TimetableParser {
  /**
   * Parse and validate raw JSON string or object
   * @param {string|object} rawInput 
   * @returns {{ valid: boolean, data: object|null, error: string|null, warnings: string[] }}
   */
  static parse(rawInput) {
    const warnings = [];
    let data;

    if (typeof rawInput === 'string') {
      try {
        data = JSON.parse(rawInput);
      } catch (err) {
        return {
          valid: false,
          data: null,
          error: `JSON Syntax Error: ${err.message}`,
          warnings: []
        };
      }
    } else if (typeof rawInput === 'object' && rawInput !== null) {
      data = rawInput;
    } else {
      return {
        valid: false,
        data: null,
        error: "Invalid input: Timetable data must be a JSON object.",
        warnings: []
      };
    }

    // Basic structure validation
    if (!data.timeSlots || !Array.isArray(data.timeSlots) || data.timeSlots.length === 0) {
      return {
        valid: false,
        data: null,
        error: "Validation Error: 'timeSlots' array is missing or empty.",
        warnings: []
      };
    }

    if (!data.schedule || !Array.isArray(data.schedule) || data.schedule.length === 0) {
      return {
        valid: false,
        data: null,
        error: "Validation Error: 'schedule' array is missing or empty.",
        warnings: []
      };
    }

    // Sort timeSlots by lecture number if needed
    const sortedTimeSlots = [...data.timeSlots].sort((a, b) => {
      const numA = parseInt(a.lecture, 10) || 0;
      const numB = parseInt(b.lecture, 10) || 0;
      return numA - numB;
    });

    const parsedData = {
      university: data.university || "ACADEMIC INSTITUTION",
      department: data.department || "",
      timetableInfo: {
        title: data.timetableInfo?.title || "CLASS TIME TABLE",
        section: data.timetableInfo?.section || "",
        year: data.timetableInfo?.year || "",
        semester: data.timetableInfo?.semester || "",
        type: data.timetableInfo?.type || ""
      },
      timeSlots: sortedTimeSlots,
      schedule: data.schedule,
      faculty: Array.isArray(data.faculty) ? data.faculty : []
    };

    return {
      valid: true,
      data: parsedData,
      error: null,
      warnings
    };
  }

  /**
   * Build 2D Matrix of Schedule Grid
   * Days x Lectures matrix with span resolution
   * @param {object} parsedData 
   * @returns {{ days: string[], timeSlots: object[], matrix: object[][] }}
   */
  static buildGridMatrix(parsedData) {
    const { timeSlots, schedule } = parsedData;
    const days = schedule.map(d => d.day);
    const lectureMap = new Map();
    timeSlots.forEach((slot, index) => {
      lectureMap.set(slot.lecture, index);
    });

    // matrix[dayIndex][lectureIndex]
    const matrix = [];

    schedule.forEach((daySchedule, dayIdx) => {
      const row = new Array(timeSlots.length);
      for (let i = 0; i < timeSlots.length; i++) {
        row[i] = {
          type: 'empty',
          lecture: timeSlots[i].lecture,
          time: timeSlots[i].time,
          span: 1,
          subject: '',
          venue: '',
          faculty: '',
          isLab: false,
          day: daySchedule.day
        };
      }

      if (Array.isArray(daySchedule.classes)) {
        daySchedule.classes.forEach(cls => {
          const lecNum = cls.lecture;
          const lecIdx = lectureMap.has(lecNum) ? lectureMap.get(lecNum) : -1;

          if (lecIdx !== -1 && lecIdx < timeSlots.length) {
            // Determine if slot has details
            const isNullDetails = cls.details === null || cls.details === undefined;
            const subject = cls.subject || (typeof cls.details === 'object' && cls.details?.subject) || '';
            const venue = cls.venue || (typeof cls.details === 'object' && cls.details?.venue) || '';
            const faculty = cls.faculty || (typeof cls.details === 'object' && cls.details?.faculty) || '';
            const span = Math.max(1, parseInt(cls.span, 10) || 1);
            
            const isLab = (subject && subject.toLowerCase().includes('lab')) ||
                          (venue && venue.toLowerCase().includes('lab'));

            const hasClass = Boolean(subject && subject.trim().length > 0);

            row[lecIdx] = {
              type: hasClass ? 'class' : 'empty',
              lecture: timeSlots[lecIdx].lecture,
              time: timeSlots[lecIdx].time,
              subject: subject.trim(),
              venue: venue.trim(),
              faculty: faculty.trim(),
              span: span,
              isLab: isLab,
              day: daySchedule.day,
              raw: cls
            };

            // Mark subsequent spanned slots as 'spanned_over'
            for (let s = 1; s < span; s++) {
              if (lecIdx + s < timeSlots.length) {
                row[lecIdx + s] = {
                  type: 'spanned_over',
                  parentLecIdx: lecIdx,
                  day: daySchedule.day,
                  lecture: timeSlots[lecIdx + s].lecture
                };
              }
            }
          }
        });
      }

      matrix.push(row);
    });

    return {
      days,
      timeSlots,
      matrix
    };
  }

  /**
   * Extract statistics
   */
  static getStats(parsedData, grid) {
    let totalClasses = 0;
    let totalLabs = 0;
    let totalEmptySlots = 0;

    grid.matrix.forEach(row => {
      row.forEach(cell => {
        if (cell.type === 'class') {
          totalClasses++;
          if (cell.isLab) totalLabs++;
        } else if (cell.type === 'empty') {
          totalEmptySlots++;
        }
      });
    });

    return {
      totalDays: grid.days.length,
      totalSlots: grid.timeSlots.length,
      totalClasses,
      totalLabs,
      totalEmptySlots,
      facultyCount: parsedData.faculty.length
    };
  }
}

// Global browser export
window.TimetableParser = TimetableParser;
