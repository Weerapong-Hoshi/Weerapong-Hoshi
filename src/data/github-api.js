const fetch = require("node-fetch");
const config = require("../config");

async function getContributions() {
  const username = config.GITHUB.USERNAME;
  console.log(`🔍 Querying GitHub for user: "${username}"`);

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

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.GITHUB.TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  // ตรวจสอบว่า GitHub ส่ง Error อะไรกลับมาไหม
  if (json.errors) {
    console.error("❌ GitHub Graphql Error:", json.errors);
    throw new Error("GitHub API returned errors");
  }

  // ตรวจสอบว่าเจอ User หรือไม่
  if (!json.data || !json.data.user) {
    console.error(
      `❌ User "${username}" not found. Please check your GITHUB_USERNAME.`,
    );
    console.log("Full response from GitHub:", JSON.stringify(json));
    throw new Error("User data is null");
  }

  return json.data.user.contributionsCollection.contributionCalendar;
}

module.exports = { getContributions };
