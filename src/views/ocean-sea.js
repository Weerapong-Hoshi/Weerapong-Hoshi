/**
 * generators/ocean-sea.js
 * ─────────────────────────────────────────────────────────
 * SVG ชั้น Sea (280px) — ทะเล, คลื่น, ปลาวาฬ, Radar, HUD panel
 *
 * โครงสร้าง:
 *   [Water gradient BG]
 *   [Waves 3 layers + foam]
 *   [Bubbles + Fish creatures]
 *   [Whale]
 *   [Radar]
 *   [HUD Panel + stats text + XP bar]
 */
const anim = require("../theme/animations");
const { getSeaPalette, UI } = require("../theme/palettes");
const Whale = require("../components/whale");
const Radar = require("../components/radar");
const Waves = require("../components/waves");
const { Bubbles, Fish } = require("../components/creatures");
const { HudPanel, XpBar, RankBadge } = require("../components/ui");

const renderSea = (stats, phase) => {
  const sea = getSeaPalette(phase);

  // XP calculation
  const XP_PER_LEVEL = 100;
  const xpMax = XP_PER_LEVEL;
  const xpPct = stats.xp / xpMax;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 1200 280" width="1200" height="280" shape-rendering="crispEdges">
  <defs>
    <!-- Water gradient -->
    <linearGradient id="waterG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${sea.top}"/>
      <stop offset="50%"  stop-color="${sea.mid}"/>
      <stop offset="100%" stop-color="${sea.bot}"/>
    </linearGradient>
    <!-- XP bar gradient -->
    <linearGradient id="xpG" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${UI.xpStart}"/>
      <stop offset="50%"  stop-color="${UI.xpMid}"/>
      <stop offset="100%" stop-color="${UI.xpEnd}"/>
    </linearGradient>
    <!-- HUD panel gradient -->
    <linearGradient id="panG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${UI.panelBg}"  stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${UI.panelBg2}" stop-opacity="0.8"/>
    </linearGradient>
    <!-- Whale swim path -->
    <path id="swimPath" d="M -350 0 C -50 -55 350 55 600 0 C 850 -55 1150 40 1550 -15" fill="none"/>
  </defs>

  <!-- OCEAN BODY -->
  <rect width="1200" height="280" fill="url(#waterG)"/>

  <!-- WAVES -->
  ${Waves(sea.wave, sea.top)}

  <!-- BUBBLES + FISH -->
  ${Bubbles()}
  ${Fish()}

  <!-- WHALE -->
  <g transform="translate(0,45)">
    ${Whale(stats.whaleStage, 14)}
  </g>

  <!-- RADAR -->
  ${Radar(stats.weekActivity)}

  <!-- HUD PANEL -->
  ${HudPanel(18, 14, 720, 130)}

  <!-- Stats Text -->
  <text x="38"  y="38" font-family="monospace" font-size="22" font-weight="bold" fill="${UI.cyan}" letter-spacing="2">LV ${stats.level}</text>
  <text x="120" y="38" font-family="monospace" font-size="13" fill="${UI.cyanDark}" letter-spacing="1">TOTAL ${stats.total} COMMITS</text>
  <text x="420" y="38" font-family="monospace" font-size="13" fill="${UI.cyanDark}">TODAY +${stats.today}</text>

  <text x="38" y="62" font-family="monospace" font-size="16" fill="${UI.magenta}" letter-spacing="1">STREAK ${stats.streak}d ${stats.flags.combo}</text>
  ${RankBadge(294, 62, stats.rank, stats.rankColor)}
  <text x="342" y="62" font-family="monospace" font-size="13" fill="#69F0AE">RANK</text>

  <!-- Whale stage badge -->
  <text x="450" y="62" font-family="monospace" font-size="11" fill="${UI.cyan}" letter-spacing="1">🐋 ${stats.whaleStage.toUpperCase()}</text>

  <!-- Status message -->
  <text x="38" y="98" font-family="monospace" font-size="12" fill="${UI.cyanDark}" letter-spacing="1">
    ${stats.flags.godMode ? "⚡ GOD MODE ACTIVATED" : stats.flags.stormMode ? "🌪️ STORM MODE" : "🌊 RIDING THE WAVE"}
  </text>

  <!-- XP Bar -->
  ${XpBar(38, 122, 500, 9, xpPct, stats.xp, xpMax)}

</svg>`;
};

module.exports = { renderSea };
