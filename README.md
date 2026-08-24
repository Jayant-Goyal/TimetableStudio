# 📅 Timetable Studio (JPEG & PNG Exporter & Mobile PWA)

A 100% client-side web application built with **HTML5, CSS3, and JavaScript** that takes university or school timetable data in JSON or `.ttstudio` format and exports high-resolution, publication-ready timetable graphics in **JPEG** and **PNG** formats, along with a standalone **Android Mobile Companion WebApp (PWA)** for your home screen.

---

## ⚡ Zero Backend / Pure HTML, CSS & JavaScript

- **No Python or server required**: You can open `index.html` directly in your browser by double-clicking it on your computer.
- **GitHub Pages Ready**: Upload to GitHub and enable Pages with zero build configuration.
- **100% Offline Ready**: Includes offline caching and full Progressive Web App (PWA) support.

---

## 🌐 Deploy to GitHub Pages

The project is built entirely as a static client-side web application with relative paths and CDN assets, making it 100% compatible with GitHub Pages.

### Method 1: Push via Git
1. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Deploy Timetable Studio"
   git branch -M main
   ```
2. Link your GitHub repository and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   git push -u origin main
   ```
3. Enable GitHub Pages on GitHub:
   - Go to your repository on GitHub.
   - Click **Settings** ➔ **Pages** (on the left menu).
   - Under **Build and deployment**:
     - **Source**: Select **GitHub Actions** (the included `.github/workflows/deploy.yml` will automatically build & deploy) **OR** select **Deploy from a branch** ➔ select `main` branch ➔ `/ (root)` folder ➔ Click **Save**.
   - Your website will be live at `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`!

---

## 📱 Android Mobile Companion WebApp (PWA)

Located in `/mobile/index.html`:
- **Add to Home Screen**: Installable as a standalone Android app with 1-tap from Chrome/Brave/Edge.
- **⚡ Today's Live Schedule**: Real-time tracker detecting ongoing lectures with countdown progress bar and upcoming classes.
- **📅 Full Week Matrix**: Interactive weekly schedule with orientation flip and direct image saving.
- **📊 Smart Insights**: Weekly workload analysis, theory vs lab ratios, and faculty distribution.
- **✅ Attendance Tracker**: 75% attendance threshold planner with safe-skip calculators and +Attended/-Missed counters.
- **🔄 Predefined Schedule & Switcher**: Remembers your active timetable in `localStorage` so tapping the home screen icon instantly opens your personal schedule.

---

## ✨ Highlights & Features

### 1. 📦 Proprietary `.ttstudio` Package Bundle
- Encapsulates complete timetable schedule, selected theme, orientation, typography, and display settings in a single portable file.
- 1-click export and import in both desktop and mobile apps.

### 2. 🔄 Flexible Layout Orientation
- **Periods in Rows (Days as Columns)**: Perfect for vertical schedules and standard mobile/tablet viewing.
- **Periods in Columns (Days as Rows)**: Classic horizontal timetable view.
- Multi-period lectures (e.g. `span: 2` lab sessions) are dynamically expanded across multiple rows or columns.

### 3. 🎨 17 Curated Aesthetic Themes
- **Modern Slate**, **Oxford Academic**, **Sunset Warmth**, **Botanical Emerald**, **Lavender Nebula**, **Nordic Minimalist**, **Oceanic Turquoise**, **Tokyo Sakura**, **Vintage Manuscript**, **Matcha Zen**, **Midnight Obsidian**, **Dracula Gothic**, **Solar Flare**, **Aurora Borealis**, **Espresso Roast**, **Cosmic Nebula**, and **Synthwave / Cyberpunk**.

### 4. 📸 Ultra-High Resolution Export (Up to 5x / 7800px)
- **1x (Web Standard - 1560px)**: Compact export for messaging.
- **2x (Retina HD - 3120px)**: Crisp, high-DPI rasterization.
- **3x (Ultra-HD 300 DPI - 4680px)**: Standard print quality.
- **4x (4K Ultra-Sharp - 6240px)**: Presentation slides and 4K displays.
- **5x (Master Print 600 DPI - 7800px)**: Giant print-grade clarity for poster and wall banner reproduction.

---

## 💻 How to Use Locally

- Desktop Studio: Double-click [`index.html`](index.html).
- Mobile Companion: Double-click [`mobile/index.html`](mobile/index.html).

---

## 📋 JSON Format Specification

```json
{
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
      "day": "Thursday",
      "classes": [
        { "lecture": 1, "subject": "IP", "venue": "Seminar 2", "faculty": "Mr. Jay", "span": 1 },
        { "lecture": 2, "subject": "FLAT", "venue": "Seminar 2", "faculty": "Mr. Vedprakash", "span": 1 },
        { "lecture": 3, "subject": "ML Lab", "venue": "VIB 511", "faculty": "Mr. Ankit Taneza", "span": 2 },
        { "lecture": 5, "subject": "DAA", "venue": "Seminar 1", "faculty": "Dr. Seema Sharma", "span": 1 },
        { "lecture": 6, "subject": "Digital Forensic", "venue": "Seminar 1", "faculty": "NF6", "span": 1 }
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
}
```
