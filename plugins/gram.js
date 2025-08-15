const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

cmd({
    pattern: "ig",
    alias: ["instagram", "igvid", "igdl"],
    use: '.ig <instagram-link>',
    desc: "Download videos or images from Instagram posts/reels.",
    category: "downloader",
    react: "📷",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) {
            return reply("❌ Please provide an Instagram URL.\nExample: `.ig https://www.instagram.com/reel/...`");
        }

        const url = args[0];
        if (!url.includes('instagram.com')) {
            return reply("❌ That is not a valid Instagram link.");
        }

        // Send "loading" reaction
        await conn.sendMessage(from, { react: { text: '🔄', key: mek.key } });

        // API request
        const apiUrl = `https://insta-dl.hazex.workers.dev/?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || data.error || !data.result || !data.result.url) {
            return reply("⚠️ API did not return a valid media. Please check the link.");
        }

        const mediaUrl = data.result.url;
        const extension = data.result.extension || 'mp4';

        // Prepare temp file
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        const tempFile = path.join(tmpDir, `ig_${Date.now()}.${extension}`);

        // Download the media
        const mediaResponse = await axios({
            method: 'GET',
            url: mediaUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(tempFile);
        mediaResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Send media to user
        if (extension === 'mp4') {
            await conn.sendMessage(from, {
                video: { url: tempFile },
                mimetype: "video/mp4",
                caption: "📥 Downloaded from Instagram"
            }, { quoted: mek });
        } else {
            await conn.sendMessage(from, {
                image: { url: tempFile },
                caption: "📥 Downloaded from Instagram"
            }, { quoted: mek });
        }

        // Delete temp file
        fs.unlinkSync(tempFile);

    } catch (error) {
        console.error("Instagram downloader error:", error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});
