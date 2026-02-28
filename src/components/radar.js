/**
 * Radar.js
 * ─────────────────────────────────────────────────────────
 * Radar chart แสดงกิจกรรม 7 วัน (M T W T F S S)
 * วาด: วงกลม background, spokes, polygon activity, sweep line, day labels
 */
const anim = require("../theme/animations");

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const CX = 1100, CY = 88;
const R  = 60;        // radius polygon
const RO = 76;        // radius outer ring
const RINGS = [R * 0.33, R * 0.66, R]; // 3 ring levels

const Radar = (weekActivity) => {
  const max = Math.max(...weekActivity, 1);

  // ── คำนวณตำแหน่ง 7 จุด ──
  const pts = weekActivity.map((val, i) => {
    const angle = (Math.PI * 2 * i) / 7 - Math.PI / 2;
    const dist  = (val / max) * R;
    return { x: CX + Math.cos(angle) * dist, y: CY + Math.sin(angle) * dist, angle };
  });
  const polygon = pts.map(p => `${p.x},${p.y}`).join(" ");

  // ── Spoke endpoints (outer edge) ──
  const spokes = DAYS.map((_, i) => {
    const angle = (Math.PI * 2 * i) / 7 - Math.PI / 2;
    const ex = CX + Math.cos(angle) * R;
    const ey = CY + Math.sin(angle) * R;
    return `<line x1="${CX}" y1="${CY}" x2="${ex}" y2="${ey}" stroke="#00E5FF" stroke-width="0.5" opacity="0.2"/>`;
  }).join("\n    ");

  // ── Ring circles ──
  const rings = RINGS.map(r =>
    `<circle cx="${CX}" cy="${CY}" r="${r}" fill="none" stroke="#00E5FF" stroke-width="0.5" opacity="0.2"/>`
  ).join("\n    ");

  // ── Day labels (slightly outside outer ring) ──
  const labels = DAYS.map((d, i) => {
    const angle = (Math.PI * 2 * i) / 7 - Math.PI / 2;
    const lx = CX + Math.cos(angle) * (RO + 10);
    const ly = CY + Math.sin(angle) * (RO + 10) + 3;
    return `<text x="${lx}" y="${ly}" font-family="monospace" font-size="7" fill="#80DEEA" text-anchor="middle">${d}</text>`;
  }).join("\n    ");

  // ── Sweep animation ──
  const sweep = anim.rotate("0", "360", CX, CY, 4);

  return `
<!-- ══ RADAR ══ -->
<circle cx="${CX}" cy="${CY}" r="${RO}" fill="black" opacity="0.65"/>
<circle cx="${CX}" cy="${CY}" r="${RO}" fill="none" stroke="#00E5FF" stroke-width="1" opacity="0.5"/>
${rings}
${spokes}
<polygon points="${polygon}" fill="#00E5FF" opacity="0.2" stroke="#00E5FF" stroke-width="1.5"/>
${labels}
<line x1="${CX}" y1="${CY}" x2="${CX}" y2="${CY - R}" stroke="#00E5FF" stroke-width="1.5" opacity="0.7">
  ${sweep}
</line>
<text x="${CX}" y="${CY + RO + 12}" font-family="monospace" font-size="8" fill="#80DEEA" text-anchor="middle">COMMIT RADAR</text>`;
};

module.exports = Radar;
