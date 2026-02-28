// ╔══════════════════════════════════════════════════════════════════╗
// ║        OCEAN METAVERSE ENGINE v3.0 — COSMIC ABYSS EDITION       ║
// ║                    by Weerapong Hoshi 🌊                         ║
// ║                                                                  ║
// ║  3-Layer SVG System:                                             ║
// ║    ocean_sky.svg  — Day/Night UTC+7 | Boss Arena | Stars        ║
// ║    ocean_sea.svg  — Whale Evolution | Waves | Creatures | Radar  ║
// ║    ocean_map.svg  — World Map | Island Unlock | Coral Heatmap    ║
// ╚══════════════════════════════════════════════════════════════════╝

const fs    = require("fs");
const fetch = require("node-fetch");

const repo     = process.env.GITHUB_REPOSITORY || "Weerapong-Hoshi/Weerapong-Hoshi";
const username = repo.split("/")[0];
const token    = process.env.GITHUB_TOKEN;

// ═══════════════════════════════════════════════════════
//  GITHUB API
// ═══════════════════════════════════════════════════════
async function getContributions() {
  const query = `{
    user(login: "${username}") {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { contributionCount date } }
        }
      }
    }
  }`;
  const res  = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  return json.data.user.contributionsCollection.contributionCalendar;
}

// ═══════════════════════════════════════════════════════
//  TIME SYSTEM — UTC+7
// ═══════════════════════════════════════════════════════
function getThaiTime() {
  const now  = new Date(Date.now() + 7 * 3600 * 1000);
  const hour = now.getUTCHours();
  const min  = now.getUTCMinutes();
  return { hour, min, totalMins: hour * 60 + min };
}

function getDayPhase(hour) {
  if (hour >= 5  && hour < 7)  return "dawn";
  if (hour >= 7  && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  if (hour >= 20 && hour < 23) return "evening";
  return "midnight";
}

// ═══════════════════════════════════════════════════════
//  GAME CALCULATIONS
// ═══════════════════════════════════════════════════════
function calcStats(total, days) {
  const level     = Math.floor(total / 100) + 1;
  const xp        = total % 100;

  // Streak
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) streak++;
    else break;
  }

  // Week activity (for radar)
  const weekActivity = days.slice(-7).map(d => d.contributionCount);
  const today        = days[days.length - 1].contributionCount;

  // Rank
  let rank = "D", rankColor = "#78909C";
  if      (streak >= 60) { rank = "SS";  rankColor = "#FF6F00"; }
  else if (streak >= 40) { rank = "S+";  rankColor = "#FFD700"; }
  else if (streak >= 25) { rank = "S";   rankColor = "#FFA000"; }
  else if (streak >= 14) { rank = "A";   rankColor = "#E040FB"; }
  else if (streak >= 7)  { rank = "B";   rankColor = "#00E5FF"; }
  else if (streak >= 3)  { rank = "C";   rankColor = "#69F0AE"; }

  // Whale evolution stage
  let whaleStage;
  if      (total >= 2000) whaleStage = "cosmic";
  else if (total >= 1000) whaleStage = "legendary";
  else if (total >= 500)  whaleStage = "stormbringer";
  else if (total >= 100)  whaleStage = "adult";
  else                    whaleStage = "baby";

  // Boss system
  const milestones  = [500, 1000, 2000, 5000];
  const nextMile    = milestones.find(m => m > total) || 9999;
  const prevMile    = [...milestones].reverse().find(m => m <= total) || 0;
  const bossHP      = nextMile - prevMile;
  const bossHPLeft  = nextMile - total;
  const bossHPPct   = Math.max(0, bossHPLeft / bossHP);

  // Random boss (seed from date so consistent per day)
  const today2      = new Date(Date.now() + 7*3600*1000);
  const seed        = today2.getUTCDate() * 31 + today2.getUTCMonth() * 7;
  const randBoss    = (seed % 10) === 0; // 10% chance
  const randRarity  = ["Common","Rare","Epic","Legendary","Mythic"][seed % 5];

  // Island unlocks
  const landmarks = [
    { commits: 0,    name: "Sandbar",          emoji: "🏖️",  color: "#F9A825" },
    { commits: 50,   name: "Lighthouse",        emoji: "🗼",  color: "#EF5350" },
    { commits: 150,  name: "Fishing Village",   emoji: "🏘️",  color: "#66BB6A" },
    { commits: 350,  name: "Stone Castle",      emoji: "🏰",  color: "#8D6E63" },
    { commits: 700,  name: "Ancient Temple",    emoji: "⛩️",  color: "#AB47BC" },
    { commits: 1200, name: "Volcano Peak",      emoji: "🌋",  color: "#FF5722" },
    { commits: 2000, name: "Cosmic Observatory",emoji: "🔭",  color: "#3F51B5" },
    { commits: 3500, name: "Sunken Colosseum",  emoji: "🏟️",  color: "#00BCD4" },
    { commits: 5000, name: "GOD'S THRONE",      emoji: "👑",  color: "#FFD700" },
  ];
  const unlockedLandmarks = landmarks.filter(l => total >= l.commits);
  const nextLandmark      = landmarks.find(l => total < l.commits);

  return {
    level, xp, streak, weekActivity, today,
    rank, rankColor, whaleStage,
    nextMile, prevMile, bossHP, bossHPLeft, bossHPPct,
    randBoss, randRarity,
    unlockedLandmarks, nextLandmark,
    combo: streak >= 5 ? `×${Math.floor(streak/5)}` : "",
    stormMode: streak === 0,
    godMode: streak >= 30,
  };
}

// ═══════════════════════════════════════════════════════
//  SVG 1: OCEAN SKY
// ═══════════════════════════════════════════════════════
function buildSkySVG(stats, phase, hour) {
  const { level, xp, streak, rank, rankColor, bossHPPct, bossHPLeft,
          nextMile, prevMile, randBoss, randRarity, stormMode, godMode, today, whaleStage } = stats;

  // Sky palette per phase
  const palettes = {
    midnight: { g1:"#000005", g2:"#020B18", g3:"#041428", horizon:"#071E32" },
    dawn:     { g1:"#0D0B2A", g2:"#6B2D6B", g3:"#E8704A", horizon:"#F4A460" },
    day:      { g1:"#0A2472", g2:"#1565C0", g3:"#1976D2", horizon:"#42A5F5" },
    dusk:     { g1:"#1A0533", g2:"#7B1FA2", g3:"#E64A19", horizon:"#FF8A65" },
    evening:  { g1:"#0D0221", g2:"#1A0B3B", g3:"#0D1B6E", horizon:"#1A237E" },
  };
  const pal     = palettes[phase];
  const isNight = phase === "midnight" || phase === "evening";
  const isDay   = phase === "day";

  // Stars (only night/dawn/dusk)
  const starData = [
    [80,18,1.8,2.1],[155,42,1.2,1.6],[290,14,2.2,2.8],[440,38,1.0,1.9],
    [545,11,1.6,2.3],[695,29,1.1,1.7],[895,19,2.0,3.1],[1048,44,1.3,1.5],
    [1148,26,1.7,2.4],[128,64,1.1,1.8],[375,58,1.6,2.2],[638,74,1.0,1.5],
    [818,54,2.1,2.6],[1098,68,1.2,1.9],[248,84,1.5,2.1],[748,78,1.1,1.6],
    [998,36,1.9,2.9],[418,8,1.0,1.5],[560,95,1.3,1.8],[900,88,1.7,2.3],
    [70,102,1.2,1.6],[320,110,1.5,2.0],[700,105,1.0,1.4],[1050,98,1.8,2.5],
  ];

  const starsSVG = (!isDay) ? starData.map(([x,y,r,dur],i) => {
    const del = (i*0.27) % 3.5;
    const opacity = isNight ? 1 : 0.5;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${opacity}">
      <animate attributeName="opacity" values="${opacity};${opacity*0.08};${opacity}" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/>
    </circle>`;
  }).join("") : "";

  // Shooting stars
  const shootSVG = isNight ? Array.from({length:4},(_,i)=>{
    const y=10+i*30, dur=5+i*2, del=i*4;
    return `<line x1="0" y1="${y}" x2="35" y2="${y+18}" stroke="white" stroke-width="1.8" opacity="0">
      <animateMotion dur="${dur}s" begin="${del}s" repeatCount="indefinite"
        path="M -60 0 L 1320 ${i*55}"/>
      <animate attributeName="opacity" values="0;0.9;0.9;0" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/>
    </line>`;
  }).join("") : "";

  // Sun or Moon
  const celestial = isDay
    ? `<circle cx="1050" cy="55" r="32" fill="#FFF176" opacity="0.95">
         <animate attributeName="r" values="32;35;32" dur="6s" repeatCount="indefinite"/>
       </circle>
       <circle cx="1050" cy="55" r="48" fill="#FFF176" opacity="0.08">
         <animate attributeName="r" values="48;58;48" dur="6s" repeatCount="indefinite"/>
       </circle>`
    : phase === "dawn" || phase === "dusk"
    ? `<circle cx="1100" cy="145" r="40" fill="#FF7043" opacity="0.85"/>`
    : `<!-- MOON -->
       <circle cx="1060" cy="50" r="26" fill="#ECEFF1" opacity="0.9"/>
       <circle cx="1073" cy="44" r="26" fill="${pal.g2}"/>
       <circle cx="1035" cy="60" r="4" fill="#CFD8DC" opacity="0.4"/>
       <circle cx="1070" cy="72" r="3" fill="#CFD8DC" opacity="0.3"/>`;

  // Aurora (midnight only, godMode)
  const auroraSVG = (isNight && godMode) ? `
    <path d="M 0 80 Q 300 40 600 70 Q 900 100 1200 60" fill="none" stroke="#00E5FF" stroke-width="18" opacity="0.06">
      <animate attributeName="d" values="M 0 80 Q 300 40 600 70 Q 900 100 1200 60;M 0 90 Q 300 60 600 50 Q 900 80 1200 80;M 0 80 Q 300 40 600 70 Q 900 100 1200 60" dur="6s" repeatCount="indefinite"/>
    </path>
    <path d="M 0 100 Q 400 60 800 90 Q 1000 110 1200 75" fill="none" stroke="#E040FB" stroke-width="12" opacity="0.05">
      <animate attributeName="d" values="M 0 100 Q 400 60 800 90 Q 1000 110 1200 75;M 0 110 Q 400 80 800 70 Q 1000 90 1200 95;M 0 100 Q 400 60 800 90 Q 1000 110 1200 75" dur="8s" repeatCount="indefinite"/>
    </path>` : "";

  // Storm lightning
  const lightSVG = stormMode ? `
    <path d="M 400 0 L 385 55 L 398 55 L 380 120" fill="none" stroke="#FFD54F" stroke-width="2.5" opacity="0">
      <animate attributeName="opacity" values="0;0;1;0;0;0;1;0" dur="4s" repeatCount="indefinite"/>
    </path>
    <path d="M 850 10 L 838 60 L 850 60 L 833 115" fill="none" stroke="#FFD54F" stroke-width="2" opacity="0">
      <animate attributeName="opacity" values="0;0;0;1;0;0;0;1" dur="5s" repeatCount="indefinite"/>
    </path>` : "";

  // Storm clouds
  const cloudSVG = stormMode ? `
    <ellipse cx="300" cy="100" rx="120" ry="45" fill="#1C1C2E" opacity="0.85">
      <animate attributeName="cx" values="300;310;300" dur="8s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="750" cy="85" rx="150" ry="50" fill="#16162A" opacity="0.9">
      <animate attributeName="cx" values="750;738;750" dur="10s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="1050" cy="110" rx="110" ry="40" fill="#1C1C2E" opacity="0.8">
      <animate attributeName="cx" values="1050;1062;1050" dur="7s" repeatCount="indefinite"/>
    </ellipse>` : "";

  // Boss display
  const bossNames = { 500:"KRAKEN", 1000:"LEVIATHAN", 2000:"ABYSS GOD", 5000:"OCEAN TITAN", 9999:"???" };
  const bossName  = bossNames[nextMile] || "???";
  const bossBarW  = Math.floor((1 - bossHPPct) * 260);
  const bossCol   = bossHPPct > 0.6 ? "#EF5350" : bossHPPct > 0.3 ? "#FF7043" : "#FF1744";

  // Random boss tag
  const rarityColors = { Common:"#90A4AE", Rare:"#42A5F5", Epic:"#AB47BC", Legendary:"#FFD700", Mythic:"#FF4081" };
  const randBossSVG = randBoss ? `
    <rect x="820" y="108" width="200" height="55" fill="black" opacity="0.7" rx="4" stroke="${rarityColors[randRarity]}" stroke-width="1.5"/>
    <text x="830" y="126" font-family="monospace" font-size="9" fill="${rarityColors[randRarity]}" letter-spacing="1">⚠ ${randRarity.toUpperCase()} SPAWN</text>
    <text x="830" y="142" font-family="monospace" font-size="11" font-weight="bold" fill="white">SEA SERPENT</text>
    <text x="830" y="157" font-family="monospace" font-size="9" fill="#EF9A9A">RAID ACTIVE TODAY</text>
    <circle cx="815" cy="135" r="5" fill="${rarityColors[randRarity]}">
      <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite"/>
    </circle>` : "";

  // Horizon glow
  const horizonY = 160;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 180" width="1200" height="180" shape-rendering="crispEdges">
  <defs>
    <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${pal.g1}"/>
      <stop offset="55%"  stop-color="${pal.g2}"/>
      <stop offset="100%" stop-color="${pal.horizon}"/>
    </linearGradient>
    <filter id="glow2">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- SKY BG -->
  <rect width="1200" height="180" fill="url(#skyG)"/>

  ${auroraSVG}
  ${starsSVG}
  ${shootSVG}
  ${celestial}
  ${cloudSVG}
  ${lightSVG}

  <!-- HORIZON GLOW -->
  <rect y="${horizonY}" width="1200" height="10" fill="${pal.horizon}" opacity="0.3"/>

  <!-- ══ BOSS HUD (top-right) ══ -->
  <rect x="760" y="14" width="420" height="88" fill="black" opacity="0.72" rx="5"
        stroke="#FF1744" stroke-width="1" stroke-opacity="0.8"/>
  <!-- Corner marks -->
  <rect x="760" y="14" width="14" height="2" fill="#FF1744"/>
  <rect x="760" y="14" width="2"  height="14" fill="#FF1744"/>
  <rect x="1166" y="14" width="14" height="2" fill="#FF1744"/>
  <rect x="1178" y="14" width="2"  height="14" fill="#FF1744"/>
  <rect x="760" y="100" width="14" height="2" fill="#FF1744"/>
  <rect x="760" y="88"  width="2"  height="14" fill="#FF1744"/>

  <text x="776" y="34" font-family="monospace" font-size="10" fill="#FF5252" letter-spacing="2">⚔ BOSS RAID TARGET</text>
  <text x="776" y="52" font-family="monospace" font-size="16" font-weight="bold" fill="#FF1744" letter-spacing="3">${bossName}</text>
  <text x="776" y="67" font-family="monospace" font-size="9"  fill="#EF9A9A">MILESTONE: ${prevMile} → ${nextMile} commits</text>

  <!-- Boss HP Bar -->
  <rect x="776" y="74" width="265" height="10" fill="#1A0000" rx="3"/>
  <rect x="776" y="74" width="${265 - bossBarW}" height="10" fill="${bossCol}" rx="3">
    <animate attributeName="width" values="0;${265 - bossBarW}" dur="1.5s" fill="freeze"/>
  </rect>
  <rect x="776" y="74" width="${265 - bossBarW}" height="5" fill="white" opacity="0.12" rx="3"/>
  <text x="776" y="98" font-family="monospace" font-size="9" fill="#EF9A9A">${bossHPLeft} HP REMAINING — COMMIT TO DEAL DAMAGE</text>

  ${randBossSVG}

  <!-- ══ TIME DISPLAY ══ -->
  <text x="22" y="32" font-family="monospace" font-size="11" fill="#00E5FF" opacity="0.7" letter-spacing="1">
    ${phase.toUpperCase()} — UTC+7 — ${String(hour).padStart(2,"0")}:XX
  </text>

</svg>`;
}

// ═══════════════════════════════════════════════════════
//  WHALE PIXEL ART per stage
// ═══════════════════════════════════════════════════════
function buildWhale(stage, speed) {
  const scales   = { baby:0.7, adult:1.0, stormbringer:1.3, legendary:1.6, cosmic:2.0 };
  const sc       = scales[stage] || 1.0;

  // Base body (pixel-art rects)
  const base = `
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
    <rect x="33"  y="-8" width="3"  height="12" fill="#B3E5FC" opacity="0.75">
      <animate attributeName="height" values="12;18;12" dur="2.2s" repeatCount="indefinite"/>
      <animate attributeName="y" values="-8;-14;-8"     dur="2.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.75;0.2;0.75" dur="2.2s" repeatCount="indefinite"/>
    </rect>
    <!-- Eye -->
    <circle cx="37" cy="11" r="3"   fill="white"/>
    <circle cx="37.5" cy="11" r="1.4" fill="#01579B"/>
    <!-- Dorsal fin -->
    <rect x="14" y="1"  width="4" height="7" fill="#0288D1" rx="1"/>
    <rect x="15" y="-1" width="3" height="4" fill="#0288D1" rx="1"/>
    <!-- Pectoral fin -->
    <rect x="8"  y="19" width="12" height="4" fill="#0277BD" rx="2"/>`;

  // Stage-specific overlays
  const overlays = {
    baby: `<circle cx="16" cy="10" r="22" fill="none" stroke="#B3E5FC" stroke-width="1" opacity="0.3">
      <animate attributeName="r" values="22;26;22" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0.05;0.3" dur="3s" repeatCount="indefinite"/>
    </circle>`,

    adult: ``,

    stormbringer: `
    <!-- Electric arcs -->
    <path d="M -5 5 L 5 15 L 0 20 L 10 30" fill="none" stroke="#FFD54F" stroke-width="1.5" opacity="0">
      <animate attributeName="opacity" values="0;0;1;0;0" dur="1.8s" repeatCount="indefinite"/>
    </path>
    <path d="M 30 3 L 22 12 L 28 14 L 18 26" fill="none" stroke="#FFE082" stroke-width="1" opacity="0">
      <animate attributeName="opacity" values="0;1;0;0;1;0" dur="2.3s" repeatCount="indefinite"/>
    </path>
    <circle cx="16" cy="10" r="30" fill="none" stroke="#FFD54F" stroke-width="2" opacity="0.4">
      <animate attributeName="r" values="30;38;30" dur="1.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;0.08;0.4" dur="1.5s" repeatCount="indefinite"/>
    </circle>`,

    legendary: `
    <!-- Trident trail -->
    <rect x="-22" y="2"  width="4" height="18" fill="#FFD700" rx="1" opacity="0.8"/>
    <rect x="-22" y="2"  width="4" height="5"  fill="#FFD700" rx="1"/>
    <rect x="-19" y="0"  width="2" height="4"  fill="#FFD700" rx="1"/>
    <rect x="-25" y="0"  width="2" height="4"  fill="#FFD700" rx="1"/>
    <!-- Golden aura rings -->
    <circle cx="16" cy="10" r="34" fill="none" stroke="#FFD700" stroke-width="2.5" opacity="0.5">
      <animate attributeName="r" values="34;42;34" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="16" cy="10" r="50" fill="none" stroke="#FFF176" stroke-width="1.5" opacity="0.25">
      <animate attributeName="r" values="50;62;50" dur="2.8s" repeatCount="indefinite"/>
    </circle>
    <!-- Particle trail -->
    ${Array.from({length:6},(_,i)=>`
    <circle cx="${-8 - i*8}" cy="${10 + Math.sin(i)*5}" r="${2.5-i*0.3}" fill="#FFD700" opacity="${0.7-i*0.1}">
      <animate attributeName="opacity" values="${0.7-i*0.1};0;${0.7-i*0.1}" dur="${1+i*0.2}s" repeatCount="indefinite"/>
    </circle>`).join("")}`,

    cosmic: `
    <!-- Black hole trail -->
    <circle cx="-20" cy="10" r="14" fill="black" opacity="0.9">
      <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="-20" cy="10" r="22" fill="none" stroke="#7B1FA2" stroke-width="2" opacity="0.6">
      <animate attributeName="r" values="22;28;22" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="-20" cy="10" r="32" fill="none" stroke="#4A148C" stroke-width="1" opacity="0.3">
      <animate attributeName="r" values="32;40;32" dur="2.5s" repeatCount="indefinite"/>
    </circle>
    <!-- Cosmic body glow — color shift -->
    <rect x="-2" y="4" width="32" height="16" fill="#7B1FA2" opacity="0.4" rx="3">
      <animate attributeName="fill" values="#7B1FA2;#00E5FF;#FF00FF;#7B1FA2" dur="4s" repeatCount="indefinite"/>
    </rect>
    <!-- Star particles orbiting -->
    ${Array.from({length:8},(_,i)=>{
      const ang = i * 45;
      return `<circle cx="16" cy="10" r="2" fill="white" opacity="0.8">
        <animateTransform attributeName="transform" type="rotate"
          from="${ang} 16 10" to="${ang+360} 16 10" dur="${3+i*0.3}s" repeatCount="indefinite"/>
        <animateMotion dur="${3+i*0.3}s" repeatCount="indefinite"
          path="M ${16+Math.cos(ang*Math.PI/180)*45} ${10+Math.sin(ang*Math.PI/180)*18} A 45 18 0 1 1 ${16+Math.cos((ang+1)*Math.PI/180)*45} ${10+Math.sin((ang+1)*Math.PI/180)*18}"/>
      </circle>`;
    }).join("")}
    <!-- Outer cosmic ring -->
    <circle cx="16" cy="10" r="55" fill="none" stroke="#E040FB" stroke-width="1" opacity="0.2">
      <animate attributeName="r" values="55;68;55" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="stroke" values="#E040FB;#00E5FF;#E040FB" dur="4s" repeatCount="indefinite"/>
    </circle>`,
  };

  return `<g transform="scale(${sc})">
    ${base}
    ${overlays[stage] || ""}
    <animateMotion dur="${speed}s" repeatCount="indefinite">
      <mpath href="#swimPath"/>
    </animateMotion>
  </g>`;
}

// ═══════════════════════════════════════════════════════
//  SVG 2: OCEAN SEA
// ═══════════════════════════════════════════════════════
function buildSeaSVG(stats, phase) {
  const { level, xp, streak, rank, rankColor, weekActivity, today,
          whaleStage, combo, stormMode, godMode } = stats;

  const speed = Math.max(4, 14 - Math.floor(streak / 2));
  const xpPct = xp / 100;
  const xpW   = Math.floor(xpPct * 500);

  // Water colors per phase
  const waterColors = {
    midnight: ["#01021A","#020B2B","#030D35"],
    dawn:     ["#0D2137","#0E3050","#1565C0"],
    day:      ["#0D47A1","#1565C0","#1976D2"],
    dusk:     ["#1A0533","#2E1065","#1565C0"],
    evening:  ["#010B1A","#020F26","#030D35"],
  };
  const [w1, w2, w3] = waterColors[phase] || waterColors.day;

  // Rain (storm mode)
  const rainSVG = stormMode ? Array.from({length:60},(_,i)=>{
    const x   = i * 20 + (i*7) % 15;
    const dur = 0.6 + (i*0.03 % 0.4);
    const del = (i * 0.11) % 1.2;
    return `<line x1="${x}" y1="0" x2="${x-4}" y2="22" stroke="#90CAF9" stroke-width="1" opacity="0.35">
      <animateMotion dur="${dur}s" begin="${del}s" repeatCount="indefinite" path="M 0 0 L 0 280"/>
      <animate attributeName="opacity" values="0;0.35;0.35;0" dur="${dur}s" begin="${del}s" repeatCount="indefinite"/>
    </line>`;
  }).join("") : "";

  // Jellyfish (level 5+)
  const jellyCount = Math.min(Math.max(0, level - 4), 5);
  const jellySVG = jellyCount > 0 ? Array.from({length:jellyCount},(_,i)=>{
    const x   = 120 + i * 190;
    const dur = 3.5 + i * 0.8;
    const col = ["#CE93D8","#80DEEA","#F48FB1","#FFCC80","#A5D6A7"][i];
    return `<g>
      <ellipse cx="${x}" cy="185" rx="14" ry="9" fill="${col}" opacity="0.45">
        <animate attributeName="ry" values="9;6;9" dur="${dur}s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="185;170;185" dur="${dur}s" repeatCount="indefinite"/>
      </ellipse>
      ${[-9,-3,3,9].map(dx=>`<path d="M ${x+dx} 193 Q ${x+dx+3} ${210+i*5} ${x+dx-2} ${220+i*5}" fill="none" stroke="${col}" stroke-width="1" opacity="0.35">
        <animate attributeName="d" values="M ${x+dx} 193 Q ${x+dx+3} ${210+i*5} ${x+dx-2} ${220+i*5};M ${x+dx} 193 Q ${x+dx-3} ${208+i*5} ${x+dx+4} ${222+i*5};M ${x+dx} 193 Q ${x+dx+3} ${210+i*5} ${x+dx-2} ${220+i*5}" dur="${dur+0.5}s" repeatCount="indefinite"/>
      </path>`).join("")}
    </g>`;
  }).join("") : "";

  // Fish school
  const fishColors = ["#FFD54F","#80DEEA","#F48FB1","#A5D6A7","#CE93D8","#FFCC80","#EF9A9A"];
  const fishSVG = Array.from({length:8},(_,i)=>{
    const dur  = 7 + i * 1.1;
    const yPos = 155 + i * 12;
    const sz   = 3 + (i % 4);
    const col  = fishColors[i % fishColors.length];
    const del  = i * 0.9;
    return `<g opacity="0.85">
      <ellipse cx="0" cy="0" rx="${sz*1.8}" ry="${sz*0.7}" fill="${col}">
        <animateMotion dur="${dur}s" begin="${del}s" repeatCount="indefinite"
          path="M 1420 ${yPos} C 1000 ${yPos-25} 600 ${yPos+20} 200 ${yPos-10} C 0 ${yPos} -200 ${yPos-5} -250 ${yPos}"/>
      </ellipse>
    </g>`;
  }).join("");

  // Bubbles
  const bubbleSVG = Array.from({length:18},(_,i)=>{
    const x   = 30 + i * 66;
    const dur = 2.8 + i * 0.35;
    const r   = 1.5 + (i%5)*0.8;
    return `<circle cx="${x}" cy="265" r="${r}" fill="none" stroke="#80DEEA" stroke-width="0.8" opacity="0.4">
      <animateMotion dur="${dur}s" begin="${i*0.45}s" repeatCount="indefinite"
        path="M 0 0 Q ${r*4} ${-(55+i*4)} ${r} ${-(110+i*7)}"/>
      <animate attributeName="opacity" values="0.4;0.08;0" dur="${dur}s" begin="${i*0.45}s" repeatCount="indefinite"/>
      <animate attributeName="r" values="${r};${r*0.6};0.1" dur="${dur}s" begin="${i*0.45}s" repeatCount="indefinite"/>
    </circle>`;
  }).join("");

  // Commit Radar (circular, 7-day)
  const radarCx = 1100, radarCy = 88, radarR = 60;
  const maxAct  = Math.max(...weekActivity, 1);
  const radarSpokes = weekActivity.map((v, i) => {
    const ang    = (i / 7) * 2 * Math.PI - Math.PI/2;
    const radius = (v / maxAct) * radarR;
    const x      = radarCx + Math.cos(ang) * radius;
    const y      = radarCy + Math.sin(ang) * radius;
    const xOuter = radarCx + Math.cos(ang) * radarR;
    const yOuter = radarCy + Math.sin(ang) * radarR;
    const days   = ["M","T","W","T","F","S","S"];
    return { x, y, xOuter, yOuter, v, label: days[i], ang };
  });
  const radarPoly = radarSpokes.map(s=>`${s.x},${s.y}`).join(" ");
  const radarRings = [0.33,0.66,1.0].map(p=>`
    <circle cx="${radarCx}" cy="${radarCy}" r="${radarR*p}" fill="none" stroke="#00E5FF" stroke-width="0.5" opacity="0.2"/>`).join("");

  const radarSVG = `
    <!-- RADAR BG -->
    <circle cx="${radarCx}" cy="${radarCy}" r="${radarR+16}" fill="black" opacity="0.65"/>
    <circle cx="${radarCx}" cy="${radarCy}" r="${radarR+16}" fill="none" stroke="#00E5FF" stroke-width="1" opacity="0.5"/>
    ${radarRings}
    <!-- Spokes -->
    ${radarSpokes.map(s=>`<line x1="${radarCx}" y1="${radarCy}" x2="${s.xOuter}" y2="${s.yOuter}" stroke="#00E5FF" stroke-width="0.5" opacity="0.2"/>`).join("")}
    <!-- Activity polygon -->
    <polygon points="${radarPoly}" fill="#00E5FF" opacity="0.2" stroke="#00E5FF" stroke-width="1.5"/>
    <!-- Day labels -->
    ${radarSpokes.map(s=>`<text x="${radarCx + Math.cos(s.ang)*(radarR+9)}" y="${radarCy + Math.sin(s.ang)*(radarR+9)+3}" font-family="monospace" font-size="7" fill="#80DEEA" text-anchor="middle">${s.label}</text>`).join("")}
    <!-- Sweep -->
    <line x1="${radarCx}" y1="${radarCy}" x2="${radarCx}" y2="${radarCy - radarR}" stroke="#00E5FF" stroke-width="1.5" opacity="0.7">
      <animateTransform attributeName="transform" type="rotate" from="0 ${radarCx} ${radarCy}" to="360 ${radarCx} ${radarCy}" dur="4s" repeatCount="indefinite"/>
    </line>
    <text x="${radarCx}" y="${radarCy + radarR + 28}" font-family="monospace" font-size="8" fill="#80DEEA" text-anchor="middle">COMMIT RADAR</text>`;

  // HUD panel
  const stormWarn  = stormMode ? `<text x="38" y="98" font-family="monospace" font-size="12" fill="#FF7043" letter-spacing="1">⚡ STORM WARNING — START STREAK NOW</text>` : "";
  const godBadge   = godMode   ? `<text x="38" y="98" font-family="monospace" font-size="12" fill="#FFD700" letter-spacing="2">✦ COSMIC GOD MODE ACTIVE ✦</text>` : "";
  const statusLine = stormMode ? stormWarn : godMode ? godBadge
    : `<text x="38" y="98" font-family="monospace" font-size="12" fill="#80DEEA" letter-spacing="1">🌊 RIDING THE WAVE</text>`;

  const whaleStageLabelColors = {
    baby:"#B3E5FC", adult:"#00E5FF", stormbringer:"#FFD54F", legendary:"#FFD700", cosmic:"#E040FB"
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 1200 280" width="1200" height="280" shape-rendering="crispEdges">
  <defs>
    <linearGradient id="waterG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${w1}"/>
      <stop offset="50%"  stop-color="${w2}"/>
      <stop offset="100%" stop-color="${w3}"/>
    </linearGradient>
    <linearGradient id="xpG" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#00E5FF"/>
      <stop offset="50%"  stop-color="#00BFA5"/>
      <stop offset="100%" stop-color="#FF00FF"/>
    </linearGradient>
    <linearGradient id="panG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#000D1A" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#001F3F" stop-opacity="0.8"/>
    </linearGradient>
    <path id="swimPath" d="M -350 0 C -50 -55 350 55 600 0 C 850 -55 1150 40 1550 -15" fill="none"/>
  </defs>

  <!-- OCEAN BODY -->
  <rect width="1200" height="280" fill="url(#waterG)"/>

  <!-- RAIN -->
  ${rainSVG}

  <!-- WAVE LAYERS -->
  <path fill="${w2}" opacity="0.5" d="M0,38 C200,22 400,54 600,38 C800,22 1000,54 1200,38 L1200,280 L0,280 Z">
    <animate attributeName="d" values="M0,38 C200,22 400,54 600,38 C800,22 1000,54 1200,38 L1200,280 L0,280 Z;M0,48 C200,64 400,32 600,48 C800,64 1000,32 1200,48 L1200,280 L0,280 Z;M0,38 C200,22 400,54 600,38 C800,22 1000,54 1200,38 L1200,280 L0,280 Z" dur="4.5s" repeatCount="indefinite"/>
  </path>
  <path fill="${w3}" opacity="0.65" d="M0,55 C150,42 350,68 550,55 C750,42 950,68 1200,55 L1200,280 L0,280 Z">
    <animate attributeName="d" values="M0,55 C150,42 350,68 550,55 C750,42 950,68 1200,55 L1200,280 L0,280 Z;M0,62 C150,76 350,50 550,62 C750,76 950,50 1200,62 L1200,280 L0,280 Z;M0,55 C150,42 350,68 550,55 C750,42 950,68 1200,55 L1200,280 L0,280 Z" dur="3.2s" repeatCount="indefinite"/>
  </path>
  <!-- Foam crest -->
  <path fill="#E3F2FD" opacity="0.18" d="M0,55 C150,42 350,68 550,55 C750,42 950,68 1200,55 L1200,64 C950,77 750,53 550,64 C350,77 150,53 0,64 Z">
    <animate attributeName="d" values="M0,55 C150,42 350,68 550,55 C750,42 950,68 1200,55 L1200,64 C950,77 750,53 550,64 C350,77 150,53 0,64 Z;M0,62 C150,76 350,50 550,62 C750,76 950,50 1200,62 L1200,71 C950,58 750,82 550,71 C350,58 150,82 0,71 Z;M0,55 C150,42 350,68 550,55 C750,42 950,68 1200,55 L1200,64 C950,77 750,53 550,64 C350,77 150,53 0,64 Z" dur="3.2s" repeatCount="indefinite"/>
  </path>
  <!-- Deep surface -->
  <path fill="${w1}" opacity="0.8" d="M0,72 C100,64 300,80 500,72 C700,64 900,80 1200,72 L1200,280 L0,280 Z">
    <animate attributeName="d" values="M0,72 C100,64 300,80 500,72 C700,64 900,80 1200,72 L1200,280 L0,280 Z;M0,78 C100,86 300,70 500,78 C700,86 900,70 1200,78 L1200,280 L0,280 Z;M0,72 C100,64 300,80 500,72 C700,64 900,80 1200,72 L1200,280 L0,280 Z" dur="2.8s" repeatCount="indefinite"/>
  </path>

  <!-- CREATURES -->
  ${bubbleSVG}
  ${jellySVG}
  ${fishSVG}

  <!-- WHALE -->
  <g transform="translate(0,45)">
    ${buildWhale(whaleStage, speed)}
  </g>

  <!-- RADAR -->
  ${radarSVG}

  <!-- HUD PANEL -->
  <rect x="18" y="14" width="720" height="130" fill="url(#panG)" rx="6" stroke="#00E5FF" stroke-width="1" stroke-opacity="0.55"/>
  <!-- Corner marks -->
  <rect x="18"  y="14"  width="18" height="2" fill="#00E5FF"/>
  <rect x="18"  y="14"  width="2" height="18" fill="#00E5FF"/>
  <rect x="720" y="14"  width="18" height="2" fill="#FF00FF"/>
  <rect x="736" y="14"  width="2" height="18" fill="#FF00FF"/>
  <rect x="18"  y="142" width="18" height="2" fill="#FF00FF"/>
  <rect x="18"  y="126" width="2" height="18" fill="#FF00FF"/>
  <rect x="720" y="142" width="18" height="2" fill="#00E5FF"/>
  <rect x="736" y="126" width="2" height="18" fill="#00E5FF"/>

  <text x="38" y="38" font-family="monospace" font-size="22" font-weight="bold" fill="#00E5FF" letter-spacing="2">LV ${level}</text>
  <text x="120" y="38" font-family="monospace" font-size="13" fill="#80DEEA" letter-spacing="1">TOTAL ${stats.total || 0} COMMITS</text>
  <text x="420" y="38" font-family="monospace" font-size="13" fill="#80DEEA">TODAY +${today}</text>

  <text x="38" y="62" font-family="monospace" font-size="16" fill="#FF00FF" letter-spacing="1">STREAK ${streak}d ${combo}</text>
  <rect x="260" y="47" width="68" height="22" fill="${rankColor}" opacity="0.18" rx="3"/>
  <text x="294" y="62" font-family="monospace" font-size="16" font-weight="bold" fill="${rankColor}" text-anchor="middle" letter-spacing="2">${rank}</text>
  <text x="342" y="62" font-family="monospace" font-size="13" fill="#69F0AE">RANK</text>

  <!-- Whale stage badge -->
  <text x="450" y="62" font-family="monospace" font-size="11" fill="${whaleStageLabelColors[whaleStage]}" letter-spacing="1">🐋 ${whaleStage.toUpperCase()}</text>

  ${statusLine}

  <!-- XP bar label -->
  <text x="38" y="118" font-family="monospace" font-size="10" fill="#37474F">XP ${xp} / 100 TO NEXT LEVEL</text>
  <!-- XP bar -->
  <rect x="38" y="122" width="500" height="9" fill="#102027" rx="4"/>
  <rect x="38" y="122" width="${xpW}" height="9" fill="url(#xpG)" rx="4">
    <animate attributeName="width" values="0;${xpW}" dur="1.4s" fill="freeze"/>
  </rect>
  <rect x="38" y="122" width="${xpW}" height="4" fill="white" opacity="0.1" rx="4"/>
  <text x="${42 + xpW}" y="132" font-family="monospace" font-size="9" fill="#00E5FF">${xp}%</text>

</svg>`;
}

// ═══════════════════════════════════════════════════════
//  SVG 3: OCEAN MAP
// ═══════════════════════════════════════════════════════
function buildMapSVG(stats, heatmap) {
  const { total, unlockedLandmarks, nextLandmark } = stats;

  // Coral reef heatmap
  const recentDays  = heatmap.slice(-52);
  const coralSVG    = recentDays.map((count, i) => {
    const x    = 10 + i * 22;
    const h    = 6 + count * 12;
    const y    = 148 - h;
    const cols = ["#00897B","#00ACC1","#0288D1","#FF7043","#AB47BC","#FFD700"];
    const col  = count === 0 ? "#1A2A3A" : cols[Math.min(count-1, cols.length-1)];
    const op   = count === 0 ? 0.4 : Math.min(0.95, 0.5 + count * 0.1);
    const w    = count >= 4 ? 18 : count >= 2 ? 16 : 13;
    return `<g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}" opacity="${op}" rx="2"/>
      ${count >= 4 ? `<rect x="${x+2}" y="${y}" width="${w-4}" height="3" fill="white" opacity="0.15" rx="1"/>` : ""}
    </g>`;
  }).join("");

  // Island build
  const islandSize = Math.min(total / 20, 60) + 20; // 20→80px
  const hasBeach   = total >= 10;
  const hasPalm    = total >= 80;
  const hasMtn     = total >= 200;

  // Landmark positions (spread across island area)
  const landmarkPositions = [
    { commits:0,    x:940, y:130 },
    { commits:50,   x:980, y:100 },
    { commits:150,  x:910, y:105 },
    { commits:350,  x:960, y:82  },
    { commits:700,  x:930, y:88  },
    { commits:1200, x:975, y:115 },
    { commits:2000, x:920, y:120 },
    { commits:3500, x:955, y:130 },
    { commits:5000, x:940, y:72  },
  ];

  const landmarkSVG = landmarkPositions.map(lp => {
    const lm      = unlockedLandmarks.find(u => u.commits === lp.commits);
    const locked  = !lm;
    const opacity = locked ? 0.2 : 1.0;
    return locked
      ? `<text x="${lp.x}" y="${lp.y}" font-size="16" opacity="0.15" text-anchor="middle">❓</text>`
      : `<text x="${lp.x}" y="${lp.y}" font-size="${lp.commits === 5000 ? 22 : 16}" opacity="${opacity}" text-anchor="middle">${lm.emoji}
          ${lm.commits === 1200 ? `<animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>` : ""}
         </text>`;
  }).join("");

  // Next landmark progress
  const nextLmSVG = nextLandmark ? (() => {
    const progress = nextLandmark.commits > 0 ? total / nextLandmark.commits : 1;
    const barW     = Math.floor(progress * 320);
    return `
    <text x="30" y="178" font-family="monospace" font-size="10" fill="#80DEEA">NEXT UNLOCK: ${nextLandmark.emoji} ${nextLandmark.name}</text>
    <rect x="30"  y="183" width="320" height="7" fill="#0D1B2A" rx="3"/>
    <rect x="30"  y="183" width="${barW}" height="7" fill="${nextLandmark.color}" rx="3">
      <animate attributeName="width" values="0;${barW}" dur="1.6s" fill="freeze"/>
    </rect>
    <text x="360" y="190" font-family="monospace" font-size="9" fill="${nextLandmark.color}">${total}/${nextLandmark.commits}</text>`;
  })() : `<text x="30" y="178" font-family="monospace" font-size="10" fill="#FFD700">✦ ALL LANDMARKS UNLOCKED — OCEAN GOD ✦</text>`;

  // Unlocked list
  const unlockedList = unlockedLandmarks.slice(-5).reverse().map((lm, i) =>
    `<text x="${400 + i * 55}" y="185" font-size="18" text-anchor="middle">${lm.emoji}</text>`
  ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200" width="1200" height="200" shape-rendering="crispEdges">
  <defs>
    <linearGradient id="seabedG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#001529"/>
      <stop offset="100%" stop-color="#000A18"/>
    </linearGradient>
    <linearGradient id="sandG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#F9A825"/>
      <stop offset="100%" stop-color="#E65100"/>
    </linearGradient>
    <linearGradient id="islandG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#388E3C"/>
      <stop offset="70%"  stop-color="#2E7D32"/>
      <stop offset="100%" stop-color="#1B5E20"/>
    </linearGradient>
  </defs>

  <!-- SEABED BG -->
  <rect width="1200" height="200" fill="url(#seabedG)"/>

  <!-- SAND FLOOR -->
  <rect y="148" width="1200" height="52" fill="url(#sandG)" opacity="0.55"/>
  <rect y="148" width="1200" height="4"  fill="#FDD835" opacity="0.2"/>

  <!-- CORAL REEF HEATMAP -->
  ${coralSVG}

  <!-- CORAL LABEL -->
  <text x="10" y="162" font-family="monospace" font-size="8" fill="#80DEEA" opacity="0.5">COMMIT REEF — LAST ${recentDays.length}d</text>

  <!-- COMMIT COUNT LEGEND -->
  ${[1,2,3,4,5].map((v,i)=>{
    const cols = ["#00897B","#00ACC1","#0288D1","#FF7043","#AB47BC"];
    return `<rect x="${10+i*24}" y="165" width="18" height="8" fill="${cols[i]}" opacity="0.8" rx="2"/>
            <text x="${19+i*24}" y="180" font-family="monospace" font-size="7" fill="#80DEEA" text-anchor="middle">${v}+</text>`;
  }).join("")}

  <!-- ISLAND -->
  <ellipse cx="948" cy="148" rx="${islandSize*1.4}" ry="${islandSize*0.35}" fill="#F9A825" opacity="0.7"/>
  <ellipse cx="948" cy="138" rx="${islandSize*1.1}" ry="${islandSize*0.5}"  fill="url(#islandG)"/>
  ${hasMtn ? `
  <rect x="930" y="${115 - islandSize*0.2}" width="8"  height="${islandSize*0.5}" fill="#795548" rx="2"/>
  <rect x="940" y="${108 - islandSize*0.2}" width="6"  height="${islandSize*0.55}" fill="#6D4C41" rx="2"/>
  <rect x="950" y="${118 - islandSize*0.2}" width="7"  height="${islandSize*0.45}" fill="#795548" rx="2"/>
  <!-- Snow caps -->
  <rect x="930" y="${114 - islandSize*0.2}" width="8" height="5" fill="white" opacity="0.6" rx="2"/>
  <rect x="940" y="${106 - islandSize*0.2}" width="6" height="5" fill="white" opacity="0.7" rx="2"/>` : ""}
  ${hasPalm ? `
  <!-- Palm trees -->
  <rect x="908" y="112" width="3" height="22" fill="#5D4037" rx="1"/>
  <path d="M 895 113 Q 910 100 925 112" fill="none" stroke="#2E7D32" stroke-width="4" stroke-linecap="round"/>
  <path d="M 905 108 Q 910 98 920 107" fill="none" stroke="#388E3C" stroke-width="3" stroke-linecap="round"/>
  <rect x="985" y="116" width="3" height="18" fill="#5D4037" rx="1"/>
  <path d="M 972 117 Q 987 104 1000 116" fill="none" stroke="#2E7D32" stroke-width="4" stroke-linecap="round"/>` : ""}

  <!-- LANDMARKS -->
  ${landmarkSVG}

  <!-- ISLAND LABEL -->
  <text x="948" y="155" font-family="monospace" font-size="9" fill="#FFF9C4" text-anchor="middle" opacity="0.8">HOSHI ISLAND</text>

  <!-- OCEAN CREATURES in background -->
  <text x="100"  y="130" font-size="16" opacity="0.15">🐠</text>
  <text x="300"  y="110" font-size="14" opacity="0.12">🦑</text>
  <text x="550"  y="135" font-size="16" opacity="0.13">🐡</text>
  <text x="700"  y="115" font-size="12" opacity="0.1">🦀</text>

  <!-- PROGRESS PANEL -->
  <rect x="18" y="14" width="860" height="55" fill="black" opacity="0.6" rx="4" stroke="#00BFA5" stroke-width="1" stroke-opacity="0.5"/>
  <text x="30" y="34" font-family="monospace" font-size="11" fill="#00BFA5" letter-spacing="1">🗺 WORLD MAP — HOSHI ISLAND</text>
  <text x="30" y="50" font-family="monospace" font-size="10" fill="#80DEEA">UNLOCKED: ${unlockedLandmarks.length} LANDMARKS</text>
  ${unlockedList}

  ${nextLmSVG}

</svg>`;
}

// ═══════════════════════════════════════════════════════
//  MAIN — ORCHESTRATE ALL 3 SVGs
// ═══════════════════════════════════════════════════════
(async () => {
  console.log("🌊 Ocean Metaverse Engine v3.0 starting...");

  const data    = await getContributions();
  const days    = data.weeks.flatMap(w => w.contributionDays);
  const total   = data.totalContributions;
  const heatmap = days.map(d => d.contributionCount);

  const stats   = calcStats(total, days);
  stats.total   = total;

  const { hour } = getThaiTime();
  const phase     = getDayPhase(hour);

  console.log(`📊 Total: ${total} | Streak: ${stats.streak} | Whale: ${stats.whaleStage} | Phase: ${phase} (${hour}:XX TH)`);

  const skySVG = buildSkySVG(stats, phase, hour);
  const seaSVG = buildSeaSVG(stats, phase);
  const mapSVG = buildMapSVG(stats, heatmap);

  fs.mkdirSync("assets", { recursive: true });
  fs.writeFileSync("assets/ocean_sky.svg", skySVG);
  fs.writeFileSync("assets/ocean_sea.svg", seaSVG);
  fs.writeFileSync("assets/ocean_map.svg", mapSVG);

  console.log("✅ All 3 SVG layers generated!");
  console.log(`   🌌 Sky  → assets/ocean_sky.svg`);
  console.log(`   🌊 Sea  → assets/ocean_sea.svg`);
  console.log(`   🗺️  Map  → assets/ocean_map.svg`);
})();
