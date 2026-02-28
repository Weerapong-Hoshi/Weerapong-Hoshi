/**
 * ui.js
 * ─────────────────────────────────────────────────────────
 * UI Components ทั้งหมด: HUD Panel, XP Bar, Progress Bar
 */
const anim = require("../theme/animations");
const { UI } = require("../theme/palettes");

const HudPanel = (x, y, w, h) => {
  const x2 = x + w;
  const x2m = x + w - 18;
  const y2 = y + h;
  const y2m = y + h - 18;
  return `
<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${UI.panelBg}" fill-opacity="0.9"
  rx="6" stroke="${UI.cyan}" stroke-width="1" stroke-opacity="0.55"/>
<!-- Corner marks: TL cyan, TR magenta, BL magenta, BR cyan -->
<rect x="${x}"   y="${y}"   width="18" height="2"  fill="${UI.cyan}"/>
<rect x="${x}"   y="${y}"   width="2"  height="18" fill="${UI.cyan}"/>
<rect x="${x2m}" y="${y}"   width="18" height="2"  fill="${UI.magenta}"/>
<rect x="${x2}"  y="${y}"   width="2"  height="18" fill="${UI.magenta}"/>
<rect x="${x}"   y="${y2}"  width="18" height="2"  fill="${UI.magenta}"/>
<rect x="${x}"   y="${y2m}" width="2"  height="18" fill="${UI.magenta}"/>
<rect x="${x2m}" y="${y2}"  width="18" height="2"  fill="${UI.cyan}"/>
<rect x="${x2}"  y="${y2m}" width="2"  height="18" fill="${UI.cyan}"/>`;
};

/**
 * XP Bar — animate width จาก 0
 */
const XpBar = (x, y, w, h, xpPct, xp, xpMax) => {
  const barW = Math.floor(w * xpPct);
  const fillAnim = anim.fillWidth(barW, 1.4);
  return `
<text x="${x}" y="${y - 4}" font-family="monospace" font-size="10" fill="#37474F">XP ${xp} / ${xpMax} TO NEXT LEVEL</text>
<rect x="${x}" y="${y}" width="${w}"    height="${h}" fill="#102027" rx="4"/>
<rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="url(#xpG)" rx="4">
  ${fillAnim}
</rect>
<rect x="${x}" y="${y}" width="${barW}" height="${Math.floor(h / 2)}" fill="white" opacity="0.1" rx="4"/>
<text x="${x + barW + 4}" y="${y + h}" font-family="monospace" font-size="9" fill="${UI.cyan}">${Math.round(xpPct * 100)}%</text>`;
};

/**
 * Progress Bar ทั่วไป — ใช้ใน map panel
 */
const ProgressBar = (x, y, w, h, current, max, color, dur = 1.6) => {
  const barW = Math.floor(w * Math.min(current / max, 1));
  const fillAnim = anim.fillWidth(barW, dur);
  return `
<rect x="${x}" y="${y}" width="${w}"    height="${h}" fill="#0D1B2A" rx="3"/>
<rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="${color}" rx="3">
  ${fillAnim}
</rect>
<text x="${x + w + 6}" y="${y + h}" font-family="monospace" font-size="9" fill="${color}">${current}/${max}</text>`;
};

/**
 * Rank Badge
 */
const RankBadge = (x, y, rank, rankColor) => `
<rect x="${x - 34}" y="${y - 16}" width="68" height="22" fill="${rankColor}" opacity="0.18" rx="3"/>
<text x="${x}" y="${y}" font-family="monospace" font-size="16" font-weight="bold"
  fill="${rankColor}" text-anchor="middle" letter-spacing="2">${rank}</text>`;

module.exports = { HudPanel, XpBar, ProgressBar, RankBadge };
