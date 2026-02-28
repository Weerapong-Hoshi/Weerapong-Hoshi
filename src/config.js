require("dotenv").config();

module.exports = {
   GITHUB: {
    // ใช้ชื่อจาก Environment ตรงๆ ถ้าไม่มีให้พยายามตัดจากชื่อ Repo
    USERNAME: process.env.GITHUB_USERNAME || (process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split("/")[0] : "Weerapong-Hoshi"),
    REPO: process.env.GITHUB_REPOSITORY || "Weerapong-Hoshi/Weerapong-Hoshi",
    TOKEN: process.env.GITHUB_TOKEN
  },
  GAME: {
    // กำหนดค่า XP ที่ต้องใช้ต่อเลเวล
    XP_PER_LEVEL: 100,
    // Milestones ของ Boss
    BOSS_MILESTONES: [500, 1000, 2000, 5000],
    // รายชื่อ Boss ตาม Milestone
    BOSS_NAMES: {
      500: "KRAKEN",
      1000: "LEVIATHAN",
      2000: "ABYSS GOD",
      5000: "OCEAN TITAN",
      9999: "???",
    },
    // การปลดล็อคเกาะ
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
      {
        commits: 3500,
        name: "Sunken Colosseum",
        emoji: "🏟️",
        color: "#00BCD4",
      },
      { commits: 5000, name: "GOD'S THRONE", emoji: "👑", color: "#FFD700" },
    ],
  },
  SKILLS: [
    { id: "csharp",       name: "C#",     xp: 95, rank: "S — MASTER",  color: "#6B2D8B", speed: "6.5s",  delay: "0s",    bounceDur: "0.5s" },
    { id: "javascript",   name: "JS",     xp: 60, rank: "C — ADEPT",   color: "#F7DF1E", speed: "7.0s",  delay: "1.2s",  bounceDur: "0.55s" },
    { id: "unity",        name: "Unity",  xp: 90, rank: "S — MASTER",  color: "#FFFFFF", speed: "7.5s",  delay: "0.5s",  bounceDur: "0.6s" },
    { id: "cplusplus",    name: "C++",    xp: 80, rank: "A — EXPERT",  color: "#00427A", speed: "9.0s",  delay: "2.0s",  bounceDur: "0.65s" },
    { id: "unrealengine", name: "Unreal", xp: 50, rank: "B — SKILLED", color: "#FFFFFF", speed: "9.5s",  delay: "0.8s",  bounceDur: "0.7s" },
    { id: "html5",        name: "HTML5",  xp: 80, rank: "C — ADEPT",   color: "#E34F26", speed: "10.5s", delay: "3.5s",  bounceDur: "0.75s" },
    { id: "css3",         name: "CSS3",   xp: 70, rank: "C — ADEPT",   color: "#1572B6", speed: "11.0s", delay: "4.2s",  bounceDur: "0.8s" },
    { id: "blender",      name: "Blender",xp: 65, rank: "B — SKILLED", color: "#265787", speed: "13.0s", delay: "1.5s",  bounceDur: "0.85s" },
    { id: "docker",       name: "Docker", xp: 55, rank: "B — SKILLED", color: "#b1ddff", speed: "14.5s", delay: "2.8s",  bounceDur: "0.9s" },
    { id: "python",       name: "Python", xp: 70, rank: "B — SKILLED", color: "#306998", speed: "16.0s", delay: "0.2s",  bounceDur: "0.95s" },
    { id: "php",          name: "PHP",    xp: 60, rank: "B — SKILLED", color: "#4F5B93", speed: "17.0s", delay: "5.0s",  bounceDur: "1.0s" },
    { id: "dot-net",      name: ".NET",   xp: 60, rank: "C — ADEPT",   color: "#512BD4", speed: "18.5s", delay: "6.0s",  bounceDur: "1.1s" },
    { id: "java",         name: "Java",   xp: 60, rank: "B — SKILLED", color: "#f89820", speed: "15.0s", delay: "4.0s",  bounceDur: "0.9s" }
  ],
};
