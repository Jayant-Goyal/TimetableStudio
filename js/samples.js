/**
 * Sample Timetable Datasets
 */

const SAMPLE_JECRC = {
  "university": "JECRC UNIVERSITY",
  "department": "DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING",
  "timetableInfo": {
    "title": "TIME-TABLE",
    "section": "DF",
    "year": "III",
    "semester": "V Sem",
    "type": "Seminar 1"
  },
  "timeSlots": [
    { "lecture": 1, "time": "8.00-8.50" },
    { "lecture": 2, "time": "8.50-9.40" },
    { "lecture": 3, "time": "9.40-10.30" },
    { "lecture": 4, "time": "10.30-11.20" },
    { "lecture": 5, "time": "11.20-12.05" },
    { "lecture": 6, "time": "12.05-12.50" }
  ],
  "schedule": [
    {
      "day": "Monday",
      "classes": [
        { "lecture": 1, "details": null },
        { "lecture": 2, "details": null },
        { "lecture": 3, "details": null },
        { "lecture": 4, "details": null },
        { "lecture": 5, "details": null },
        { "lecture": 6, "details": null }
      ]
    },
    {
      "day": "Tuesday",
      "classes": [
        { "lecture": 1, "details": null },
        { "lecture": 2, "details": null },
        { "lecture": 3, "details": null },
        { "lecture": 4, "details": null },
        { "lecture": 5, "details": null },
        { "lecture": 6, "details": null }
      ]
    },
    {
      "day": "Wednesday",
      "classes": [
        { "lecture": 1, "details": null },
        { "lecture": 2, "details": null },
        { "lecture": 3, "subject": "IP", "venue": "Seminar 1", "faculty": "Mr. Jay" },
        { "lecture": 4, "subject": "DAA", "venue": "Seminar 1", "faculty": "Dr. Seema Sharma" },
        { "lecture": 5, "subject": "ML", "venue": "Seminar 2", "faculty": "Mr. Ankit Taneza" },
        { "lecture": 6, "details": null }
      ]
    },
    {
      "day": "Thursday",
      "classes": [
        { "lecture": 1, "subject": "IP", "venue": "Seminar 2", "faculty": "Mr. Jay" },
        { "lecture": 2, "subject": "FLAT", "venue": "Seminar 2", "faculty": "Mr. Vedprakash" },
        { "lecture": 3, "subject": "ML Lab", "venue": "VIB 511", "faculty": "Mr. Ankit Taneza", "span": 2 },
        { "lecture": 5, "subject": "DAA", "venue": "Seminar 1", "faculty": "Dr. Seema Sharma" },
        { "lecture": 6, "subject": "Digital Forensic", "venue": "Seminar 1", "faculty": "NF6" }
      ]
    },
    {
      "day": "Friday",
      "classes": [
        { "lecture": 1, "subject": "FLAT", "venue": "Seminar 1", "faculty": "Mr. Vedprakash" },
        { "lecture": 2, "subject": "DAA", "venue": "Seminar 1", "faculty": "Dr. Seema Sharma" },
        { "lecture": 3, "subject": "ML", "venue": "Seminar 1", "faculty": "Mr. Ankit Taneza" },
        { "lecture": 4, "subject": "Digital Forensic", "venue": "Seminar 1", "faculty": "NF6" },
        { "lecture": 5, "subject": "IP Lab", "venue": "VIB 511", "faculty": "Mr. Jay", "span": 2 }
      ]
    },
    {
      "day": "Saturday",
      "classes": [
        { "lecture": 1, "subject": "DAA Lab", "venue": "VIB 511", "faculty": "Dr. Seema Sharma", "span": 2 },
        { "lecture": 3, "subject": "FLAT", "venue": "Seminar 1", "faculty": "Mr. Vedprakash" },
        { "lecture": 4, "subject": "IP", "venue": "Seminar 1", "faculty": "Mr. Jay" },
        { "lecture": 5, "subject": "Digital Forensic", "venue": "Seminar 1", "faculty": "NF6" },
        { "lecture": 6, "subject": "ML", "venue": "Seminar 1", "faculty": "Mr. Ankit Taneza" }
      ]
    }
  ],
  "faculty": [
    { "subject": "FLAT", "faculty": "Mr. Vedprakash" },
    { "subject": "DAA", "faculty": "Dr. Seema Sharma" },
    { "subject": "IP", "faculty": "Mr. Jay" },
    { "subject": "ML", "faculty": "Mr. Ankit Taneza" },
    { "subject": "Digital Forensic", "faculty": "NF6" },
    { "subject": "ML Lab", "faculty": "Mr. Ankit Taneza" },
    { "subject": "IP Lab", "faculty": "Mr. Jay" },
    { "subject": "DAA Lab", "faculty": "Dr. Seema Sharma" }
  ]
};

const SAMPLE_TECH_INSTITUTE = {
  "university": "INSTITUTE OF TECHNOLOGY & SCIENCE",
  "department": "ARTIFICIAL INTELLIGENCE & DATA SCIENCE",
  "timetableInfo": {
    "title": "WEEKLY SCHEDULE",
    "section": "AI-A",
    "year": "IV",
    "semester": "VII Sem",
    "type": "Block B-302"
  },
  "timeSlots": [
    { "lecture": 1, "time": "9:00 - 10:00" },
    { "lecture": 2, "time": "10:00 - 11:00" },
    { "lecture": 3, "time": "11:15 - 12:15" },
    { "lecture": 4, "time": "12:15 - 1:15" },
    { "lecture": 5, "time": "2:00 - 3:30" },
    { "lecture": 6, "time": "3:30 - 5:00" }
  ],
  "schedule": [
    {
      "day": "Monday",
      "classes": [
        { "lecture": 1, "subject": "Deep Learning", "venue": "LH-1", "faculty": "Prof. Alan Turing" },
        { "lecture": 2, "subject": "Cloud Computing", "venue": "LH-1", "faculty": "Dr. Grace Hopper" },
        { "lecture": 3, "subject": "NLP", "venue": "LH-3", "faculty": "Dr. Noam Chomsky" },
        { "lecture": 4, "subject": "AI Ethics", "venue": "LH-3", "faculty": "Prof. Timnit Gebru" },
        { "lecture": 5, "subject": "DL Lab", "venue": "NVIDIA Lab 4", "faculty": "Prof. Alan Turing", "span": 2 }
      ]
    },
    {
      "day": "Tuesday",
      "classes": [
        { "lecture": 1, "subject": "Cloud Computing", "venue": "LH-1", "faculty": "Dr. Grace Hopper" },
        { "lecture": 2, "subject": "NLP", "venue": "LH-3", "faculty": "Dr. Noam Chomsky" },
        { "lecture": 3, "subject": "Deep Learning", "venue": "LH-1", "faculty": "Prof. Alan Turing" },
        { "lecture": 4, "details": null },
        { "lecture": 5, "subject": "Capstone Project", "venue": "Project Lab", "faculty": "Faculty Mentors", "span": 2 }
      ]
    },
    {
      "day": "Wednesday",
      "classes": [
        { "lecture": 1, "subject": "AI Ethics", "venue": "LH-3", "faculty": "Prof. Timnit Gebru" },
        { "lecture": 2, "subject": "Deep Learning", "venue": "LH-1", "faculty": "Prof. Alan Turing" },
        { "lecture": 3, "subject": "Cloud Lab", "venue": "AWS Cloud Lab", "faculty": "Dr. Grace Hopper", "span": 2 },
        { "lecture": 5, "subject": "Seminar", "venue": "Auditorium", "faculty": "Guest Lecturers" },
        { "lecture": 6, "details": null }
      ]
    },
    {
      "day": "Thursday",
      "classes": [
        { "lecture": 1, "subject": "NLP", "venue": "LH-3", "faculty": "Dr. Noam Chomsky" },
        { "lecture": 2, "subject": "Cloud Computing", "venue": "LH-1", "faculty": "Dr. Grace Hopper" },
        { "lecture": 3, "subject": "Big Data Analytics", "venue": "LH-2", "faculty": "Dr. Dean Jeffrey" },
        { "lecture": 4, "subject": "Big Data Analytics", "venue": "LH-2", "faculty": "Dr. Dean Jeffrey" },
        { "lecture": 5, "subject": "NLP Lab", "venue": "Language Lab", "faculty": "Dr. Noam Chomsky", "span": 2 }
      ]
    },
    {
      "day": "Friday",
      "classes": [
        { "lecture": 1, "subject": "Big Data Analytics", "venue": "LH-2", "faculty": "Dr. Dean Jeffrey" },
        { "lecture": 2, "subject": "AI Ethics", "venue": "LH-3", "faculty": "Prof. Timnit Gebru" },
        { "lecture": 3, "subject": "Special Topic Lecture", "venue": "LH-1", "faculty": "Visiting Professor" },
        { "lecture": 4, "details": null },
        { "lecture": 5, "subject": "Mentorship & Clubs", "venue": "Activity Hall", "faculty": "Student Council", "span": 2 }
      ]
    }
  ],
  "faculty": [
    { "subject": "Deep Learning", "faculty": "Prof. Alan Turing" },
    { "subject": "Cloud Computing", "faculty": "Dr. Grace Hopper" },
    { "subject": "NLP", "faculty": "Dr. Noam Chomsky" },
    { "subject": "AI Ethics", "faculty": "Prof. Timnit Gebru" },
    { "subject": "Big Data Analytics", "faculty": "Dr. Dean Jeffrey" },
    { "subject": "DL Lab", "faculty": "Prof. Alan Turing" },
    { "subject": "Cloud Lab", "faculty": "Dr. Grace Hopper" },
    { "subject": "NLP Lab", "faculty": "Dr. Noam Chomsky" }
  ]
};

// Expose globally for browser usage without module bundlers
window.SAMPLE_JECRC = SAMPLE_JECRC;
window.SAMPLE_TECH_INSTITUTE = SAMPLE_TECH_INSTITUTE;
