const decor = require("../components/aquarium-decor");

const renderBattleStats = (stats) => {
  const { total, streak, maxStreak } = stats;
  const whaleDur = 30; // 30 วินาทีต่อรอบ (สมูทมาก)
  const swimPath = "M 100,160 A 350,110 0 1,1 800,160 A 350,110 0 1,1 100,160";

  // ข้อมูลปลาเป้าหมาย: x,y คือจุดที่โดนกิน, eat คือวินาทีที่โดนกิน, path คือเส้นทางว่ายวนรอโดนกิน
  const fishData = [
    { x: 180, y: 80, eat: 4.2, path: "M 0,0 C 20,20 -20,40 0,0" },
    { x: 450, y: 55, eat: 7.5, path: "M 0,0 C -30,10 30,-10 0,0" },
    { x: 720, y: 80, eat: 10.8, path: "M 0,0 C 15,-20 -15,-20 0,0" },
    { x: 810, y: 165, eat: 15.0, path: "M 0,0 L -10,10 L 10,0 Z" },
    { x: 720, y: 250, eat: 19.2, path: "M 0,0 Q 20,0 0,20 Q -20,0 0,0" },
    { x: 450, y: 275, eat: 22.5, path: "M 0,0 L 15,5 L -15,5 Z" },
    { x: 180, y: 250, eat: 25.8, path: "M 0,0 C -20,-20 20,-20 0,0" },
    { x: 90, y: 165, eat: 29.5, path: "M 0,0 L 10,10 L -10,10 Z" },
  ];

  const fishes = fishData
    .slice(0, Math.max(streak, 1))
    .map((f, i) => {
      const colors = [
        "#FF5252",
        "#FFD700",
        "#69F0AE",
        "#40C4FF",
        "#FF4081",
        "#E040FB",
      ];
      return `
    <g transform="translate(${f.x}, ${f.y})">
      <g>
        <!-- ปลาว่ายวนสุ่มไปมา (ไม่หยุดนิ่ง) -->
        <animateMotion dur="3s" repeatCount="indefinite" path="${f.path}" />
        <g>
          <ellipse rx="7" ry="4" fill="${colors[i % 6]}"/>
          <path d="M -4 0 L -12 -6 L -12 6 Z" fill="${colors[i % 6]}"/>
          <circle cx="3" cy="-1.5" r="1.2" fill="white"/>
          <!-- หายไปทันทีเมื่อปากวาฬมาถึง -->
          <animate attributeName="opacity" values="1;1;0;0;1" 
            keyTimes="0; ${f.eat / whaleDur}; ${(f.eat + 0.05) / whaleDur}; 0.99; 1" 
            dur="${whaleDur}s" repeatCount="indefinite" />
        </g>
      </g>
    </g>`;
    })
    .join("");

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 450" width="900" height="450">
  <defs>
    <linearGradient id="deepGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#002D4D"/><stop offset="100%" stop-color="#000A14"/>
    </linearGradient>
    <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFE082"/><stop offset="100%" stop-color="#F9A825"/>
    </linearGradient>
    <path id="whalePath" d="${swimPath}" fill="none"/>
  </defs>

  <!-- Tank Background -->
  <rect width="900" height="450" fill="#000" rx="25"/>
  <rect x="10" y="10" width="880" height="430" fill="url(#deepGrad)" rx="20"/>

  <!-- 1. พื้นทรายแบบจัดเต็ม -->
  <rect y="350" width="900" height="100" fill="url(#sandGrad)"/>

  <!-- 2. ของตกแต่งแบบยัดแน่นล้นจอ (Density Max!) -->
  ${decor.renderAnchor(60, 365)}
  ${decor.renderBush(110, 370, "#2E7D32")}
  ${decor.renderStoneHead(190, 360)}
  ${decor.renderBarrel(270, 375)}
  ${decor.renderBush(320, 380, "#43A047")}
  ${decor.renderStoneHead(400, 355)}
  ${decor.renderChest(480, 370)}
  ${decor.renderBush(540, 375, "#9C27B0")}
  ${decor.renderBarrel(600, 370)}
  ${decor.renderStoneHead(680, 360)}
  ${decor.renderBush(750, 370, "#00838F")}
  ${decor.renderAnchor(810, 365)}
  ${decor.renderPineapple(860, 350)}
  
  <!-- ก้อนกรวดแบบสุ่ม -->
  ${Array.from({ length: 30 }, (_, i) => decor.renderRock((i * 31) % 900, 360 + ((i * 13) % 70))).join("")}

  <!-- 3. ฟองอากาศ -->
  ${[40, 140, 240, 340, 440, 540, 640, 740, 840]
    .map(
      (x, i) => `
    <circle cx="${x}" cy="450" r="${1 + (i % 2)}" fill="white" opacity="0.2">
      <animate attributeName="cy" values="450;-50" dur="${4 + (i % 3)}s" repeatCount="indefinite"/>
    </circle>`,
    )
    .join("")}

  <!-- 4. ฝูงปลา (Targets) -->
  ${fishes}

  <!-- 5. THE HUNTER (วาฬ Pixel Art สมบูรณ์แบบ) -->
  <g>
    <animateMotion dur="${whaleDur}s" repeatCount="indefinite" rotate="auto">
      <mpath href="#whalePath"/>
    </animateMotion>

    <g transform="scale(1.7) translate(-20,-10)">
      <!-- Tail -->
      <g>
        <rect x="-14" y="9"  width="12" height="6" fill="#0277BD" rx="1"/> 
        <animateTransform attributeName="transform" type="rotate" values="-15 0 12; 15 0 12; -15 0 12" dur="0.4s" repeatCount="indefinite"/>
      </g>
      <!-- Body -->
      <rect x="-2"  y="4"  width="32" height="16" fill="#00B0FF" rx="3"/> 
      <rect x="2"   y="14" width="22" height="4"  fill="#B3E5FC" rx="2"/> 
      <rect x="30"  y="6"  width="12" height="12" fill="#00B0FF" rx="3"/> 
      <circle cx="37" cy="11" r="3" fill="white"/>
      <circle cx="37.5" cy="11" r="1.4" fill="#01579B"/>
      <!-- Fins -->
      <rect x="14" y="1"  width="4" height="7" fill="#0288D1" rx="1">
         <animateTransform attributeName="transform" type="skewY" values="-15;15;-15" dur="1s" repeatCount="indefinite"/>
      </rect>
    </g>
  </g>

  <!-- UI Scoreboard -->
  <g transform="translate(40, 60)">
    <text font-family="monospace" font-size="34" font-weight="bold" fill="white" style="filter: drop-shadow(3px 3px 2px black);">${streak}d STREAK</text>
    <text y="28" font-family="monospace" font-size="12" fill="#00E5FF" font-weight="bold">TOTAL: ${total} | RANK: ${stats.rank}</text>
  </g>

</svg>`;
};

module.exports = { renderBattleStats };
