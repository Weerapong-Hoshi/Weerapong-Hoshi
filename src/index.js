require("dotenv").config();
const fs = require("fs");
const config = require("./config");

// Data & Logic
const { getContributions } = require("./data/github-api");
const { calcGameStats } = require("./data/game-logic");
const { getThaiTime, getDayPhase } = require("./utils/time");
const { getBase64Icon } = require("./utils/icon-loader");

// Views
const { renderSky } = require("./views/ocean-sky");
const { renderSea } = require("./views/ocean-sea");
const { renderMap } = require("./views/ocean-map");
const { renderSkillBeach } = require("./views/skill-beach");
const { renderSkillAbyss } = require("./views/skill-abyss");
const { renderBattleStats } = require("./views/ocean-battle-stats");

async function main() {
  try {
    console.log("🌊 Ocean Metaverse Engine v3.0 - Starting...");

    // 1. ดึงข้อมูล GitHub
    console.log("📡 Fetching GitHub Data...");
    const rawData = await getContributions();

    // 2. คำนวณ Game Stats
    console.log("🧠 Calculating Game Stats...");
    const stats = calcGameStats(rawData.totalContributions, rawData.weeks);
    const { hour } = getThaiTime();
    const phase = getDayPhase(hour);

    // 3. โหลด Icons เป็น Base64
    console.log("📦 Loading Icons...");
    const iconDataMap = {};
    await Promise.all(
      config.SKILLS.map(async (skill) => {
        iconDataMap[skill.id] = await getBase64Icon(skill.id);
      }),
    );

    // 4. สร้าง Folder Assets ถ้ายังไม่มี
    if (!fs.existsSync("assets")) {
      fs.mkdirSync("assets", { recursive: true });
    }

    // 5. Render และบันทึกไฟล์ SVG ทั้งหมด
    console.log("🎨 Generating SVG Layers...");

    // Layer 1: Sky
    fs.writeFileSync("assets/ocean_sky.svg", renderSky(stats, phase, hour));

    // Layer 2: Sea
    fs.writeFileSync("assets/ocean_sea.svg", renderSea(stats, phase));

    // Layer 3: Map
    fs.writeFileSync("assets/ocean_map.svg", renderMap(stats));

    // Layer 4: Skill Beach (Arsenal)
    fs.writeFileSync(
      "assets/skill_beach.svg",
      renderSkillBeach(config.SKILLS, iconDataMap),
    );

    // Layer 5: Skill Abyss (Deep Sea)
    fs.writeFileSync(
      "assets/skill_abyss.svg",
      renderSkillAbyss(config.SKILLS, iconDataMap),
    );

    // 6. Battle Stats (Fish Aquarium)
    console.log("🐟 Rendering Battle Stats Aquarium...");
    fs.writeFileSync("assets/ocean_stats.svg", renderBattleStats(stats));

    console.log("-----------------------------------------");
    console.log("✅ ALL ASSETS GENERATED SUCCESSFULLY!");
    console.log(
      `📊 Stats: LV ${stats.level} | Total: ${stats.total} | Streak: ${stats.streak}d`,
    );
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("❌ Error during generation:", error);
    process.exit(1);
  }
}

main();
