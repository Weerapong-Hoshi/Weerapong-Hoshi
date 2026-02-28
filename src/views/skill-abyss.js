const SkillWhale = require("../components/skill-whale");

const renderSkillAbyss = (skills, iconDataMap) => {
  const sortedSkills = [...skills].sort((a, b) => b.xp - a.xp);
  // คำนวณความสูงอัตโนมัติจากจำนวนสกิล
  const height = 150 + sortedSkills.length * 140;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 ${height}" width="480" height="${height}">
  <defs>
    <linearGradient id="abyssGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#1565C0"/>
      <stop offset="40%"  stop-color="#0D47A1"/>
      <stop offset="100%" stop-color="#001529"/>
    </linearGradient>
  </defs>

  <rect width="480" height="${height}" fill="url(#abyssGrad)"/>
  
  <!-- แสงสะท้อนจากข้างบน -->
  <path d="M0,0 L480,0 L380,400 L100,400 Z" fill="white" opacity="0.05"/>

  <!-- ฝูงวาฬทักษะ -->
  ${sortedSkills.map((s, i) => SkillWhale(s, iconDataMap[s.id], i)).join("")}

  <!-- Footer (The Abyss) -->
  <g transform="translate(0, ${height - 60})">
    <rect width="480" height="60" fill="#000" opacity="0.3"/>
    <text x="240" y="35" font-family="monospace" font-size="10" fill="#00E5FF" text-anchor="middle" letter-spacing="4" font-weight="bold">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="5s" repeatCount="indefinite"/>
      THE ABYSS — LIMITLESS GROWTH
    </text>
  </g>
</svg>`;
};

module.exports = { renderSkillAbyss };
