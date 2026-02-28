const AquariumElements = {
  // ปลา Pixel Art ที่มีดีเทล (ตา, ครีบ, หาง)
  renderDetailedFish: (id, x, y, color, disappearTime) => `
    <g id="fish-${id}" transform="translate(${x}, ${y})">
      <!-- ตัวปลา -->
      <rect x="-4" y="-2" width="8" height="4" fill="${color}" rx="1"/>
      <!-- หาง -->
      <path d="M -4 0 L -7 -3 L -7 3 Z" fill="${color}"/>
      <!-- ครีบ -->
      <rect x="-1" y="-3" width="2" height="1" fill="${color}" opacity="0.7"/>
      <!-- ตา -->
      <circle cx="2" cy="-1" r="0.8" fill="white"/>
      
      <!-- อนิเมชั่นว่ายน้ำเบาๆ -->
      <animateTransform attributeName="transform" type="translate" values="0,0; 0,-3; 0,0" dur="2s" begin="${id * 0.2}s" repeatCount="indefinite" additive="sum"/>
      
      <!-- Logic การโดนกิน: ปลาจะหายไปเมื่อถึงเวลาที่วาฬว่ายมาทับ -->
      <set attributeName="opacity" to="0" begin="${disappearTime}s" />
      <set attributeName="opacity" to="1" begin="${disappearTime + 5}s" /> <!-- ให้ปลากลับมาใหม่ทุก Loop -->
    </g>
  `,

  // ปะการังที่มีความหยักแบบ Pixel
  renderDetailedCoral: (x, y, color) => `
    <g transform="translate(${x}, ${y})">
      <rect x="0" y="-15" width="4" height="15" fill="${color}" rx="1"/>
      <rect x="-5" y="-10" width="6" height="4" fill="${color}" rx="1"/>
      <rect x="3" y="-18" width="4" height="6" fill="${color}" rx="1"/>
      <rect x="-2" y="-22" width="3" height="8" fill="${color}" rx="1" opacity="0.8"/>
      <animateTransform attributeName="transform" type="rotate" values="-2 0 0; 2 0 0; -2 0 0" dur="4s" repeatCount="indefinite" additive="sum"/>
    </g>
  `,

  // หินที่มีแสงเงา (Shading)
  renderDetailedRock: (x, y, width) => `
    <g transform="translate(${x}, ${y})">
      <rect width="${width}" height="12" fill="#455A64" rx="3"/>
      <rect width="${width - 4}" height="4" x="2" y="2" fill="#90A4AE" opacity="0.3" rx="1"/>
    </g>
  `,
};

module.exports = AquariumElements;
