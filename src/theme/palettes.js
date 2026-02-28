/**
 * palettes.js
 * ─────────────────────────────────────────────────────────
 * Color palette ทุกอย่างอยู่ที่นี่ แก้สีที่นี่ที่เดียว
 */

const SKY = {
  midnight: { g1: "#000005", g2: "#020B18", horizon: "#071E32" },
  dawn:     { g1: "#0D0B2A", g2: "#6B2D6B", horizon: "#F4A460" },
  day:      { g1: "#0A2472", g2: "#1565C0", horizon: "#42A5F5" },
  dusk:     { g1: "#1A0533", g2: "#7B1FA2", horizon: "#FF8A65" },
  evening:  { g1: "#0D0221", g2: "#1A0B3B", horizon: "#1A237E" },
};

const SEA = {
  midnight: { top: "#01021A", mid: "#020B2B", bot: "#030D35", wave: "#020B2B" },
  day:      { top: "#0D47A1", mid: "#1565C0", bot: "#1976D2", wave: "#1565C0" },
  dusk:     { top: "#1A0533", mid: "#2E1065", bot: "#1565C0", wave: "#2E1065" },
};

const UI = {
  cyan:       "#00E5FF",
  magenta:    "#FF00FF",
  cyanDark:   "#80DEEA",
  teal:       "#00BFA5",
  panelBg:    "#000D1A",
  panelBg2:   "#001F3F",
  xpStart:    "#00E5FF",
  xpMid:      "#00BFA5",
  xpEnd:      "#FF00FF",
  bossStroke: "#FF1744",
  bossBar:    "#FF7043",
  bossText:   "#EF9A9A",
};

const RANK_COLORS = {
  "SS": "#FF6F00",
  "S+": "#FFD700",
  "S":  "#FFA000",
  "A":  "#E040FB",
  "B":  "#00E5FF",
  "C":  "#69F0AE",
  "D":  "#78909C",
};

module.exports = {
  getSkyPalette: (phase) => SKY[phase] || SKY.day,
  getSeaPalette: (phase) => SEA[phase] || SEA.day,
  UI,
  RANK_COLORS,
};
