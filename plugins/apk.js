const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "apk",
  desc: "Download APK from Aptoide.",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) {
      return reply("❌ Please provide an app name to search.\n\nExample: *.apk WhatsApp*");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    // Search app on Aptoide API
    let searchUrl = `https://api.aptoide.com/api/7/apps/search?query=${encodeURIComponent(q)}`;
    let { data } = await axios.get(searchUrl);

    if (!data || !data.datalist || !data.datalist.list.length) {
      return reply("❌ No results found for your query.");
    }

    let app = data.datalist.list[0];
    let appName = app.name;
    let appIcon = app.icon;
    let appVersion = app.file.vername;
    let appSize = (app.file.filesize / (1024 * 1024)).toFixed(2) + " MB";
    let appUrl = app.file.path;

    let caption = `📦 *APK Downloader*\n\n` +
                  `🔹 *Name:* ${appName}\n` +
                  `🔹 *Version:* ${appVersion}\n` +
                  `🔹 *Size:* ${appSize}\n\n` +
                  `⬇️ Downloading...`;

    // Send app details with image
    await conn.sendMessage(from, {
      image: { url: appIcon },
      caption: caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          serverMessageId: 999
        }
      }
    }, { quoted: m });

    // Send APK file
    await conn.sendMessage(from, {
      document: { url: appUrl },
      mimetype: "application/vnd.android.package-archive",
      fileName: `${appName}.apk`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363288304618280@newsletter",
          serverMessageId: 999
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    reply("❌ Failed to fetch APK. Please try again later.");
  }
});
