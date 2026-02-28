/**
 * waves.js
 * ─────────────────────────────────────────────────────────
 * คลื่นทะเลหลายชั้น — แยกออกมาจาก ocean-sea.js
 */
const anim = require("../theme/animations");

/**
 * สร้างคลื่น 3 ชั้น + foam crest
 * @param {string} waveColor  - สี wave หลัก
 * @param {string} deepColor  - สี wave ด้านล่าง
 */
const Waves = (waveColor, deepColor) => {
  // ── Wave paths ──
  const W1A = "M0,38 C200,22 400,54 600,38 C800,22 1000,54 1200,38 L1200,280 L0,280 Z";
  const W1B = "M0,48 C200,64 400,32 600,48 C800,64 1000,32 1200,48 L1200,280 L0,280 Z";

  const W2A = "M0,55 C150,42 350,68 550,55 C750,42 950,68 1200,55 L1200,280 L0,280 Z";
  const W2B = "M0,62 C150,76 350,50 550,62 C750,76 950,50 1200,62 L1200,280 L0,280 Z";

  const FA  = "M0,55 C150,42 350,68 550,55 C750,42 950,68 1200,55 L1200,64 C950,77 750,53 550,64 C350,77 150,53 0,64 Z";
  const FB  = "M0,62 C150,76 350,50 550,62 C750,76 950,50 1200,62 L1200,71 C950,58 750,82 550,71 C350,58 150,82 0,71 Z";

  const D1A = "M0,72 C100,64 300,80 500,72 C700,64 900,80 1200,72 L1200,280 L0,280 Z";
  const D1B = "M0,78 C100,86 300,70 500,78 C700,86 900,70 1200,78 L1200,280 L0,280 Z";

  return `
<!-- Wave layer 1 -->
<path fill="${waveColor}" opacity="0.5" d="${W1A}">
  ${anim.wave(W1A, W1B, 4.5)}
</path>
<!-- Wave layer 2 -->
<path fill="${waveColor}" opacity="0.65" d="${W2A}">
  ${anim.wave(W2A, W2B, 3.2)}
</path>
<!-- Foam crest -->
<path fill="#E3F2FD" opacity="0.18" d="${FA}">
  ${anim.wave(FA, FB, 3.2)}
</path>
<!-- Deep surface -->
<path fill="${deepColor}" opacity="0.8" d="${D1A}">
  ${anim.wave(D1A, D1B, 2.8)}
</path>`;
};

module.exports = Waves;
