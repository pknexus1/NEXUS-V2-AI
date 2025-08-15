const axios = require("axios");
const { Sticker } = require("wa-sticker-formatter");
const { cmd } = require("../command");

cmd({
    pattern: "emojimix",
    alias: ["mixemoji", "emoji-mix"],
    use: ".emojimix 😎+😂",
    desc: "Mix two emojis into a sticker.",
    category: "fun",
    react: "🎨",
    filename: __filename
},
async (conn, mek, m, { from, sender, args, reply }) => {
    try {
        if (!args[0] || !args[0].includes('+')) {
            return reply('❌ Usage: `.emojimix 😎+😂`');
        }

        const [emoji1, emoji2] = args[0].split('+');

        // Get encoded emojis
        const encodeEmoji = e => encodeURIComponent(e);

        // Build Google Emoji Kitchen URL pattern
        const url = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyASmjh9B9isZ9oa0_LsC6w7X8pxSPGzU&contentfilter=high&media_filter=png_transparent&component=emojikitchen&q=${encodeEmoji(emoji1)}_${encodeEmoji(emoji2)}`;

        const res = await axios.get(url);

        if (!res.data.results || res.data.results.length === 0) {
            return reply("❌ Could not find a mix for those emojis.");
        }

        const imageUrl = res.data.results[0].url;

        const sticker = new Sticker(imageUrl, {
            pack: "EmojiMix Pack",
            author: "PK-Tech",
            type: "full",
            categories: ["fun"],
        });

        const buffer = await sticker.toBuffer();
        await conn.sendMessage(from, { sticker: buffer }, { quoted: mek });

    } catch (error) {
        console.error("Error in emojimix:", error);
        reply("❌ Failed to mix emojis. Try different ones.");
    }
});
