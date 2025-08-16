const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "apk",
  desc: "Download Android apps (APK) from BK9 API",
  category: "download",
  filename: __filename
}, async (conn, m, { args, reply }) => {
  const appName = args.join(" ");
  if (!appName) {
    return reply("❗ Please provide an app name.\n\nExample: `.apk facebook`");
  }

  try {
    // Search app
    const searchResponse = await axios.get(`https://bk9.fun/search/apk?q=${appName}`);
    const searchData = searchResponse.data;

    if (!searchData.BK9 || searchData.BK9.length === 0) {
      return reply("⚠️ No app found with that name, try again.");
    }

    // Fetch details of first result
    const appDetailsResponse = await axios.get(`https://bk9.fun/download/apk?id=${searchData.BK9[0].id}`);
    const appDetails = appDetailsResponse.data;

    if (!appDetails.BK9 || !appDetails.BK9.dllink) {
      return reply("❌ Unable to get download link.");
    }

    // Send APK file
    await conn.sendMessage(
      m.chat,
      {
        document: { url: appDetails.BK9.dllink },
        fileName: `${appDetails.BK9.name}.apk`,
        mimetype: "application/vnd.android.package-archive",
        caption: `📦 *${appDetails.BK9.name}*\n\n✅ Downloaded via NEXUS-AI Bot`
      },
      { quoted: m }
    );

  } catch (err) {
    console.error("APK Download Error:", err);
    reply("🚨 Failed to download APK. Try again later.");
  }
});
