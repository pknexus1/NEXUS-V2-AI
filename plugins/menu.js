const { cmd, commands } = require('../command');
const moment = require('moment-timezone');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "Display the Konde style menu",
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

        // Build menu
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
            menuText += categorized[category].map(cmd => `   ✦ .${cmd}`).join("\n") + "\n";
        }

        menuText += `
────────────────────
💬 Example: *.play song name*
────────────────────
✨ Powered by ${botName} ✨
        `;

        // Send with contextInfo (View Channel)
        await conn.sendMessage(m.chat, {
            text: menuText.trim(),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363288304618280@newsletter", // your channel JID
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
