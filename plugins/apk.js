const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "apk",
    alias: ["app", "playstore"],
    react: "📦",
    desc: "Download APK from Playstore using BK9 API",
    category: "download",
    use: ".apk <app name>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide an app name to search.");

        // Search app from BK9 API
        let searchRes = await axios.get(`https://bk9.fun/search/apk?q=${encodeURIComponent(q)}`);
        let searchData = searchRes.data;

        if (!searchData.BK9 || searchData.BK9.length === 0) {
            return reply("❌ No app found with that name, try again.");
        }

        // Fetch details for first result
        let appId = searchData.BK9[0].id;
        let detailsRes = await axios.get(`https://bk9.fun/download/apk?id=${appId}`);
        let app = detailsRes.data.BK9;

        if (!app || !app.dllink) {
            return reply("⚠️ Unable to fetch APK link, try again later.");
        }

        // Caption
        let caption = `📦 *APK Downloader*

📝 *Name:* ${app.name}
📂 *Size:* ${app.size || "Unknown"}
⬇️ *Download Link:* ${app.dllink}

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
                    mediaType: 1,
                    thumbnailUrl: app.thumbnail || "https://telegra.ph/file/6b6d8a63b8ea2.png",
                    sourceUrl: "https://whatsapp.com/channel/0029VatOy2EAzNc2WcShQw1j",
                    mediaUrl: "https://whatsapp.com/channel/0029VatOy2EAzNc2WcShQw1j",
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("APK Download Error:", err);
        reply("❌ APK download failed. Please try again later.");
    }
});
