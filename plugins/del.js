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
async (conn, mek, m, { from, reply }) => {
    try {
        const quotedMsg = mek.message?.extendedTextMessage?.contextInfo;

        if (!quotedMsg || !quotedMsg.stanzaId) {
            return reply("❌ Please reply to the message you want to delete.");
        }

        await conn.sendMessage(from, {
            delete: {
                remoteJid: from,
                id: quotedMsg.stanzaId,
                fromMe: false,
                participant: quotedMsg.participant
            }
        });

    } catch (e) {
        console.error("Error in delete command:", e);
        reply(`❌ Failed to delete message: ${e.message}`);
    }
});
