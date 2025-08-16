const { cmd, commands } = require('../command');
const moment = require('moment-timezone');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "Display the rich Nexus-AI interactive menu",
    category: "main",
    filename: __filename
}, async (conn, m, { reply }) => {
    try {
        const dateNow = moment().tz('Africa/Nairobi').format('dddd, MMMM Do YYYY, HH:mm:ss');
        const upTime = runtime(process.uptime());
        const botName = "⚡ NEXUS-AI";
        const ownerName = "👑 PK-TECH";
        const totalCommands = Object.values(commands).length;

        // Group commands by category
        let categorized = {};
        for (let c of Object.values(commands)) {
            if (!categorized[c.category]) categorized[c.category] = [];
            categorized[c.category].push(c.pattern);
        }

        const readMore = '\u200B'.repeat(4001);

        // Build menu text with beautiful formatting
        let menuText = `
╭─⊷ *${botName} BOT MENU* ⊶
│
│ *📅 Date:* ${dateNow}
│ *⏳ Uptime:* ${upTime}
│ *👤 Owner:* ${ownerName}
│ *📊 Commands:* ${totalCommands}
│
╰───────────────────

${readMore}

╭─⊷ *📚 COMMAND CATEGORIES* ⊶
│
`;

        // Add categories with fancy formatting
        for (let category in categorized) {
            menuText += `│ *📌 ${category.charAt(0).toUpperCase() + category.slice(1)}*\n`;
            menuText += `│ ${categorized[category].map(cmd => `⦿ .${cmd}`).join("\n│ ")}\n│\n`;
        }

        menuText += `
╰───────────────────

╭─⊷ *💡 USAGE GUIDE* ⊶
│
│ *Example Commands:*
│ ⦿ .play [song name]
│ ⦿ .sticker [reply image]
│ ⦿ .ai [your question]
│
│ *Note:* Use prefix . before commands
│
╰───────────────────

✨ *Powered by ${botName}* ✨
🔗 *Follow us on:* https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x
        `;

        // Send menu image with caption
        await conn.sendMessage(m.chat, {
            image: { 
                url: "https://files.catbox.moe/u4l28f.jpg",
            },
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

        // Send audio introduction
        await conn.sendMessage(m.chat, {
            audio: { 
                url: "https://files.catbox.moe/63jz9o.mp3",
            },
            mimetype: "audio/mpeg",
            ptt: true,
            contextInfo: {
                externalAdReply: {
                    title: "NEXUS-AI BOT",
                    body: "Your Ultimate WhatsApp Assistant",
                    thumbnail: await getBuffer("https://files.catbox.moe/u4l28f.jpg"),
                    mediaType: 1,
                    mediaUrl: "",
                    sourceUrl: "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x"
                }
            }
        });

    } catch (e) {
        console.error("Menu Error:", e);
        reply("❌ Failed to display menu. Please try again later.");
    }
});
