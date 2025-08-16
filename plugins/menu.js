const { cmd, commands } = require('../command');
const moment = require('moment-timezone');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "Display full Konde style menu",
    category: "main",
    filename: __filename
}, async (conn, m, { from, reply }) => {
    try {
        const dateNow = moment().tz('Africa/Nairobi').format('dddd, MMMM Do YYYY, HH:mm:ss');
        const upTime = runtime(process.uptime());
        const botName = "NEXUS-AI";
        const ownerName = "PK-Tech";
        const totalCommands = Object.values(commands).length;

        // Get command names correctly
        const commandList = Object.values(commands)
            .map(c => `.${c.pattern}`)
            .join('\n');

        const readMore = '\u200B'.repeat(4001);

        const menuMessage = `
🌟 *${botName} MENU* 🌟
────────────────────
📅 Date: ${dateNow}
⚡ Uptime: ${upTime}
👤 Owner: ${ownerName}
📌 Total Commands: ${totalCommands}
────────────────────
${commandList}
${readMore}
💬 Type the command with prefix to use, e.g., *.play*
────────────────────
        `.trim();

        await reply(menuMessage);

    } catch (e) {
        console.error("Menu Error:", e);
        reply("❌ Failed to fetch menu.");
    }
});
