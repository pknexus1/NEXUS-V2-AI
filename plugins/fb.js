const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "fb",
    alias: ["facebook", "fbvid", "fbdown"],
    use: '.fb <facebook-link>',
    desc: "Download videos from Facebook.",
    category: "downloader",
    react: "📹",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, args }) => {
    try {
        const reactionEmojis = ['📹', '🎥', '📺', '🎬', '🔽', '💾'];
        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

        if (!args[0]) {
            return reply("❌ Please provide a Facebook video link.\n\nExample: `.fb https://www.facebook.com/watch/?v=123456789`");
        }

        const url = args[0];

        // API for Facebook downloader (no login)
        const apiUrl = `https://api.dlydown.com/api/fb?url=${encodeURIComponent(url)}`;

        const { data } = await axios.get(apiUrl);

        if (!data || !data.status || !data.url) {
            return reply("❌ Failed to fetch video. Please check the link and try again.");
        }

        // Send reaction
        await conn.sendMessage(from, {
            react: { text: reactionEmoji, key: mek.key }
        });

        // Send video
        await conn.sendMessage(from, {
            video: { url: data.url },
            caption: `✅ *Facebook Video Downloaded*\n\n📹 Quality: ${data.quality || 'Unknown'}\n🔗 Source: ${url}`
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in fb command:", e);
        reply(`❌ Could not download Facebook video: ${e.message}`);
    }
});
