/**
 * Timetable Themes & Color Palettes
 * Comprehensive collection of 17 distinct aesthetic themes
 */

const THEMES = [
  {
    id: "modern-slate",
    name: "Modern Slate",
    category: "light",
    description: "Clean, crisp minimalist aesthetic with subtle indigo borders",
    preview: ["#f8fafc", "#3b82f6", "#0f172a"],
    styles: {
      bg: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
      cardBg: "#ffffff",
      cardBorder: "#cbd5e1",
      cardShadow: "0 20px 35px -10px rgba(15, 23, 42, 0.1), 0 1px 3px rgba(0,0,0,0.05)",
      headerBg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      headerText: "#ffffff",
      deptText: "#94a3b8",
      badgeBg: "rgba(255, 255, 255, 0.12)",
      badgeText: "#e2e8f0",
      badgeBorder: "rgba(255, 255, 255, 0.2)",
      tableBorder: "#e2e8f0",
      headCellBg: "#f8fafc",
      headCellText: "#1e293b",
      timeText: "#64748b",
      cellBg: "#ffffff",
      cellText: "#0f172a",
      subText: "#475569",
      emptyCellBg: "#f8fafc",
      emptyCellPattern: "radial-gradient(#cbd5e1 1px, transparent 1px)",
      legendBg: "#f8fafc",
      legendBorder: "#e2e8f0",
      accent: "#3b82f6",
      labTagBg: "#ecfdf5",
      labTagText: "#047857",
      labTagBorder: "#a7f3d0"
    },
    subjectColors: [
      { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" }, // Blue
      { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" }, // Green
      { bg: "#faf5ff", text: "#6b21a8", border: "#e9d5ff" }, // Purple
      { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" }, // Orange
      { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8" }, // Pink
      { bg: "#f0fdfa", text: "#115e59", border: "#99f6e4" }, // Teal
      { bg: "#fefce8", text: "#854d0e", border: "#fef08a" }, // Yellow
      { bg: "#f5f3ff", text: "#5b21b6", border: "#ddd6fe" }  // Violet
    ]
  },
  {
    id: "midnight-cyber",
    name: "Midnight Obsidian",
    category: "dark",
    description: "Sleek dark theme with glowing cyan and violet accents",
    preview: ["#090d16", "#06b6d4", "#8b5cf6"],
    styles: {
      bg: "linear-gradient(135deg, #030712 0%, #0b1120 100%)",
      cardBg: "#0f172a",
      cardBorder: "#1e293b",
      cardShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(6, 182, 212, 0.15)",
      headerBg: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
      headerText: "#f8fafc",
      deptText: "#38bdf8",
      badgeBg: "rgba(56, 189, 248, 0.12)",
      badgeText: "#bae6fd",
      badgeBorder: "rgba(56, 189, 248, 0.3)",
      tableBorder: "#1e293b",
      headCellBg: "#090e1a",
      headCellText: "#e2e8f0",
      timeText: "#94a3b8",
      cellBg: "#111c33",
      cellText: "#f1f5f9",
      subText: "#94a3b8",
      emptyCellBg: "#070b14",
      emptyCellPattern: "radial-gradient(#1e293b 1px, transparent 1px)",
      legendBg: "#090e1a",
      legendBorder: "#1e293b",
      accent: "#38bdf8",
      labTagBg: "rgba(16, 185, 129, 0.15)",
      labTagText: "#34d399",
      labTagBorder: "rgba(16, 185, 129, 0.35)"
    },
    subjectColors: [
      { bg: "#172554", text: "#93c5fd", border: "#1d4ed8" }, // Deep blue
      { bg: "#064e3b", text: "#6ee7b7", border: "#059669" }, // Emerald
      { bg: "#3b0764", text: "#d8b4fe", border: "#7e22ce" }, // Violet
      { bg: "#431407", text: "#fdba74", border: "#c2410c" }, // Orange
      { bg: "#4c0519", text: "#f472b6", border: "#be123c" }, // Rose
      { bg: "#134e4a", text: "#5eead4", border: "#0f766e" }, // Teal
      { bg: "#422006", text: "#fde047", border: "#a16207" }, // Amber
      { bg: "#1e1b4b", text: "#c4b5fd", border: "#4338ca" }  // Indigo
    ]
  },
  {
    id: "oxford-navy",
    name: "Oxford Academic",
    category: "light",
    description: "Scholarly, authoritative classic navy with warm gold touches",
    preview: ["#0a192f", "#d97706", "#f8fafc"],
    styles: {
      bg: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
      cardBg: "#ffffff",
      cardBorder: "#94a3b8",
      cardShadow: "0 20px 30px -10px rgba(10, 25, 47, 0.2)",
      headerBg: "linear-gradient(135deg, #0a192f 0%, #1e3a5f 100%)",
      headerText: "#ffffff",
      deptText: "#fbbf24",
      badgeBg: "rgba(251, 191, 36, 0.15)",
      badgeText: "#fef3c7",
      badgeBorder: "rgba(251, 191, 36, 0.4)",
      tableBorder: "#cbd5e1",
      headCellBg: "#0a192f",
      headCellText: "#f8fafc",
      timeText: "#cbd5e1",
      cellBg: "#f8fafc",
      cellText: "#0a192f",
      subText: "#334155",
      emptyCellBg: "#f1f5f9",
      emptyCellPattern: "radial-gradient(#cbd5e1 1.2px, transparent 1.2px)",
      legendBg: "#f8fafc",
      legendBorder: "#cbd5e1",
      accent: "#d97706",
      labTagBg: "#fef3c7",
      labTagText: "#92400e",
      labTagBorder: "#fde68a"
    },
    subjectColors: [
      { bg: "#e0e7ff", text: "#1e1b4b", border: "#818cf8" },
      { bg: "#ecfdf5", text: "#064e3b", border: "#34d399" },
      { bg: "#fffbeb", text: "#78350f", border: "#fcd34d" },
      { bg: "#fae8ff", text: "#581c87", border: "#c084fc" },
      { bg: "#ffe4e6", text: "#881337", border: "#fb7185" },
      { bg: "#ccfbf1", text: "#134e4a", border: "#2dd4bf" },
      { bg: "#ffedd5", text: "#7c2d12", border: "#fb923c" },
      { bg: "#e2e8f0", text: "#0f172a", border: "#94a3b8" }
    ]
  },
  {
    id: "sunset-coral",
    name: "Sunset Warmth",
    category: "light",
    description: "Inviting warm gradients, terracotta, amber, and rose tones",
    preview: ["#fff1f2", "#f43f5e", "#ea580c"],
    styles: {
      bg: "linear-gradient(135deg, #ffe4e6 0%, #fed7aa 100%)",
      cardBg: "#ffffff",
      cardBorder: "#fecdd3",
      cardShadow: "0 20px 35px -10px rgba(225, 29, 72, 0.15)",
      headerBg: "linear-gradient(135deg, #e11d48 0%, #ea580c 100%)",
      headerText: "#ffffff",
      deptText: "#ffedd5",
      badgeBg: "rgba(255, 255, 255, 0.2)",
      badgeText: "#ffffff",
      badgeBorder: "rgba(255, 255, 255, 0.35)",
      tableBorder: "#fed7aa",
      headCellBg: "#fff1f2",
      headCellText: "#881337",
      timeText: "#9f1239",
      cellBg: "#ffffff",
      cellText: "#431407",
      subText: "#7c2d12",
      emptyCellBg: "#fff7ed",
      emptyCellPattern: "radial-gradient(#fed7aa 1px, transparent 1px)",
      legendBg: "#fff1f2",
      legendBorder: "#fecdd3",
      accent: "#f43f5e",
      labTagBg: "#ffe4e6",
      labTagText: "#9f1239",
      labTagBorder: "#f43f5e"
    },
    subjectColors: [
      { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3" },
      { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" },
      { bg: "#fefce8", text: "#854d0e", border: "#fef08a" },
      { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8" },
      { bg: "#faf5ff", text: "#6b21a8", border: "#e9d5ff" },
      { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
      { bg: "#f0f9ff", text: "#075985", border: "#bae6fd" },
      { bg: "#fffbeb", text: "#92400e", border: "#fde68a" }
    ]
  },
  {
    id: "botanical-sage",
    name: "Botanical Emerald",
    category: "light",
    description: "Harmonious forest, sage, and mint tones for natural balance",
    preview: ["#f0fdf4", "#059669", "#064e3b"],
    styles: {
      bg: "linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)",
      cardBg: "#ffffff",
      cardBorder: "#a7f3d0",
      cardShadow: "0 20px 35px -10px rgba(5, 150, 105, 0.15)",
      headerBg: "linear-gradient(135deg, #064e3b 0%, #047857 100%)",
      headerText: "#ffffff",
      deptText: "#a7f3d0",
      badgeBg: "rgba(255, 255, 255, 0.18)",
      badgeText: "#ecfdf5",
      badgeBorder: "rgba(255, 255, 255, 0.3)",
      tableBorder: "#bbf7d0",
      headCellBg: "#f0fdf4",
      headCellText: "#064e3b",
      timeText: "#047857",
      cellBg: "#ffffff",
      cellText: "#064e3b",
      subText: "#065f46",
      emptyCellBg: "#f0fdf4",
      emptyCellPattern: "radial-gradient(#a7f3d0 1px, transparent 1px)",
      legendBg: "#f0fdf4",
      legendBorder: "#bbf7d0",
      accent: "#059669",
      labTagBg: "#dcfce7",
      labTagText: "#065f46",
      labTagBorder: "#86efac"
    },
    subjectColors: [
      { bg: "#ecfdf5", text: "#065f46", border: "#6ee7b7" },
      { bg: "#f0fdfa", text: "#115e59", border: "#5eead4" },
      { bg: "#f7fee7", text: "#3f6212", border: "#bef264" },
      { bg: "#eff6ff", text: "#1e40af", border: "#93c5fd" },
      { bg: "#fefce8", text: "#854d0e", border: "#fde047" },
      { bg: "#faf5ff", text: "#6b21a8", border: "#d8b4fe" },
      { bg: "#fff7ed", text: "#9a3412", border: "#fdba74" },
      { bg: "#fdf2f8", text: "#9d174d", border: "#f472b6" }
    ]
  },
  {
    id: "lavender-dream",
    name: "Lavender Nebula",
    category: "light",
    description: "Soothing pastel violet, lilac cards, and dreamy soft aesthetic",
    preview: ["#f5f3ff", "#8b5cf6", "#4c1d95"],
    styles: {
      bg: "linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)",
      cardBg: "#ffffff",
      cardBorder: "#ddd6fe",
      cardShadow: "0 20px 35px -10px rgba(139, 92, 246, 0.15)",
      headerBg: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)",
      headerText: "#ffffff",
      deptText: "#ddd6fe",
      badgeBg: "rgba(255, 255, 255, 0.18)",
      badgeText: "#f5f3ff",
      badgeBorder: "rgba(255, 255, 255, 0.3)",
      tableBorder: "#ede9fe",
      headCellBg: "#f5f3ff",
      headCellText: "#4c1d95",
      timeText: "#6d28d9",
      cellBg: "#ffffff",
      cellText: "#2e1065",
      subText: "#5b21b6",
      emptyCellBg: "#faf5ff",
      emptyCellPattern: "radial-gradient(#ddd6fe 1px, transparent 1px)",
      legendBg: "#f5f3ff",
      legendBorder: "#ddd6fe",
      accent: "#8b5cf6",
      labTagBg: "#ede9fe",
      labTagText: "#5b21b6",
      labTagBorder: "#c4b5fd"
    },
    subjectColors: [
      { bg: "#f5f3ff", text: "#5b21b6", border: "#c4b5fd" },
      { bg: "#eef2ff", text: "#3730a3", border: "#a5b4fc" },
      { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8" },
      { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
      { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" },
      { bg: "#f0f9ff", text: "#075985", border: "#bae6fd" },
      { bg: "#fdf4ff", text: "#86198f", border: "#f5d0fe" },
      { bg: "#fefce8", text: "#854d0e", border: "#fef08a" }
    ]
  },
  {
    id: "nordic-monochrome",
    name: "Nordic Minimalist",
    category: "light",
    description: "Bauhaus editorial monochrome with sharp typography and contrast",
    preview: ["#ffffff", "#000000", "#52525b"],
    styles: {
      bg: "linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 100%)",
      cardBg: "#ffffff",
      cardBorder: "#18181b",
      cardShadow: "8px 8px 0px #18181b",
      headerBg: "#18181b",
      headerText: "#ffffff",
      deptText: "#a1a1aa",
      badgeBg: "#27272a",
      badgeText: "#fafafa",
      badgeBorder: "#3f3f46",
      tableBorder: "#18181b",
      headCellBg: "#f4f4f5",
      headCellText: "#09090b",
      timeText: "#52525b",
      cellBg: "#ffffff",
      cellText: "#09090b",
      subText: "#52525b",
      emptyCellBg: "#fafafa",
      emptyCellPattern: "radial-gradient(#a1a1aa 1.2px, transparent 1.2px)",
      legendBg: "#f4f4f5",
      legendBorder: "#18181b",
      accent: "#18181b",
      labTagBg: "#18181b",
      labTagText: "#ffffff",
      labTagBorder: "#18181b"
    },
    subjectColors: [
      { bg: "#f4f4f5", text: "#18181b", border: "#71717a" },
      { bg: "#e4e4e7", text: "#09090b", border: "#52525b" },
      { bg: "#d4d4d8", text: "#18181b", border: "#3f3f46" },
      { bg: "#fafafa", text: "#27272a", border: "#a1a1aa" },
      { bg: "#f4f4f5", text: "#18181b", border: "#71717a" },
      { bg: "#e4e4e7", text: "#09090b", border: "#52525b" },
      { bg: "#d4d4d8", text: "#18181b", border: "#3f3f46" },
      { bg: "#fafafa", text: "#27272a", border: "#a1a1aa" }
    ]
  },
  {
    id: "cyberpunk-neon",
    name: "Synthwave / Cyberpunk",
    category: "dark",
    description: "High-voltage electric yellow, hot pink, and dark carbon matrix",
    preview: ["#0d0221", "#ffe600", "#ff007f"],
    styles: {
      bg: "linear-gradient(135deg, #090014 0%, #15002b 100%)",
      cardBg: "#0f051d",
      cardBorder: "#ff007f",
      cardShadow: "0 0 30px rgba(255, 0, 127, 0.3), 0 0 60px rgba(0, 245, 255, 0.15)",
      headerBg: "linear-gradient(135deg, #1f013d 0%, #000000 100%)",
      headerText: "#ffe600",
      deptText: "#00f5ff",
      badgeBg: "rgba(255, 0, 127, 0.2)",
      badgeText: "#ffffff",
      badgeBorder: "#ff007f",
      tableBorder: "#38106a",
      headCellBg: "#170233",
      headCellText: "#00f5ff",
      timeText: "#ff90e8",
      cellBg: "#180630",
      cellText: "#ffffff",
      subText: "#9ca3af",
      emptyCellBg: "#0c011a",
      emptyCellPattern: "radial-gradient(#ff007f 1px, transparent 1px)",
      legendBg: "#170233",
      legendBorder: "#ff007f",
      accent: "#ffe600",
      labTagBg: "rgba(255, 230, 0, 0.2)",
      labTagText: "#ffe600",
      labTagBorder: "#ffe600"
    },
    subjectColors: [
      { bg: "#2a0845", text: "#ff90e8", border: "#ff007f" },
      { bg: "#042c38", text: "#00f5ff", border: "#00b4d8" },
      { bg: "#362f02", text: "#ffe600", border: "#e5c300" },
      { bg: "#063d27", text: "#39ff14", border: "#00c853" },
      { bg: "#420624", text: "#ff3399", border: "#c2185b" },
      { bg: "#1f0945", text: "#b388ff", border: "#7c4dff" },
      { bg: "#3d1303", text: "#ff6d00", border: "#e65100" },
      { bg: "#022e3d", text: "#18ffff", border: "#00b0ff" }
    ]
  },
  {
    id: "ocean-breeze",
    name: "Oceanic Turquoise",
    category: "light",
    description: "Deep sea cobalt, breezy cyan, and crystalline fresh tones",
    preview: ["#f0fdfa", "#0284c7", "#0f766e"],
    styles: {
      bg: "linear-gradient(135deg, #ccfbf1 0%, #e0f2fe 100%)",
      cardBg: "#ffffff",
      cardBorder: "#99f6e4",
      cardShadow: "0 20px 35px -10px rgba(14, 165, 233, 0.15)",
      headerBg: "linear-gradient(135deg, #0369a1 0%, #0f766e 100%)",
      headerText: "#ffffff",
      deptText: "#bae6fd",
      badgeBg: "rgba(255, 255, 255, 0.2)",
      badgeText: "#ffffff",
      badgeBorder: "rgba(255, 255, 255, 0.35)",
      tableBorder: "#99f6e4",
      headCellBg: "#f0fdfa",
      headCellText: "#0f766e",
      timeText: "#0284c7",
      cellBg: "#ffffff",
      cellText: "#0c4a6e",
      subText: "#0369a1",
      emptyCellBg: "#f0fdfa",
      emptyCellPattern: "radial-gradient(#99f6e4 1px, transparent 1px)",
      legendBg: "#f0fdfa",
      legendBorder: "#99f6e4",
      accent: "#0284c7",
      labTagBg: "#e0f2fe",
      labTagText: "#0369a1",
      labTagBorder: "#7dd3fc"
    },
    subjectColors: [
      { bg: "#e0f2fe", text: "#0369a1", border: "#7dd3fc" },
      { bg: "#ccfbf1", text: "#0f766e", border: "#5eead4" },
      { bg: "#e0e7ff", text: "#3730a3", border: "#a5b4fc" },
      { bg: "#ecfdf5", text: "#065f46", border: "#6ee7b7" },
      { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
      { bg: "#fae8ff", text: "#6b21a8", border: "#d8b4fe" },
      { bg: "#ffedd5", text: "#9a3412", border: "#fdba74" },
      { bg: "#f1f5f9", text: "#334155", border: "#cbd5e1" }
    ]
  },
  // ================= NEW CREATIVE THEMES =================
  {
    id: "tokyo-sakura",
    name: "Tokyo Sakura",
    category: "light",
    description: "Delicate cherry blossom rose, subtle gold accents, and Japanese serenity",
    preview: ["#fff1f2", "#f43f5e", "#fda4af"],
    styles: {
      bg: "linear-gradient(135deg, #ffe4e6 0%, #fce7f3 50%, #fed7aa 100%)",
      cardBg: "#ffffff",
      cardBorder: "#fbcfe8",
      cardShadow: "0 20px 35px -10px rgba(244, 63, 94, 0.15)",
      headerBg: "linear-gradient(135deg, #9d174d 0%, #be123c 50%, #e11d48 100%)",
      headerText: "#ffffff",
      deptText: "#fce7f3",
      badgeBg: "rgba(255, 255, 255, 0.2)",
      badgeText: "#ffffff",
      badgeBorder: "rgba(255, 255, 255, 0.35)",
      tableBorder: "#fbcfe8",
      headCellBg: "#fdf2f8",
      headCellText: "#831843",
      timeText: "#9d174d",
      cellBg: "#ffffff",
      cellText: "#500724",
      subText: "#831843",
      emptyCellBg: "#fff1f2",
      emptyCellPattern: "radial-gradient(#fbcfe8 1px, transparent 1px)",
      legendBg: "#fdf2f8",
      legendBorder: "#fbcfe8",
      accent: "#f43f5e",
      labTagBg: "#fce7f3",
      labTagText: "#9d174d",
      labTagBorder: "#f472b6"
    },
    subjectColors: [
      { bg: "#fce7f3", text: "#9d174d", border: "#f472b6" },
      { bg: "#ffe4e6", text: "#9f1239", border: "#fb7185" },
      { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
      { bg: "#ede9fe", text: "#5b21b6", border: "#c4b5fd" },
      { bg: "#ccfbf1", text: "#115e59", border: "#5eead4" },
      { bg: "#ffedd5", text: "#9a3412", border: "#fdba74" },
      { bg: "#e0f2fe", text: "#0369a1", border: "#7dd3fc" },
      { bg: "#f0fdf4", text: "#166534", border: "#86efac" }
    ]
  },
  {
    id: "dracula-vampire",
    name: "Dracula Gothic",
    category: "dark",
    description: "Deep obsidian purple, neon fuchsia, vampire violet, and mint glow",
    preview: ["#181424", "#bd93f9", "#ff79c6"],
    styles: {
      bg: "linear-gradient(135deg, #0e0b16 0%, #1a102f 100%)",
      cardBg: "#1e1735",
      cardBorder: "#413264",
      cardShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(189, 147, 249, 0.2)",
      headerBg: "linear-gradient(135deg, #110726 0%, #28114b 100%)",
      headerText: "#f8f8f2",
      deptText: "#50fa7b",
      badgeBg: "rgba(189, 147, 249, 0.15)",
      badgeText: "#bd93f9",
      badgeBorder: "rgba(189, 147, 249, 0.35)",
      tableBorder: "#342654",
      headCellBg: "#140e24",
      headCellText: "#bd93f9",
      timeText: "#ff79c6",
      cellBg: "#1f1838",
      cellText: "#f8f8f2",
      subText: "#a79abf",
      emptyCellBg: "#110c20",
      emptyCellPattern: "radial-gradient(#413264 1px, transparent 1px)",
      legendBg: "#140e24",
      legendBorder: "#413264",
      accent: "#ff79c6",
      labTagBg: "rgba(80, 250, 123, 0.15)",
      labTagText: "#50fa7b",
      labTagBorder: "rgba(80, 250, 123, 0.4)"
    },
    subjectColors: [
      { bg: "#361c56", text: "#ff79c6", border: "#ff79c6" },
      { bg: "#1b3345", text: "#8be9fd", border: "#8be9fd" },
      { bg: "#133829", text: "#50fa7b", border: "#50fa7b" },
      { bg: "#42281a", text: "#ffb86c", border: "#ffb86c" },
      { bg: "#301d4a", text: "#bd93f9", border: "#bd93f9" },
      { bg: "#451928", text: "#ff5555", border: "#ff5555" },
      { bg: "#38361b", text: "#f1fa8c", border: "#f1fa8c" },
      { bg: "#1a2c42", text: "#60a5fa", border: "#60a5fa" }
    ]
  },
  {
    id: "vintage-parchment",
    name: "Vintage Manuscript",
    category: "light",
    description: "Classic sepia, antique ivory parchment, and historic academic elegance",
    preview: ["#fefbf3", "#78350f", "#b45309"],
    styles: {
      bg: "linear-gradient(135deg, #f7efe1 0%, #eedbc5 100%)",
      cardBg: "#fefbf3",
      cardBorder: "#d4be9f",
      cardShadow: "0 20px 35px -10px rgba(120, 53, 15, 0.15)",
      headerBg: "linear-gradient(135deg, #3d2314 0%, #54331d 100%)",
      headerText: "#fefbf3",
      deptText: "#d4be9f",
      badgeBg: "rgba(254, 251, 243, 0.18)",
      badgeText: "#fefbf3",
      badgeBorder: "rgba(254, 251, 243, 0.35)",
      tableBorder: "#d4be9f",
      headCellBg: "#f5ebdb",
      headCellText: "#3d2314",
      timeText: "#78350f",
      cellBg: "#fefbf3",
      cellText: "#2c1810",
      subText: "#5c3d2e",
      emptyCellBg: "#f7efe1",
      emptyCellPattern: "radial-gradient(#d4be9f 1px, transparent 1px)",
      legendBg: "#f5ebdb",
      legendBorder: "#d4be9f",
      accent: "#b45309",
      labTagBg: "#f3e2cc",
      labTagText: "#54331d",
      labTagBorder: "#b45309"
    },
    subjectColors: [
      { bg: "#f3e8d7", text: "#54331d", border: "#c8b093" },
      { bg: "#e8ede4", text: "#2e452a", border: "#a8baa2" },
      { bg: "#f5e4e0", text: "#63271d", border: "#cc9e95" },
      { bg: "#e4eaf0", text: "#243a4e", border: "#9fb4c7" },
      { bg: "#eee2eb", text: "#522646", border: "#b897ae" },
      { bg: "#f7ebd9", text: "#694314", border: "#d4b58e" },
      { bg: "#e5ede9", text: "#26483b", border: "#99b5a8" },
      { bg: "#ece7e2", text: "#423832", border: "#b0a59e" }
    ]
  },
  {
    id: "solar-flare",
    name: "Solar Flare",
    category: "dark",
    description: "Blazing molten amber, sunburst orange, and radiant stellar glow",
    preview: ["#1c0c02", "#f97316", "#eab308"],
    styles: {
      bg: "linear-gradient(135deg, #120601 0%, #2e1104 100%)",
      cardBg: "#1a0b02",
      cardBorder: "#7c2d12",
      cardShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(249, 115, 22, 0.25)",
      headerBg: "linear-gradient(135deg, #431407 0%, #9a3412 50%, #ea580c 100%)",
      headerText: "#ffffff",
      deptText: "#fde047",
      badgeBg: "rgba(253, 224, 71, 0.15)",
      badgeText: "#fef08a",
      badgeBorder: "rgba(253, 224, 71, 0.4)",
      tableBorder: "#541c08",
      headCellBg: "#1e0e04",
      headCellText: "#fb923c",
      timeText: "#fde047",
      cellBg: "#210f03",
      cellText: "#fed7aa",
      subText: "#fdba74",
      emptyCellBg: "#140801",
      emptyCellPattern: "radial-gradient(#7c2d12 1px, transparent 1px)",
      legendBg: "#1e0e04",
      legendBorder: "#541c08",
      accent: "#f97316",
      labTagBg: "rgba(234, 179, 8, 0.2)",
      labTagText: "#fde047",
      labTagBorder: "rgba(234, 179, 8, 0.5)"
    },
    subjectColors: [
      { bg: "#431407", text: "#fdba74", border: "#ea580c" },
      { bg: "#422006", text: "#fde047", border: "#ca8a04" },
      { bg: "#4c0519", text: "#fda4af", border: "#e11d48" },
      { bg: "#361604", text: "#ffedd5", border: "#f97316" },
      { bg: "#3b0764", text: "#e9d5ff", border: "#9333ea" },
      { bg: "#064e3b", text: "#a7f3d0", border: "#059669" },
      { bg: "#1e1b4b", text: "#c7d2fe", border: "#4f46e5" },
      { bg: "#451a03", text: "#fed7aa", border: "#d97706" }
    ]
  },
  {
    id: "aurora-borealis",
    name: "Aurora Borealis",
    category: "dark",
    description: "Arctic midnight sky illuminated by shimmering emerald and celestial teal waves",
    preview: ["#021d24", "#00ffc8", "#38bdf8"],
    styles: {
      bg: "linear-gradient(135deg, #011217 0%, #032b30 50%, #071927 100%)",
      cardBg: "#06222b",
      cardBorder: "#0e4e5b",
      cardShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 255, 200, 0.2)",
      headerBg: "linear-gradient(135deg, #021a20 0%, #064e5b 50%, #0f766e 100%)",
      headerText: "#f0fdfa",
      deptText: "#5eead4",
      badgeBg: "rgba(94, 234, 212, 0.15)",
      badgeText: "#ccfbf1",
      badgeBorder: "rgba(94, 234, 212, 0.4)",
      tableBorder: "#0c3b45",
      headCellBg: "#041920",
      headCellText: "#2dd4bf",
      timeText: "#38bdf8",
      cellBg: "#082933",
      cellText: "#ccfbf1",
      subText: "#99f6e4",
      emptyCellBg: "#021217",
      emptyCellPattern: "radial-gradient(#0e4e5b 1px, transparent 1px)",
      legendBg: "#041920",
      legendBorder: "#0c3b45",
      accent: "#2dd4bf",
      labTagBg: "rgba(56, 189, 248, 0.2)",
      labTagText: "#7dd3fc",
      labTagBorder: "rgba(56, 189, 248, 0.45)"
    },
    subjectColors: [
      { bg: "#064e4a", text: "#5eead4", border: "#14b8a6" },
      { bg: "#0c3d4a", text: "#7dd3fc", border: "#0284c7" },
      { bg: "#1f2947", text: "#c7d2fe", border: "#6366f1" },
      { bg: "#064e3b", text: "#6ee7b7", border: "#10b981" },
      { bg: "#31184a", text: "#e9d5ff", border: "#a855f7" },
      { bg: "#034854", text: "#99f6e4", border: "#06b6d4" },
      { bg: "#422810", text: "#fde68a", border: "#f59e0b" },
      { bg: "#361633", text: "#fbcfe8", border: "#ec4899" }
    ]
  },
  {
    id: "matcha-zen",
    name: "Matcha Zen",
    category: "light",
    description: "Organic warm oat milk, soothing matcha green, and calming earthy tranquility",
    preview: ["#f7f6f0", "#4d7c0f", "#84cc16"],
    styles: {
      bg: "linear-gradient(135deg, #f4f3ec 0%, #e9e8dd 100%)",
      cardBg: "#fdfdfa",
      cardBorder: "#d1d5bc",
      cardShadow: "0 20px 35px -10px rgba(77, 124, 15, 0.12)",
      headerBg: "linear-gradient(135deg, #283618 0%, #3a5a40 100%)",
      headerText: "#fefae0",
      deptText: "#dda15e",
      badgeBg: "rgba(254, 250, 224, 0.18)",
      badgeText: "#fefae0",
      badgeBorder: "rgba(254, 250, 224, 0.35)",
      tableBorder: "#d1d5bc",
      headCellBg: "#f0efe4",
      headCellText: "#283618",
      timeText: "#4d7c0f",
      cellBg: "#fdfdfa",
      cellText: "#283618",
      subText: "#4a5a3a",
      emptyCellBg: "#f4f3ec",
      emptyCellPattern: "radial-gradient(#d1d5bc 1px, transparent 1px)",
      legendBg: "#f0efe4",
      legendBorder: "#d1d5bc",
      accent: "#65a30d",
      labTagBg: "#ecfccb",
      labTagText: "#365314",
      labTagBorder: "#bef264"
    },
    subjectColors: [
      { bg: "#ecfccb", text: "#365314", border: "#a3e635" },
      { bg: "#fef3c7", text: "#78350f", border: "#fcd34d" },
      { bg: "#e0f2fe", text: "#0369a1", border: "#7dd3fc" },
      { bg: "#fae8ff", text: "#6b21a8", border: "#d8b4fe" },
      { bg: "#ffedd5", text: "#9a3412", border: "#fdba74" },
      { bg: "#ccfbf1", text: "#115e59", border: "#5eead4" },
      { bg: "#ffe4e6", text: "#9f1239", border: "#f43f5e" },
      { bg: "#ede9fe", text: "#5b21b6", border: "#a78bfa" }
    ]
  },
  {
    id: "espresso-roast",
    name: "Espresso Roast",
    category: "dark",
    description: "Deep roasted espresso coffee, warm cinnamon caramel, and rich velvety mocha",
    preview: ["#1c130d", "#d97706", "#b45309"],
    styles: {
      bg: "linear-gradient(135deg, #100a06 0%, #241810 100%)",
      cardBg: "#1c130d",
      cardBorder: "#4a3222",
      cardShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(217, 119, 6, 0.2)",
      headerBg: "linear-gradient(135deg, #1a0f07 0%, #382012 100%)",
      headerText: "#fffbeb",
      deptText: "#fbbf24",
      badgeBg: "rgba(251, 191, 36, 0.15)",
      badgeText: "#fef3c7",
      badgeBorder: "rgba(251, 191, 36, 0.35)",
      tableBorder: "#3a2517",
      headCellBg: "#150d08",
      headCellText: "#f59e0b",
      timeText: "#fcd34d",
      cellBg: "#221710",
      cellText: "#fef3c7",
      subText: "#d6c3b2",
      emptyCellBg: "#120a06",
      emptyCellPattern: "radial-gradient(#4a3222 1px, transparent 1px)",
      legendBg: "#150d08",
      legendBorder: "#3a2517",
      accent: "#d97706",
      labTagBg: "rgba(217, 119, 6, 0.2)",
      labTagText: "#fcd34d",
      labTagBorder: "rgba(217, 119, 6, 0.45)"
    },
    subjectColors: [
      { bg: "#3d2212", text: "#fde68a", border: "#d97706" },
      { bg: "#4a1c1a", text: "#fca5a5", border: "#ef4444" },
      { bg: "#1f382a", text: "#86efac", border: "#22c55e" },
      { bg: "#232e42", text: "#93c5fd", border: "#3b82f6" },
      { bg: "#361b3b", text: "#f0abfc", border: "#d946ef" },
      { bg: "#422e11", text: "#fed7aa", border: "#f59e0b" },
      { bg: "#153d3d", text: "#99f6e4", border: "#14b8a6" },
      { bg: "#312347", text: "#d8b4fe", border: "#a855f7" }
    ]
  },
  {
    id: "deep-nebula",
    name: "Cosmic Nebula",
    category: "dark",
    description: "Starry celestial obsidian, deep space violet, and vibrant interstellar starlight",
    preview: ["#070514", "#8b5cf6", "#06b6d4"],
    styles: {
      bg: "linear-gradient(135deg, #04020c 0%, #0d0826 50%, #150933 100%)",
      cardBg: "#0e0924",
      cardBorder: "#2a1b54",
      cardShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(139, 92, 246, 0.25)",
      headerBg: "linear-gradient(135deg, #09031c 0%, #1e0d45 50%, #311068 100%)",
      headerText: "#faf5ff",
      deptText: "#c084fc",
      badgeBg: "rgba(192, 132, 252, 0.15)",
      badgeText: "#f3e8ff",
      badgeBorder: "rgba(192, 132, 252, 0.35)",
      tableBorder: "#231647",
      headCellBg: "#09041a",
      headCellText: "#c084fc",
      timeText: "#38bdf8",
      cellBg: "#120c2e",
      cellText: "#f3e8ff",
      subText: "#b8a9d9",
      emptyCellBg: "#070314",
      emptyCellPattern: "radial-gradient(#2a1b54 1px, transparent 1px)",
      legendBg: "#09041a",
      legendBorder: "#231647",
      accent: "#a855f7",
      labTagBg: "rgba(56, 189, 248, 0.2)",
      labTagText: "#38bdf8",
      labTagBorder: "rgba(56, 189, 248, 0.45)"
    },
    subjectColors: [
      { bg: "#28124d", text: "#d8b4fe", border: "#a855f7" },
      { bg: "#0d2b45", text: "#7dd3fc", border: "#0284c7" },
      { bg: "#3b1138", text: "#f472b6", border: "#ec4899" },
      { bg: "#083b32", text: "#6ee7b7", border: "#10b981" },
      { bg: "#3b2609", text: "#fde047", border: "#eab308" },
      { bg: "#161b4a", text: "#a5b4fc", border: "#6366f1" },
      { bg: "#42151c", text: "#fb7185", border: "#f43f5e" },
      { bg: "#0a3542", text: "#5eead4", border: "#06b6d4" }
    ]
  }
];

function getTheme(themeId) {
  return THEMES.find(t => t.id === themeId) || THEMES[0];
}

/**
 * Assigns deterministic distinct subject color badges
 */
function getSubjectColorMap(schedule, facultyList, theme) {
  const subjectSet = new Set();
  
  if (schedule && Array.isArray(schedule)) {
    schedule.forEach(day => {
      if (day.classes && Array.isArray(day.classes)) {
        day.classes.forEach(c => {
          const sub = c.subject || c.details?.subject;
          if (sub && typeof sub === 'string' && sub.trim()) {
            subjectSet.add(sub.trim());
          }
        });
      }
    });
  }

  if (facultyList && Array.isArray(facultyList)) {
    facultyList.forEach(f => {
      if (f.subject && typeof f.subject === 'string' && f.subject.trim()) {
        subjectSet.add(f.subject.trim());
      }
    });
  }

  const subjects = Array.from(subjectSet);
  const colorMap = {};
  const palette = theme.subjectColors || THEMES[0].subjectColors;

  subjects.forEach((sub, idx) => {
    colorMap[sub] = palette[idx % palette.length];
  });

  return colorMap;
}

// Global browser exports
window.THEMES = THEMES;
window.getTheme = getTheme;
window.getSubjectColorMap = getSubjectColorMap;
