const { cmd, commands } = require('../command');
const moment = require('moment-timezone');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "Show Nexus-AI command list",
    category: "main",
    filename: __filename
}, async (conn, m, { reply }) => {
    try {
        // Basic info
        const time = moment().tz('Africa/Nairobi').format('HH:mm:ss');
        const date = moment().tz('Africa/Nairobi').format('DD/MM/YYYY');
        
        // Group commands
        const categories = {};
        Object.values(commands).forEach(cmd => {
            if (!categories[cmd.category]) categories[cmd.category] = [];
            categories[cmd.category].push(cmd.pattern);
        });

        // Minimalist menu design
        let menu = `
┌───────────────
│  ⚡ *NEXUS-AI*  
├───────────────
│  🕒 ${time}  
│  📅 ${date}  
├───────────────
`.trim();

        // Add commands
        Object.entries(categories).forEach(([category, cmds]) => {
            menu += `\n│ *${category.toUpperCase()}*\n`;
            cmds.forEach(cmd => {
                menu += `│ ◦ ${cmd}\n`;
            });
            menu += `├───────────────`;
        });

        // Simple footer
        menu += `
└───────────────
`.trim();

        // Send as message
        await conn.sendMessage(m.chat, { 
            text: menu,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: m });

    } catch (error) {
        console.error("Menu error:", error);
        await reply("❌ Error loading command list");
    }
});
