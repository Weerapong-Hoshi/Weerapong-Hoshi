const SkillIcon = require("../components/skill-icon");

const renderSkillBeach = (skills, iconDataMap) => {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 300" width="900" height="300">
  <defs>
    <!-- GRADIENTS & FILTERS FROM ORIGINAL -->
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a6fa8"/><stop offset="40%" stop-color="#4ab3e8"/>
      <stop offset="75%" stop-color="#f9c74f"/><stop offset="100%" stop-color="#f4845f"/>
    </linearGradient>
    <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e88e5"/><stop offset="100%" stop-color="#0d47a1"/>
    </linearGradient>
    <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffe082"/><stop offset="50%" stop-color="#ffca28"/><stop offset="100%" stop-color="#f9a825"/>
    </linearGradient>
    <linearGradient id="wetsand" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e6b800"/><stop offset="100%" stop-color="#c68400"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff9c4" stop-opacity="1"/>
      <stop offset="60%" stop-color="#ffca28" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#ff8f00" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="1" dy="3" stdDeviation="2.5" flood-opacity="0.4"/></filter>
  </defs>

  <!-- ── SKY ── -->
  <rect width="900" height="220" fill="url(#sky)"/>
  <rect y="95" width="900" height="30" fill="#f9c74f" opacity="0.15"/>

  <!-- ── SUN (Full Animation) ── -->
  <circle cx="760" cy="52" r="52" fill="url(#sunGlow)" opacity="0.55">
    <animate attributeName="r" values="52;60;52" dur="4s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.55;0.35;0.55" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="760" cy="52" r="26" fill="#fff176" opacity="0.95"/>
  <circle cx="760" cy="52" r="22" fill="#ffee58"/>
  <g opacity="0.4">
    <line x1="760" y1="16" x2="760" y2="8" stroke="#ffee58" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="760" y1="88" x2="760" y2="96" stroke="#ffee58" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="724" y1="52" x2="716" y2="52" stroke="#ffee58" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="796" y1="52" x2="804" y2="52" stroke="#ffee58" stroke-width="2.5" stroke-linecap="round"/>
  </g>

  <!-- ── OCEAN (Waves & Shimmer) ── -->
  <rect y="112" width="900" height="50" fill="url(#ocean)"/>
  <rect y="115" width="900" height="8" fill="url(#shimmer)" opacity="0.8">
    <animateTransform attributeName="transform" type="translate" from="-900 0" to="900 0" dur="5s" repeatCount="indefinite"/>
  </rect>
  <path fill="#42a5f5" opacity="0.55" d="M0,112 C75,107 150,117 225,112 C300,107 375,117 450,112 C525,107 600,117 675,112 L900,125 L0,125 Z">
    <animate attributeName="d" values="M0,112 C75,107 150,117 225,112 C300,107 375,117 450,112 C525,107 600,117 675,112 L900,125 L0,125 Z; M0,116 C75,121 150,111 225,116 C300,121 375,111 450,116 C525,121 600,111 675,116 L900,125 L0,125 Z; M0,112 C75,107 150,117 225,112 C300,107 375,117 450,112 C525,107 600,117 675,112 L900,125 L0,125 Z" dur="3s" repeatCount="indefinite"/>
  </path>

  <!-- ── SAND ── -->
  <rect y="158" width="900" height="16" fill="url(#wetsand)" opacity="0.85"/>
  <rect y="170" width="900" height="50" fill="url(#sand)"/>
  <path d="M0,175 C120,173 240,177 360,175 C480,173 600,177 720,175 C840,173 900,176 900,176" fill="none" stroke="#e6b800" stroke-width="0.7" opacity="0.4"/>

  <!-- ── PALM TREES (Full Details) ── -->
  <g transform="translate(55,220)">
    <path d="M0,0 C3,-30 8,-65 15,-100 C18,-120 22,-145 24,-170" fill="none" stroke="#795548" stroke-width="7" stroke-linecap="round"/>
    <g transform="translate(24,-170)">
      <path d="M0,0 C20,-8 45,-5 60,8" fill="none" stroke="#2e7d32" stroke-width="5" stroke-linecap="round"/>
      <path d="M0,0 C15,-20 35,-28 45,-22" fill="none" stroke="#2e7d32" stroke-width="5" stroke-linecap="round"/>
      <path d="M0,0 C-18,-6 -40,-2 -52,10" fill="none" stroke="#388e3c" stroke-width="5" stroke-linecap="round"/>
      <path d="M0,0 C-8,-22 -5,-40 4,-48" fill="none" stroke="#2e7d32" stroke-width="5" stroke-linecap="round"/>
      <circle cx="5" cy="-5" r="5" fill="#795548"/><circle cx="-4" cy="-3" r="4" fill="#6d4c41"/>
    </g>
    <animateTransform attributeName="transform" type="rotate" additive="sum" values="0 24 -170;1.5 24 -170;0 24 -170;-1.5 24 -170;0 24 -170" dur="5s" repeatCount="indefinite"/>
  </g>

  <g transform="translate(820,220)">
    <path d="M0,0 C-2,-25 -5,-55 -8,-80 C-10,-100 -12,-125 -12,-148" fill="none" stroke="#795548" stroke-width="6" stroke-linecap="round"/>
    <g transform="translate(-12,-148)">
      <path d="M0,0 C18,-7 38,-4 50,8" fill="none" stroke="#2e7d32" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M0,0 C12,-18 30,-24 40,-18" fill="none" stroke="#388e3c" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M0,0 C-16,-5 -35,-1 -46,10" fill="none" stroke="#2e7d32" stroke-width="4.5" stroke-linecap="round"/>
    </g>
    <animateTransform attributeName="transform" type="rotate" additive="sum" values="0 -12 -148;-1.5 -12 -148;0 -12 -148;1.5 -12 -148;0 -12 -148" dur="4.5s" repeatCount="indefinite"/>
  </g>

  <!-- SEAGULLS -->
  <g opacity="0.6">
    <path d="M 180 45 C 184 41 188 45 192 41" fill="none" stroke="#455a64" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 600 22 C 604 18 608 22 612 18" fill="none" stroke="#455a64" stroke-width="1.5" stroke-linecap="round"/>
  </g>

  <!-- ── THE RACE (Icons) ── -->
  ${skills.map((s) => SkillIcon(s, iconDataMap[s.id])).join("")}

  <!-- ── LEGEND UI (Restored) ── -->
  <rect y="220" width="900" height="80" fill="#0a1628"/>
  <rect y="220" width="900" height="1.5" fill="#00e5ff" opacity="0.25"/>
  <text x="450" y="234" font-family="monospace" font-size="8" fill="#80deea" text-anchor="middle" letter-spacing="2" opacity="0.7">⚔ SKILL ARSENAL</text>

  ${skills
    .map(
      (s, i) => `
    <g transform="translate(${37 + i * 75}, 258)">
      ${SkillIcon(s, iconDataMap[s.id], true)}
      <text y="22" font-family="monospace" font-size="7" fill="#b0bec5" text-anchor="middle">${s.name}</text>
    </g>
  `,
    )
    .join("")}

  <text x="450" y="213" font-family="monospace" font-size="9" fill="#fff9c4" text-anchor="middle" letter-spacing="2" opacity="0.9">🏆 SKILL RACE — ARSENAL BEACH 🌊</text>
</svg>`;
};

module.exports = { renderSkillBeach };
