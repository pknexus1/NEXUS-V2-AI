const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

// APK Downloader Command
cmd({
    pattern: "apk",
    alias: ["app", "playstore"],
    react: "📦",
    desc: "Download APK from Playstore",
    category: "download",
    use: '.apk <app name>',
    filename: __filename
}, async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide an app name to search.");

        // Search app using BK9 API
        let search = await axios.get(`https://bk9.fun/search/apk?q=${encodeURIComponent(q)}`);
        let searchData = search.data;

        if (!searchData.BK9 || searchData.BK9.length === 0) {
            return reply("❌ No app found with that name, try again.");
        }

        // Get first app details
        let appId = searchData.BK9[0].id;
        let details = await axios.get(`https://bk9.fun/download/apk?id=${appId}`);
        let app = details.data.BK9;

        if (!app || !app.dllink) {
            return reply("❌ Failed to fetch download link. Try again later.");
        }

        // Build caption
        let caption = `📦 *APK Downloader*
        
📝 *Name:* ${app.name}
🆔 *ID:* ${appId}
📂 *Size:* ${app.size || "Unknown"}
⬇️ *Download:* [Click Here](${app.dllink})

> Powered by PK-XMD 🔥`;

        // Send APK file
        await conn.sendMessage(from, {
            document: { url: app.dllink },
            fileName: `${app.name}.apk`,
            mimetype: "application/vnd.android.package-archive",
            caption,
            contextInfo: {
                externalAdReply: {
                    title: app.name,
                    body: "APK Downloader - Join our WhatsApp Channel",
                    thumbnailUrl: app.thumbnail || config.LOGO,
                    sourceUrl: 'https://whatsapp.com/channel/0029VatOy2EAzNc2WcShQw1j',
                    mediaUrl: 'https://whatsapp.com/channel/0029VatOy2EAzNc2WcShQw1j',
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("APK Error:", e);
        reply("⚠️ APK download failed. Please try again later.");
    }
});
          
