const AquariumDecor = {
  // 🍍 บ้านสับปะรด
  renderPineapple: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <ellipse cx="0" cy="0" rx="40" ry="50" fill="#FF9800" stroke="#BF360C" stroke-width="2"/>
      <path d="M -30 -30 L 30 30 M -35 0 L 15 45 M 0 -45 L 35 15 M 30 -30 L -30 30 M 35 0 L -15 45 M 0 -45 L -35 15" stroke="#BF360C" stroke-width="1" opacity="0.3"/>
      <circle cx="0" cy="25" r="12" fill="#455A64" stroke="#263238" stroke-width="2"/>
      <circle cx="0" cy="25" r="8" fill="#CFD8DC"/>
      <circle cx="20" cy="-10" r="7" fill="#B0BEC5" stroke="#263238" stroke-width="2"/>
      <g transform="translate(0, -50)">
         <path d="M 0 0 C -25 -20 -15 -50 0 -35 C 15 -50 25 -20 0 0" fill="#4CAF50" stroke="#1B5E20" stroke-width="2"/>
      </g>
    </g>`,

  // 🗿 บ้าน Squidward
  renderStoneHead: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <rect x="-30" y="-75" width="60" height="95" fill="#37474F" rx="5"/>
      <rect x="-8" y="-35" width="16" height="35" fill="#263238" rx="2"/>
      <rect x="-22" y="-55" width="14" height="10" fill="#90A4AE"/>
      <rect x="8" y="-55" width="14" height="10" fill="#90A4AE"/>
      <rect x="-38" y="-40" width="12" height="30" fill="#263238" rx="2"/>
      <rect x="26" y="-40" width="12" height="30" fill="#263238" rx="2"/>
    </g>`,

  // ⚓ สมอเรือ
  renderAnchor: (x, y) => `
    <g transform="translate(${x}, ${y}) rotate(15)">
      <rect x="-2" y="-40" width="4" height="40" fill="#455A64"/>
      <circle cx="0" cy="-42" r="5" fill="none" stroke="#455A64" stroke-width="3"/>
      <path d="M -15 -10 Q 0 5 15 -10" fill="none" stroke="#455A64" stroke-width="4" stroke-linecap="round"/>
    </g>`,

  // 💰 หีบสมบัติ
  renderChest: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <rect x="-18" y="-12" width="36" height="24" fill="#5D4037" rx="2"/>
      <rect x="-18" y="-12" width="36" height="8" fill="#795548" rx="2"/>
      <circle cx="0" cy="-4" r="3" fill="#FFD700"/>
    </g>`,

  // 🛢️ ถังไม้
  renderBarrel: (x, y) => `
    <g transform="translate(${x}, ${y})">
      <rect x="-12" y="-20" width="24" height="30" fill="#795548" rx="3"/>
      <rect x="-12" y="-15" width="24" height="2" fill="#3E2723"/>
      <rect x="-12" y="-5" width="24" height="2" fill="#3E2723"/>
    </g>`,

  // 🌿 สาหร่าย
  renderBush: (x, y, color) => `
    <g transform="translate(${x}, ${y})">
      <path d="M 0 0 Q -15 -30 0 -60 M 8 -5 Q 20 -25 10 -45 M -8 -5 Q -25 -20 -15 -40" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round">
        <animateTransform attributeName="transform" type="skewX" values="-5;5;-5" dur="3s" repeatCount="indefinite"/>
      </path>
    </g>`,

  // 🐚 ก้อนหิน
  renderRock: (x, y) => `
    <circle cx="${x}" cy="${y}" r="${3 + Math.random() * 5}" fill="#546E7A"/>
  `,
};

module.exports = AquariumDecor;
