const { UI } = require("../theme/palettes");
const { CoralReef, CoralLegend, Island } = require("../components/island");
const { ProgressBar } = require("../components/ui");

const renderMap = (stats) => {
  const { island } = stats;
  const unlockedCount = island.unlocked.length;
  const next = island.next;

  let progressBar = "";
  if (next) {
    const current = stats.total;
    const max = next.commits;
    const prev =
      island.unlocked.length > 0
        ? island.unlocked[island.unlocked.length - 1].commits
        : 0;
    const barW = 320;

    progressBar = `
    <text x="30" y="182" font-family="monospace" font-size="10" fill="${UI.cyanDark}">NEXT UNLOCK: ${next.emoji || "🏰"} ${next.name}</text>
    ${ProgressBar(30, 187, barW, 7, current, max, "#8D6E63")}`;
  }

  const landmarkIcons = island.unlocked
    .map(
      (l, i) =>
        `<text x="${380 + i * 45}" y="190" font-size="18" text-anchor="middle">${l.emoji || "🏖️"}</text>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1200 200" width="1200" height="200" shape-rendering="crispEdges">
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
  <rect y="148" width="1200" height="4"  fill="#FDD835"     opacity="0.2"/>

  <!-- CORAL REEF HEATMAP -->
  ${CoralReef(stats.heatmap)}

  <!-- 3. ปรับตำแหน่ง Legend ของประการัง (ให้อยู่โซนบนของทราย) -->
  <text x="10" y="158" font-family="monospace" font-size="8" fill="${UI.cyanDark}" opacity="0.5">COMMIT REEF — LAST 52d</text>
  <g transform="translate(0, -5)"> <!-- ขยับ Legend ขึ้นเล็กน้อย -->
    ${CoralLegend()}
  </g>

  <!-- ISLAND -->
  ${Island(island.unlocked, island.next)}

  <!-- Background ocean creatures -->
  <text x="100" y="130" font-size="16" opacity="0.15">🐠</text>
  <text x="300" y="110" font-size="14" opacity="0.12">🦑</text>
  <text x="550" y="135" font-size="16" opacity="0.13">🐡</text>
  <text x="700" y="115" font-size="12" opacity="0.1">🦀</text>

  <!-- PROGRESS PANEL -->
  <rect x="18" y="14" width="860" height="55"
    fill="black" opacity="0.6" rx="4"
    stroke="${UI.teal}" stroke-width="1" stroke-opacity="0.5"/>
  <text x="30" y="34" font-family="monospace" font-size="11" fill="${UI.teal}" letter-spacing="1">🗺 WORLD MAP — HOSHI ISLAND</text>
  <text x="30" y="50" font-family="monospace" font-size="10" fill="${UI.cyanDark}">UNLOCKED: ${unlockedCount} LANDMARKS</text>

  <!-- Next landmark progress -->
  ${progressBar}

  <!-- Unlocked landmark icons -->
  ${landmarkIcons}

</svg>`;
};

module.exports = { renderMap };
