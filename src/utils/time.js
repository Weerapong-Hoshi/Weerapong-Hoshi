/**
 * time.js
 * ─────────────────────────────────────────────────────────
 * คำนวณเวลาไทย (UTC+7) และ Day Phase
 */

function getThaiTime() {
  const now = new Date(Date.now() + 7 * 3600 * 1000);
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

module.exports = { getThaiTime, getDayPhase };
