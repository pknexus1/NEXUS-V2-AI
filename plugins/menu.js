const { cmd, commands } = require('../command');
const moment = require('moment-timezone');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "Display the Konde style menu",
    category: "main",
    filename: __filename
}, async (conn, m, { reply, from }) => {
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
            menuText += categorized[category].map(cmd => `> .${cmd}`).join("\n") + "\n";
        }

        menuText += `
────────────────────
💬 Example: > .play song name
────────────────────
✨ Powered by ${botName} ✨
        `;

        // Tuma menu kama text
        await conn.sendMessage(m.chat, {
            text: menuText.trim()
        }, { quoted: m });

        // Tuma wimbo (weka link yako ya audio hapa)
        await conn.sendMessage(m.chat, {
            audio: { url: "https://files.catbox.moe/63jz9o.mp3" }, // badilisha na link ya wimbo unataka
            mimetype: "audio/mpeg",
            ptt: false, // true kama unataka iwe voice note
            fileName: "menu-song.mp3"
        }, { quoted: m });

    } catch (e) {
        console.error("Menu Error:", e);
        reply("❌ Failed to fetch menu.");
    }
});
        
