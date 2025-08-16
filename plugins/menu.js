const { cmd, commands } = require('../command');
const moment = require('moment-timezone');
const { runtime, getBuffer } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "Show Nexus-AI interactive command menu",
    category: "main",
    filename: __filename
}, async (conn, m, { reply }) => {
    try {
        // Get info
        const date = moment().tz('Africa/Nairobi').format('ddd, MMM D YYYY, h:mm A');
        const uptime = runtime(process.uptime());
        const totalCmds = Object.values(commands).length;
        
        // Group commands
        const categories = {};
        Object.values(commands).forEach(cmd => {
            if (!categories[cmd.category]) categories[cmd.category] = [];
            categories[cmd.category].push(cmd.pattern);
        });

        // Create beautiful menu
        let menu = `
╔════════════════════╗
║   🚀 *NEXUS-AI* 🚀   ║
╠════════════════════╣
║  📅 ${date}
║  ⏱️ ${uptime}
║  📊 ${totalCmds} Commands
╠════════════════════╣
║                                                    ║
║      *✨ BOT FEATURES* ✨      ║
║                                                    ║
║  • AI Chat • Stickers • Downloads  ║
║  • Games • Tools • Utilities       ║
║                                                    ║
╠════════════════════╣
`.trim();

        // Add commands
        Object.entries(categories).forEach(([category, cmds]) => {
            menu += `\n║ *${category.toUpperCase()}* \n`;
            menu += `║ ${cmds.map(c => `⦿ ${c}`).join('  ')}\n`;
        });

        // Footer
        menu += `
╠════════════════════╣
║ *🔹 TIP:* Use .help <cmd> for   ║
║ details about any command       ║
║                                                    ║
║ *Example:* .play faded          ║
║           .sticker (reply)      ║
║                                                    ║
╚════════════════════╝
🌟 *Powered by PK-Tech* 🌟
📢 *Updates:* wa.me/yourchannel
`.trim();

        // Send with image
        await conn.sendMessage(m.chat, {
            image: {
                url: "https://i.imgur.com/8KQ7X9A.jpg" // Modern tech-themed image
            },
            caption: menu,
            contextInfo: {
                externalAdReply: {
                    title: "NEXUS-AI COMMANDS",
                    body: "Your Ultimate WhatsApp Assistant",
                    thumbnail: await getBuffer("https://i.imgur.com/8KQ7X9A.jpg"),
                    sourceUrl: "https://wa.me/yourchannel"
                }
            }
        }, { quoted: m });

        // Send audio intro
        await conn.sendMessage(m.chat, { 
            audio: { 
                url: "https://example.com/intro.mp3" 
            },
            mimetype: "audio/mpeg",
            ptt: true
        });

    } catch (error) {
        console.error("Menu error:", error);
        await reply("❌ Failed to load menu. Please try again later.");
    }
});
