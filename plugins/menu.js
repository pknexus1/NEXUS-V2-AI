const { cmd, commands } = require('../command');
const moment = require('moment-timezone');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "Display a beautiful and unique menu",
    category: "main",
    filename: __filename
}, async (conn, m, { reply }) => {
    try {
        const dateNow = moment().tz('Africa/Nairobi').format('dddd, MMMM Do YYYY, HH:mm:ss').toUpperCase();
        const upTime = runtime(process.uptime()).toUpperCase();
        const botName = "🤖 NEXUS-AI".toUpperCase();
        const ownerName = "👑 PK-TECH".toUpperCase();
        const totalCommands = Object.values(commands).length;

        // Random quotes for menu
        const quotes = [
            "✨ Keep smiling, life is beautiful!",
            "🚀 Code, create, conquer!",
            "💡 Innovation distinguishes the leader from the follower.",
            "🎯 Focus on progress, not perfection.",
            "🌟 Stay positive and keep moving forward."
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        // Group commands by category
        let categorized = {};
        for (let c of Object.values(commands)) {
            if (!categorized[c.category]) categorized[c.category] = [];
            categorized[c.category].push(c.pattern);
        }

        const readMore = '\u200B'.repeat(4001);

        // Build menu header
        let menuText = `
╔═══════════════════════╗
║      ${botName}       
║───────────────────────
║ 📅 DATE: ${dateNow}
║ ⏳ UPTIME: ${upTime}
║ 👤 OWNER: ${ownerName}
║ 📌 TOTAL COMMANDS: ${totalCommands}
╚═══════════════════════╝
${readMore}
`;

        // Build command list with spacing and stars
        for (let category in categorized) {
            menuText += `\n🌟 *${category.toUpperCase()}*\n\n`;
            const cmds = categorized[category].map(cmd => `★ * . ${cmd} *`).join("\n\n");
            const midIndex = Math.floor(cmds.split("\n\n").length / 2);
            const cmdsArray = cmds.split("\n\n");
            
            // Insert separator in middle
            cmdsArray.splice(midIndex, 0, "-----||-----||-----||-----");
            menuText += cmdsArray.join("\n\n") + "\n\n";
        }

        // Add random quote at bottom
        menuText += `
────────────────────────────
💬 Quote: "${randomQuote}"
────────────────────────────
✨ POWERED BY PK-TECH ✨
`;

        // Send menu image with caption & context info
        await conn.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/u4l28f.jpg" },
            caption: menuText.trim(),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363288304618280@newsletter",
                    newsletterName: "PK-TECH CHANNEL",
                    serverMessageId: -1
                }
            }
        }, { quoted: m });

        // Send PTT music separately
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
            
