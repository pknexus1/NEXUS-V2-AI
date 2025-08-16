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

        // Send menu WITH image + audio + contextInfo
        await conn.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/u4l28f.jpg" }, // Your menu image
            caption: menuText.trim(),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "🎵 Menu Music 🎵",
                    body: "Powered by PK-XMD",
                    mediaType: 2,
                    mediaUrl: "https://files.catbox.moe/63jz9o.mp3",
                    sourceUrl: "https://whatsapp.com/channel/0029VbAuCjELtOj5n8Lv9h3d",
                    showAdAttribution: true
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363288304618280@newsletter",
                    newsletterName: "PK-XMD CHANNEL",
                    serverMessageId: -1
                }
            }
        }, { quoted: m });

    } catch (e) {
        console.error("Menu Error:", e);
        reply("❌ Failed to fetch menu.");
    }
});
            
