/**
 * island.js
 * ─────────────────────────────────────────────────────────
 * เกาะ, ต้นมะพร้าว, landmarks, coral reef heatmap
 */
const anim = require("../theme/animations");

// Coral reef heatmap color scale
const CORAL_COLORS = {
  0:  { color: "#1A2A3A", opacity: 0.4,  w: 13, shine: false }, // empty
  1:  { color: "#00897B", opacity: 0.6,  w: 13, shine: false },
  2:  { color: "#00ACC1", opacity: 0.7,  w: 16, shine: false },
  3:  { color: "#0288D1", opacity: 0.8,  w: 16, shine: false },
  4:  { color: "#FF7043", opacity: 0.9,  w: 18, shine: true  },
  5:  { color: "#AB47BC", opacity: 0.95, w: 18, shine: true  },
  7:  { color: "#FFD700", opacity: 0.95, w: 18, shine: true  },
};

/**
 * แปลง heatmap data → coral bar SVG
 * @param {number[]} heatmap - 52 ค่า (สัปดาห์ต่อวัน)
 */
const CoralReef = (heatmap) => {
  const FLOOR_Y = 148;
  const MAX_H   = 114;
  const COL_W   = 22;
  const maxVal  = Math.max(...heatmap, 1);

  return heatmap.slice(0, 52).map((val, i) => {
    const x    = 10 + i * COL_W;
    const tier = val === 0 ? 0 : val <= 1 ? 1 : val <= 2 ? 2 : val <= 3 ? 3 : val <= 4 ? 4 : val <= 6 ? 5 : 7;
    const cfg  = CORAL_COLORS[tier];
    const h    = val === 0 ? 6 : Math.max(6, Math.floor((val / maxVal) * MAX_H));
    const y    = FLOOR_Y - h;

    return `
<g>
  <rect x="${x}" y="${y}" width="${cfg.w}" height="${h}" fill="${cfg.color}" opacity="${cfg.opacity}" rx="2"/>
  ${cfg.shine ? `<rect x="${x + 2}" y="${y}" width="${cfg.w - 4}" height="3" fill="white" opacity="0.15" rx="1"/>` : ""}
</g>`;
  }).join("");
};

/**
 * Legend bar สำหรับ commit count
 */
const CoralLegend = () => {
  const items = [
    { color: "#00897B", label: "1+" },
    { color: "#00ACC1", label: "2+" },
    { color: "#0288D1", label: "3+" },
    { color: "#FF7043", label: "4+" },
    { color: "#AB47BC", label: "5+" },
  ];
  return items.map((it, i) => `
<rect x="${10 + i * 24}" y="165" width="18" height="8" fill="${it.color}" opacity="0.8" rx="2"/>
<text x="${19 + i * 24}" y="180" font-family="monospace" font-size="7" fill="#80DEEA" text-anchor="middle">${it.label}</text>`
  ).join("");
};

/**
 * เกาะ + ต้นมะพร้าว
 */
const Island = (unlocked, nextLandmark) => {
  // ── Landmark emoji ──
  const landmarkEmojis = [
    { emoji: "🏖️", x: 940, y: 130 },
    { emoji: "🗼", x: 980, y: 100 },
    { emoji: "🏘️", x: 910, y: 105 },
    { emoji: "❓",  x: 960, y: 82,  dim: true },
    { emoji: "❓",  x: 930, y: 88,  dim: true },
    { emoji: "❓",  x: 975, y: 115, dim: true },
    { emoji: "❓",  x: 920, y: 120, dim: true },
    { emoji: "❓",  x: 955, y: 130, dim: true },
    { emoji: "❓",  x: 940, y: 72,  dim: true },
  ];

  const landmarks = landmarkEmojis.map(({ emoji, x, y, dim }) => {
    const opacity = dim ? 0.15 : 1;
    return `<text x="${x}" y="${y}" font-size="16" opacity="${opacity}" text-anchor="middle">${emoji}</text>`;
  }).join("\n  ");

  return `
<!-- Sand base -->
<ellipse cx="948" cy="148" rx="51.94" ry="12.985" fill="#F9A825" opacity="0.7"/>
<!-- Island body -->
<ellipse cx="948" cy="138" rx="40.81" ry="18.55" fill="url(#islandG)"/>

<!-- Mountains -->
<rect x="930" y="107.58" width="8" height="18.55" fill="#795548" rx="2"/>
<rect x="940" y="100.58" width="6" height="20.4"  fill="#6D4C41" rx="2"/>
<rect x="950" y="110.58" width="7" height="16.7"  fill="#795548" rx="2"/>
<!-- Snow caps -->
<rect x="930" y="106.58" width="8" height="5" fill="white" opacity="0.6" rx="2"/>
<rect x="940" y="98.58"  width="6" height="5" fill="white" opacity="0.7" rx="2"/>

<!-- Palm tree L -->
<rect x="908" y="112" width="3" height="22" fill="#5D4037" rx="1"/>
<path d="M 895 113 Q 910 100 925 112" fill="none" stroke="#2E7D32" stroke-width="4" stroke-linecap="round"/>
<path d="M 905 108 Q 910 98 920 107"  fill="none" stroke="#388E3C" stroke-width="3" stroke-linecap="round"/>
<!-- Palm tree R -->
<rect x="985" y="116" width="3" height="18" fill="#5D4037" rx="1"/>
<path d="M 972 117 Q 987 104 1000 116" fill="none" stroke="#2E7D32" stroke-width="4" stroke-linecap="round"/>

<!-- Landmarks -->
${landmarks}

<!-- Island name -->
<text x="948" y="155" font-family="monospace" font-size="9" fill="#FFF9C4" text-anchor="middle" opacity="0.8">HOSHI ISLAND</text>`;
};

module.exports = { CoralReef, CoralLegend, Island };
