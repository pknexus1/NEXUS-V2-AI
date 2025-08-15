const { cmd } = require('../command');

cmd({
    pattern: "delete",
    alias: ["del", "remove"],
    use: '.delete (reply to a message)',
    desc: "Delete a message from everyone.",
    category: "main",
    react: "🗑️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Must be used by replying to a message
        if (!quoted) {
            return reply("❌ Please reply to the message you want to delete.");
        }

        await conn.sendMessage(from, {
            delete: {
                remoteJid: from,
                fromMe: false, // delete for everyone
                id: quoted.key.id,
                participant: quoted.key.participant || quoted.key.remoteJid
            }
        });

        reply("✅ Message deleted for everyone.");
    } catch (e) {
        console.error("Error in delete command:", e);
        reply(`❌ Failed to delete message: ${e.message}`);
    }
});
