const { cmd, commands } = require('../command');
const moment = require('moment-timezone');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "Display the rich Konde style menu",
    category: "main",
    filename: __filename
}, async (conn, m, { reply }) => {
    try {
        const dateNow = moment().tz('Africa/Nairobi').format('dddd, MMMM Do YYYY, HH:mm:ss');
        const upTime = runtime(process.uptime());
        const botName = "🤖 NEXUS-AI";
        const ownerName = "👑 PK-Tech";
        const totalCommands = Object.values(commands).length;

        // Group commands by category
        let categorized = {};
        for (let c of Object.values(commands)) {
            if (!categorized[c.category]) categorized[c.category] = [];
            categorized[c.category].push(c.pattern);
        }

        const readMore = '\u200B'.repeat(4001);

        // Build menu text
        let menuText = `
╭━━━〔 *${botName}* 〕━━━╮
│ 📅 Date: ${dateNow}
│ ⏳ Uptime: ${upTime}
│ 👤 Owner: ${ownerName}
│ 📌 Total Cmds: ${totalCommands}
╰━━━━━━━━━━━━━━━━━━━╯
${readMore}
`;

        for (let category in categorized) {
            menuText += `\n📂 *${category.toUpperCase()}*\n`;
            menuText += categorized[category].map(cmd => `> .${cmd}`).join("\n") + "\n";
        }

        menuText += `
────────────────────
💬 Example: > .play song name
────────────────────
✨ Powered by ${botName} ✨
        `;

        // 1️⃣ Send menu image with caption
        await conn.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/u4l28f.jpg" },
            caption: menuText.trim(),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363288304618280@newsletter",
                    newsletterName: "PK-XMD CHANNEL",
                    serverMessageId: -1
                }
            }
        }, { quoted: m });

        // 2️⃣ Send actual PTT music separately
        await conn.sendMessage(m.chat, {
            audio: { url: "https://files.catbox.moe/63jz9o.mp3" },
            mimetype: "audio/mpeg",
            ptt: true
        });

    } catch (e) {
        console.error("Menu Error:", e);
        reply("❌ Failed to fetch menu.");
    }
});
