const axios = require('axios');
const fs = require('fs');
const path = require('path');
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
        if (!args[0]) {
            return reply("❌ Please provide a Facebook video URL.\nExample: `.fb https://www.facebook.com/...`");
        }

        const url = args[0];
        if (!url.includes('facebook.com')) {
            return reply("❌ That is not a valid Facebook link.");
        }

        // Send loading reaction
        await conn.sendMessage(from, {
            react: { text: '🔄', key: mek.key }
        });

        // Fetch video data from API
        const apiURL = `https://tcs-demonic2.vercel.app/api/fbdownloader?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiURL);
        const data = response.data;

        if (!data || !data.result || !data.result.sd || data.result.sd === "") {
            return reply("⚠️ API did not return a valid video. Please try again later!");
        }

        const fbvid = data.result.sd;
        if (!fbvid) {
            return reply("⚠️ No valid video found. Please check the link.");
        }

        // Create temp directory
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        // Temp file path
        const tempFile = path.join(tmpDir, `fb_${Date.now()}.mp4`);

        // Download video
        const videoResponse = await axios({
            method: 'GET',
            url: fbvid,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(tempFile);
        videoResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Send video
        await conn.sendMessage(from, {
            video: { url: tempFile },
            mimetype: "video/mp4",
            caption: "📥 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗱 𝗕𝘆 𝐒𝐀𝐌𝐒𝐔𝐍𝐆_𝐗𝐌𝐃"
        }, { quoted: mek });

        // Clean up
        fs.unlinkSync(tempFile);

    } catch (error) {
        console.error("Error in Facebook command:", error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});
