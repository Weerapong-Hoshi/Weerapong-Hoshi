/**
 * animations.js
 * ─────────────────────────────────────────────────────────
 * Factory functions สำหรับสร้าง SVG SMIL Animation snippets
 * ทุก animation อยู่ที่นี่ที่เดียว — SVG ไม่ hardcode animation เองอีกต่อไป
 */

const anim = {
  /**
   * หมุน element รอบจุด (cx, cy)
   * ใช้กับ: radar sweep line, sun pulse
   */
  rotate: (from, to, cx, cy, dur) =>
    `<animateTransform attributeName="transform" type="rotate"
      from="${from} ${cx} ${cy}" to="${to} ${cx} ${cy}"
      dur="${dur}s" repeatCount="indefinite"/>`,

  /**
   * เปลี่ยนค่า attribute แบบ keyframe loop
   * ใช้กับ: r (pulse), opacity (fade), height (spout), d (wave path)
   */
  pulse: (attr, values, dur, begin = 0, fill = "none") =>
    `<animate attributeName="${attr}" values="${values}"
      dur="${dur}s" begin="${begin}s" repeatCount="indefinite" fill="${fill}"/>`,

  /**
   * เปลี่ยน width จาก 0 → target ครั้งเดียว (fill: freeze)
   * ใช้กับ: XP bar, Boss HP bar, progress bar
   */
  fillWidth: (target, dur = 1.5) =>
    `<animate attributeName="width" values="0;${target}" dur="${dur}s" fill="freeze"/>`,

  /**
   * เคลื่อนที่ตาม path (animateMotion)
   * ใช้กับ: ปลาว่าย, ฟองอากาศ, ปลาเล็ก
   */
  motion: (path, dur, begin = 0) =>
    `<animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${path}"/>`,

  /**
   * เคลื่อนที่ตาม <mpath href="..."> (สำหรับ Whale)
   * ใช้กับ: Whale ที่ว่ายตาม swimPath
   */
  mpathMotion: (href, dur) =>
    `<animateMotion dur="${dur}s" repeatCount="indefinite">
      <mpath href="${href}"/>
    </animateMotion>`,

  /**
   * Wave path animation — สำหรับคลื่นทะเล (d attribute)
   */
  wave: (pathA, pathB, dur, begin = 0) =>
    `<animate attributeName="d"
      values="${pathA};${pathB};${pathA}"
      dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>`,
};

module.exports = anim;
