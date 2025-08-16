const { cmd, commands } = require('../command');

cmd({
    pattern: "menu",
    desc: "Display all bot commands in read-more style",
    category: "main",
    filename: __filename
},
async (conn, m, { from, reply }) => {
    try {
        // Fetch commands dynamically
        const allCommands = Object.keys(commands);
        if (!allCommands.length) return reply("❌ No commands found.");

        // Short command names like .play, .tagall, etc.
        const commandList = allCommands
            .map(c => `• ${c.startsWith('.') ? c : `.${c}`}`)
            .join('\n');

        // Add read-more character
        const readMore = "\u200B".repeat(4001);

        const menuMessage = `
🌟 *NEXUS-AI • Bot Menu* 🌟
──────────────────────
${commandList}
${readMore}
💬 Type command with prefix to use, e.g., *.play*.
        `.trim();

        await reply(menuMessage);

    } catch (e) {
        console.error("Menu Error:", e);
        reply("❌ Failed to fetch menu.");
    }
});
