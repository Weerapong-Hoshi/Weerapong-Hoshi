/**
 * game-logic.js
 * ─────────────────────────────────────────────────────────
 * คำนวณ stats ทั้งหมดจาก GitHub contribution data
 * รวม Logic สำหรับทุก View (Sky, Sea, Map, Abyss, Aquarium)
 */

const CONFIG = {
  XP_PER_LEVEL: 100,
  BOSS_MILESTONES: [100, 250, 500, 1000, 2000, 5000],
  BOSS_NAMES: {
    100: "BABY KRAKEN",
    250: "KRAKEN",
    500: "LEVIATHAN",
    1000: "SEA SERPENT",
    2000: "POSEIDON",
    5000: "ELDER GOD",
  },
  LANDMARKS: [
    { commits: 0, name: "Sandbar", emoji: "🏖️", color: "#F9A825" },
    { commits: 50, name: "Lighthouse", emoji: "🗼", color: "#EF5350" },
    { commits: 150, name: "Fishing Village", emoji: "🏘️", color: "#66BB6A" },
    { commits: 350, name: "Stone Castle", emoji: "🏰", color: "#8D6E63" },
    { commits: 700, name: "Ancient Temple", emoji: "⛩️", color: "#AB47BC" },
    { commits: 1200, name: "Volcano Peak", emoji: "🌋", color: "#FF5722" },
    {
      commits: 2000,
      name: "Cosmic Observatory",
      emoji: "🔭",
      color: "#3F51B5",
    },
    { commits: 3500, name: "Sunken Colosseum", emoji: "🏟️", color: "#00BCD4" },
    { commits: 5000, name: "GOD'S THRONE", emoji: "👑", color: "#FFD700" },
  ],
  RANK_THRESHOLDS: [
    { min: 60, rank: "SS", color: "#FF6F00" },
    { min: 40, rank: "S+", color: "#FFD700" },
    { min: 25, rank: "S", color: "#FFA000" },
    { min: 14, rank: "A", color: "#E040FB" },
    { min: 7, rank: "B", color: "#00E5FF" },
    { min: 3, rank: "C", color: "#69F0AE" },
    { min: 0, rank: "D", color: "#78909C" },
  ],
};

/**
 * คำนวณสถิติต่างๆ
 */
function calcGameStats(totalContributions, weeks) {
  const days = weeks.flatMap((w) => w.contributionDays);
  const heatmap = days.map((d) => d.contributionCount);

  // 1. Current Streak (นับถอยหลังจากวันนี้)
  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) currentStreak++;
    else if (i === days.length - 1)
      continue; // ข้ามวันนี้ถ้ายังไม่ได้ commit แต่ถ้าขาดเมื่อวานคือจบ
    else break;
  }

  // 2. Longest Streak (คำนวณจากประวัติทั้งหมด - สำหรับ Aquarium)
  let maxStreak = 0;
  let tempStreak = 0;
  for (let d of days) {
    if (d.contributionCount > 0) {
      tempStreak++;
    } else {
      if (tempStreak > maxStreak) maxStreak = tempStreak;
      tempStreak = 0;
    }
  }
  if (tempStreak > maxStreak) maxStreak = tempStreak; // เช็คตัวสุดท้าย

  // 3. Level & XP
  const level = Math.floor(totalContributions / CONFIG.XP_PER_LEVEL) + 1;
  const xp = totalContributions % CONFIG.XP_PER_LEVEL;

  // 4. Weekly Activity (7 วันล่าสุดสำหรับ Radar)
  const weekActivity = days.slice(-7).map((d) => d.contributionCount);
  const todayCount = days[days.length - 1].contributionCount;

  // 5. Rank (อิงจาก Current Streak)
  const rankObj =
    CONFIG.RANK_THRESHOLDS.find((t) => currentStreak >= t.min) ||
    CONFIG.RANK_THRESHOLDS[CONFIG.RANK_THRESHOLDS.length - 1];

  // 6. Whale Stage (วิวัฒนาการตาม Total)
  const whaleStage =
    totalContributions >= 2000
      ? "cosmic"
      : totalContributions >= 1000
        ? "legendary"
        : totalContributions >= 500
          ? "stormbringer"
          : totalContributions >= 100
            ? "adult"
            : "baby";

  // 7. Boss Logic (HP และ Milestone)
  const nextMile =
    CONFIG.BOSS_MILESTONES.find((m) => m > totalContributions) || 9999;
  const prevMile =
    [...CONFIG.BOSS_MILESTONES]
      .reverse()
      .find((m) => m <= totalContributions) || 0;
  const bossHP = nextMile - prevMile;
  const bossHPLeft = nextMile - totalContributions;
  const bossHPPct = Math.max(0, bossHPLeft / bossHP);
  const bossName = CONFIG.BOSS_NAMES[nextMile] || "???";

  // 8. Random Event (Seed จากวันที่ไทย)
  const todayDate = new Date(Date.now() + 7 * 3600 * 1000);
  const seed = todayDate.getUTCDate() * 31 + todayDate.getUTCMonth() * 7;
  const randRarity = ["Common", "Rare", "Epic", "Legendary", "Mythic"][
    seed % 5
  ];
  const randActive = seed % 10 === 0;

  // 9. Island Landmarks (การปลดล็อค)
  const unlockedLandmarks = CONFIG.LANDMARKS.filter(
    (l) => totalContributions >= l.commits,
  );
  const nextLandmark = CONFIG.LANDMARKS.find(
    (l) => totalContributions < l.commits,
  );

  return {
    total: totalContributions,
    heatmap,
    level,
    xp,
    streak: currentStreak,
    maxStreak: maxStreak, // สำหรับ Aquarium
    weekActivity,
    today: todayCount,
    rank: rankObj.rank,
    rankColor: rankObj.color,
    whaleStage,
    boss: {
      name: bossName,
      hpMax: bossHP,
      hpLeft: bossHPLeft,
      hpPct: bossHPPct,
      milestone: { prev: prevMile, next: nextMile },
    },
    randEvent: {
      active: randActive,
      rarity: randRarity,
    },
    island: {
      unlocked: unlockedLandmarks,
      next: nextLandmark,
    },
    flags: {
      combo: currentStreak >= 5 ? `×${Math.floor(currentStreak / 5)}` : "",
      stormMode: currentStreak === 0,
      godMode: currentStreak >= 30,
    },
  };
}

module.exports = { calcGameStats, CONFIG };
