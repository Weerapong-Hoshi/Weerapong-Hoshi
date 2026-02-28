/**
 * generators/ocean-sky.js
 * ─────────────────────────────────────────────────────────
 * SVG ชั้น Sky (180px) — ท้องฟ้า, ดวงอาทิตย์, Boss HUD, เวลา
 * 
 * โครงสร้าง:
 *   [SKY gradient BG]
 *   [Sun + halo pulse]
 *   [Horizon glow]
 *   [Boss HUD panel]
 *   [Time display]
 */
const anim          = require("../theme/animations");
const { getSkyPalette, UI } = require("../theme/palettes");

const renderSky = (stats, phase, hour) => {
  const pal  = getSkyPalette(phase);
  const { boss } = stats;

  // ── Sun pulse animations ──
  const sunPulse  = anim.pulse("r", "32;35;32", 6);
  const haloPulse = anim.pulse("r", "48;58;48", 6);

  // ── Boss HP bar ──
  const bossBarW   = 265;
  const bossFilledW = Math.floor(bossBarW * (1 - boss.hpPct));
  const bossAnim   = anim.fillWidth(bossFilledW, 1.5);

  return `<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1200 180" width="1200" height="180" shape-rendering="crispEdges">
  <defs>
    <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${pal.g1}"/>
      <stop offset="55%"  stop-color="${pal.g2}"/>
      <stop offset="100%" stop-color="${pal.horizon}"/>
    </linearGradient>
    <filter id="glow2">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- SKY BG -->
  <rect width="1200" height="180" fill="url(#skyG)"/>

  <!-- Sun -->
  <circle cx="1050" cy="55" r="32" fill="#FFF176" opacity="0.95">
    ${sunPulse}
  </circle>
  <circle cx="1050" cy="55" r="48" fill="#FFF176" opacity="0.08">
    ${haloPulse}
  </circle>

  <!-- Horizon glow -->
  <rect y="160" width="1200" height="10" fill="${pal.horizon}" opacity="0.3"/>

  <!-- ══ BOSS HUD ══ -->
  <rect x="760" y="14" width="420" height="88"
    fill="black" opacity="0.72" rx="5"
    stroke="${UI.bossStroke}" stroke-width="1" stroke-opacity="0.8"/>
  <!-- Corner marks -->
  <rect x="760"  y="14"  width="14" height="2"  fill="${UI.bossStroke}"/>
  <rect x="760"  y="14"  width="2"  height="14" fill="${UI.bossStroke}"/>
  <rect x="1166" y="14"  width="14" height="2"  fill="${UI.bossStroke}"/>
  <rect x="1178" y="14"  width="2"  height="14" fill="${UI.bossStroke}"/>
  <rect x="760"  y="100" width="14" height="2"  fill="${UI.bossStroke}"/>
  <rect x="760"  y="88"  width="2"  height="14" fill="${UI.bossStroke}"/>

  <text x="776" y="34"  font-family="monospace" font-size="10" fill="#FF5252" letter-spacing="2">⚔ BOSS RAID TARGET</text>
  <text x="776" y="52"  font-family="monospace" font-size="16" font-weight="bold" fill="${UI.bossStroke}" letter-spacing="3">${boss.name}</text>
  <text x="776" y="67"  font-family="monospace" font-size="9"  fill="${UI.bossText}">MILESTONE: ${boss.milestone.prev} → ${boss.milestone.next} commits</text>

  <!-- Boss HP bar -->
  <rect x="776" y="74" width="${bossBarW}" height="10" fill="#1A0000" rx="3"/>
  <rect x="776" y="74" width="${bossFilledW}" height="10" fill="${UI.bossBar}" rx="3">
    ${bossAnim}
  </rect>
  <rect x="776" y="74" width="${bossFilledW}" height="5" fill="white" opacity="0.12" rx="3"/>
  <text x="776" y="98" font-family="monospace" font-size="9" fill="${UI.bossText}">${boss.hpLeft} HP REMAINING — COMMIT TO DEAL DAMAGE</text>

  <!-- Time display -->
  <text x="22" y="32" font-family="monospace" font-size="11" fill="${UI.cyan}" opacity="0.7" letter-spacing="1">
    ${phase.toUpperCase()} — UTC+7 — ${String(hour).padStart(2,"0")}:XX
  </text>
</svg>`;
};

module.exports = { renderSky };
