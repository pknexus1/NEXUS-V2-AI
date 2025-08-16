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
            return reply("❌ Please provide an app name to search.\n\nExample: .apk WhatsApp");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // Search from API
        const res = await axios.get(`https://apk-api.vercel.app/api/aptoide/search?query=${encodeURIComponent(q)}`);
        if (!res.data || res.data.length === 0) {
            return reply("⚠️ No results found. Try another app.");
        }

        const app = res.data[0]; // First result
        let caption = `📥 *APK Downloader*\n\n`;
        caption += `📌 Name: ${app.name}\n`;
        caption += `📝 Package: ${app.package}\n`;
        caption += `📦 Version: ${app.last_version || "N/A"}\n`;
        caption += `⚖️ Size: ${app.size || "Unknown"}\n`;
        caption += `🔗 Link: ${app.dllink}\n\n`;
        caption += `✅ Powered by NEXUS-AI`;

        await conn.sendMessage(from, {
            image: { url: app.icon },
            caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363288304618280@newsletter",
                    newsletterName: "NEXUS-AI Updates",
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: app.name,
                    body: "Tap to download",
                    thumbnailUrl: app.icon,
                    sourceUrl: app.dllink,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });

        // Send APK File
        await conn.sendMessage(from, {
            document: { url: app.dllink },
            mimetype: "application/vnd.android.package-archive",
            fileName: `${app.name}.apk`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363288304618280@newsletter",
                    newsletterName: "NEXUS-AI Updates",
                    serverMessageId: 144
                }
            }
        });

    } catch (e) {
        console.error(e);
        reply("❌ Failed to fetch APK. Please try again later.");
    }
});
