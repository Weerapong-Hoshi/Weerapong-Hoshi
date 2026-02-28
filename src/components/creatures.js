/**
 * creatures.js
 * ─────────────────────────────────────────────────────────
 * ฟองอากาศ (bubbles) และปลาเล็ก (fish) ที่ว่ายในทะเล
 * แยกออกมาจาก ocean-sea.js เพื่อให้แก้ได้ง่าย
 */
const anim = require("../theme/animations");

// ── Config ──
const BUBBLE_CONFIG = {
  count:    18,
  spacing:  66,      // px ระหว่างแต่ละ bubble
  startX:   30,
  baseY:    265,
  sizes:    [1.5, 2.3, 3.1, 3.9, 4.7], // วนซ้ำ
  baseDur:  2.8,
  durStep:  0.35,
  delayStep: 0.45,
};

const FISH_CONFIG = [
  { rx: 5.4, ry: 2.1,  color: "#FFD54F", dur: 7.0,  begin: 0.0, yOffset: 155 },
  { rx: 7.2, ry: 2.8,  color: "#80DEEA", dur: 8.1,  begin: 0.9, yOffset: 167 },
  { rx: 9.0, ry: 3.5,  color: "#F48FB1", dur: 9.2,  begin: 1.8, yOffset: 179 },
  { rx: 10.8,ry: 4.2,  color: "#A5D6A7", dur: 10.3, begin: 2.7, yOffset: 191 },
  { rx: 5.4, ry: 2.1,  color: "#CE93D8", dur: 11.4, begin: 3.6, yOffset: 203 },
  { rx: 7.2, ry: 2.8,  color: "#FFCC80", dur: 12.5, begin: 4.5, yOffset: 215 },
  { rx: 9.0, ry: 3.5,  color: "#EF9A9A", dur: 13.6, begin: 5.4, yOffset: 227 },
  { rx: 10.8,ry: 4.2,  color: "#FFD54F", dur: 14.7, begin: 6.3, yOffset: 239 },
];

/**
 * สร้าง bubble (ฟองอากาศ) ที่ลอยขึ้นจากพื้นทะเล
 */
const Bubbles = () => {
  const { count, spacing, startX, baseY, sizes, baseDur, durStep, delayStep } = BUBBLE_CONFIG;

  return Array.from({ length: count }, (_, i) => {
    const cx    = startX + i * spacing;
    const r     = sizes[i % sizes.length];
    const dur   = baseDur + i * durStep;
    const begin = i * delayStep;
    const rise  = 40 + (i % 5) * 4;   // ความสูงที่ลอยขึ้น (ต่างกันนิดหน่อย)
    const drift = r * 4;               // drift ซ้าย/ขวา

    const path = `M 0 0 Q ${drift} -${rise + 15} ${r * 0.5} -${rise * 2 + 10}`;

    return `
<circle cx="${cx}" cy="${baseY}" r="${r}" fill="none" stroke="#80DEEA" stroke-width="0.8" opacity="0.4">
  ${anim.motion(path, dur, begin)}
  ${anim.pulse("opacity", "0.4;0.08;0", dur, begin)}
  ${anim.pulse("r", `${r};${r * 0.6};0.1`, dur, begin)}
</circle>`;
  }).join("");
};

/**
 * สร้างปลาเล็กที่ว่ายข้ามจอ (ellipse เคลื่อนที่)
 */
const Fish = () => {
  return FISH_CONFIG.map(({ rx, ry, color, dur, begin, yOffset }) => {
    const y0 = yOffset;
    const path = `M 1420 ${y0} C 1000 ${y0 - 25} 600 ${y0 + 20} 200 ${y0 - 12} C 0 ${y0} -200 ${y0 - 5} -250 ${y0}`;
    return `
<g opacity="0.85">
  <ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${color}">
    ${anim.motion(path, dur, begin)}
  </ellipse>
</g>`;
  }).join("");
};

module.exports = { Bubbles, Fish };
