/**
 * Whale.js
 * ─────────────────────────────────────────────────────────
 * สร้าง SVG ปลาวาฬ pixel art พร้อม animation
 * scale ตาม evolution stage, ว่ายตาม swimPath
 */
const anim = require("../theme/animations");

const SCALE = {
  baby:         0.7,
  adult:        1.0,
  stormbringer: 1.3,
  legendary:    1.6,
  cosmic:       2.0,
};

const Whale = (stage, speed) => {
  const sc = SCALE[stage] || 1.0;

  // Spout animation — 3 attributes แยกกัน
  const spoutHeight  = anim.pulse("height",  "12;18;12",       2.2);
  const spoutY       = anim.pulse("y",       "-8;-14;-8",      2.2);
  const spoutOpacity = anim.pulse("opacity", "0.75;0.2;0.75",  2.2);

  // ว่ายตาม swimPath
  const swim = anim.mpathMotion("#swimPath", speed);

  return `
<g transform="scale(${sc})">
  <!-- Tail -->
  <rect x="-14" y="9"  width="12" height="6"  fill="#0277BD" rx="1"/>
  <rect x="-16" y="6"  width="8"  height="5"  fill="#0288D1" rx="1"/>
  <!-- Body -->
  <rect x="-2"  y="4"  width="32" height="16" fill="#00B0FF" rx="3"/>
  <!-- Belly -->
  <rect x="2"   y="14" width="22" height="4"  fill="#B3E5FC" rx="2"/>
  <!-- Head -->
  <rect x="30"  y="6"  width="12" height="12" fill="#00B0FF" rx="3"/>
  <!-- Blowhole -->
  <rect x="32"  y="4"  width="5"  height="3"  fill="#0288D1" rx="1"/>
  <!-- Spout -->
  <rect x="33" y="-8" width="3" height="12" fill="#B3E5FC" opacity="0.75">
    ${spoutHeight}
    ${spoutY}
    ${spoutOpacity}
  </rect>
  <!-- Eye -->
  <circle cx="37"   cy="11" r="3"   fill="white"/>
  <circle cx="37.5" cy="11" r="1.4" fill="#01579B"/>
  <!-- Dorsal fin -->
  <rect x="14" y="1"  width="4" height="7" fill="#0288D1" rx="1"/>
  <rect x="15" y="-1" width="3" height="4" fill="#0288D1" rx="1"/>
  <!-- Pectoral fin -->
  <rect x="8" y="19" width="12" height="4" fill="#0277BD" rx="2"/>
  ${swim}
</g>`;
};

module.exports = Whale;
