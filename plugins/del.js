const { cmd } = require('../command');

cmd({
    pattern: "delete",
    alias: ["del", "remove"],
    use: '.delete (reply to a message)',
    desc: "Delete a message either for you or for everyone.",
    category: "main",
    react: "🗑️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply, sender }) => {
    try {
        if (!quoted) {
            return reply("❌ Please reply to the message you want to delete.");
        }

        // Ask for confirmation
        await conn.sendMessage(from, {
            text: `🗑️ *Delete Options*\n\n1️⃣ Delete for *you only*\n2️⃣ Delete for *everyone*\n\n_Reply with 1 or 2_`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });

        // Listen for the next reply from the same sender
        conn.ev.once('messages.upsert', async ({ messages }) => {
            const userResponse = messages[0];
            if (!userResponse.message?.conversation) return;
            const choice = userResponse.message.conversation.trim();

            if (choice === "1") {
                // Delete for me only
                await conn.sendMessage(from, {
                    delete: {
                        remoteJid: from,
                        fromMe: true,
                        id: quoted.key.id,
                        participant: quoted.key.participant || quoted.key.remoteJid
                    }
                });
                reply("✅ Message deleted *for you only*.");
            }
            else if (choice === "2") {
                // Delete for everyone
                await conn.sendMessage(from, {
                    delete: {
                        remoteJid: from,
                        fromMe: false,
                        id: quoted.key.id,
                        participant: quoted.key.participant || quoted.key.remoteJid
                    }
                });
                reply("✅ Message deleted *for everyone*.");
            }
            else {
                reply("❌ Invalid choice. Please type `1` or `2`.");
            }
        });

    } catch (e) {
        console.error("Error in delete command:", e);
        reply(`❌ Failed to delete message: ${e.message}`);
    }
});
