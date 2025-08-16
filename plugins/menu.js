const { cmd, commands } = require('../command');
const moment = require('moment-timezone');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "Show Nexus-AI Command Dashboard",
    category: "main",
    filename: __filename
}, async (conn, m, { reply }) => {
    try {
        const dateNow = moment().tz('Africa/Nairobi').format('ddd, MMM D YYYY • h:mm A');
        const upTime = runtime(process.uptime());
        const botName = "✨ NEXUS-AI ✨";
        const ownerName = "👑 PK-TECH";
        const totalCommands = Object.values(commands).length;

        // Group commands by category
        let categorized = {};
        for (let c of Object.values(commands)) {
            if (!categorized[c.category]) categorized[c.category] = [];
            categorized[c.category].push(c.pattern);
        }

        // Create beautiful menu with gradient effect
        let menuText = `
╭── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╮
       ${botName}
╰── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╯

📅 ${dateNow}
⏱ ${upTime}
👤 ${ownerName}
📊 ${totalCommands} Commands

╭── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╮
       COMMAND LIST
╰── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╯
`;

        // Add commands with beautiful formatting
        for (let category in categorized) {
            menuText += `\n┌  *${category.toUpperCase()}*\n`;
            menuText += categorized[category].map(cmd => `│ ➤ ${cmd}`).join("\n");
            menuText += `\n└───────────────\n`;
        }

        menuText += `
╭── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╮
 Example: .play faded
╰── ⋅ ⋅ ── ✩ ── ⋅ ⋅ ──╯

🔗 Updates: wa.me/channel
`;

        // Send with enhanced image
        await conn.sendMessage(m.chat, {
            image: { 
                url: "https://files.catbox.moe/u4l28f.jpg",
            },
            caption: menuText.trim(),
            contextInfo: {
                externalAdReply: {
                    title: "NEXUS-AI COMMANDS",
                    body: "Your Premium WhatsApp Assistant",
                    thumbnail: await getBuffer("https://files.catbox.moe/u4l28f.jpg"),
                    mediaType: 1,
                    sourceUrl: "https://wa.me/channel"
                }
            }
        }, { quoted: m });

        // Send enhanced audio
        await conn.sendMessage(m.chat, {
            audio: { 
                url: "https://files.catbox.moe/63jz9o.mp3",
            },
            mimetype: "audio/mpeg",
            ptt: true,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        });

    } catch (e) {
        console.error("Menu Error:", e);
        reply("⚠️ Menu system is currently unavailable. Please try again later.");
    }
});
