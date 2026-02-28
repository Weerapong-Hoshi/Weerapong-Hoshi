const SkillWhale = (skill, base64Data, index) => {
  const { name, rank, xp, color } = skill;

  // ระยะห่างความลึก
  const depthY = 110 + index * 140;
  const sonarW = (xp / 100) * 200;

  return `
    <g transform="translate(110, ${depthY})">
      <!-- 1. Aura & Sonar -->
      <circle r="40" fill="${color}" opacity="0.12">
        <animate attributeName="r" values="40;55;40" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="4s" repeatCount="indefinite"/>
      </circle>

      <!-- 2. The Pixel Art Whale (ว่ายท่าปกติ - อยู่กับที่) -->
      <g>
        <!-- อนิเมชั่น ลอยตัวขึ้นลงนุ่มนวล -->
        <animateTransform attributeName="transform" type="translate" values="0,0; 5,-3; 0,0" dur="4s" repeatCount="indefinite"/>
        
        <g transform="scale(1.1)">
          <!-- Tail with Wag Animation (หางสะบัด) -->
          <g>
            <rect x="-14" y="9"  width="12" height="6" fill="${color}" opacity="0.8" rx="1"/>
            <rect x="-16" y="6"  width="8"  height="5" fill="${color}" opacity="0.6" rx="1"/>
            <animateTransform attributeName="transform" type="rotate" values="0 0 12; 10 0 12; 0 0 12; -10 0 12; 0 0 12" dur="1.5s" repeatCount="indefinite"/>
          </g>

          <!-- Body -->
          <rect x="-2"  y="4"  width="32" height="16" fill="${color}" rx="3"/>
          <rect x="2"   y="14" width="22" height="4"  fill="white" opacity="0.3" rx="2"/>
          <rect x="30"  y="6"  width="12" height="12" fill="${color}" rx="3"/>
          <circle cx="37"   cy="11" r="3"   fill="white"/>
          <circle cx="37.5" cy="11" r="1.4" fill="#01579B"/>
          <rect x="14" y="1"  width="4" height="7" fill="${color}" opacity="0.7" rx="1"/>
          <rect x="8"  y="19" width="12" height="4" fill="${color}" opacity="0.9" rx="2"/>
        </g>
      </g>

      <!-- 3. Icon Bubble (ย้ายมาวางตำแหน่งที่เหมาะสม) -->
      <g transform="translate(-75, 0)">
        <circle r="26" fill="#000" opacity="0.6" stroke="${color}" stroke-width="2"/>
        <image x="-16" y="-16" width="32" height="32" href="${base64Data}" />
      </g>

      <!-- 4. Stats & Progress Bar -->
      <g transform="translate(60, -25)">
        <text font-family="monospace" font-size="18" font-weight="bold" fill="white" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5)">${name}</text>
        <text y="18" font-family="monospace" font-size="10" fill="${color}" font-weight="bold" opacity="0.8">${rank}</text>
        
        <g transform="translate(0, 35)">
          <rect width="200" height="7" fill="white" opacity="0.1" rx="3"/>
          <rect width="${sonarW}" height="7" fill="${color}" rx="3">
            <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite"/>
          </rect>
          <text x="210" y="8" font-family="monospace" font-size="9" fill="white" opacity="0.6">${xp}%</text>
        </g>
      </g>

      <!-- Bubbles (ฟองอากาศลอยขึ้นจากหัววาฬ) -->
      <circle r="1.5" fill="white" opacity="0">
        <animateMotion dur="3s" repeatCount="indefinite" path="M 35 0 Q 40 -40 30 -100"/>
        <animate attributeName="opacity" values="0;0.5;0" dur="3s" repeatCount="indefinite"/>
      </circle>
    </g>
  `;
};

module.exports = SkillWhale;
