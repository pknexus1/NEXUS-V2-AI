const { cmd } = require('../command');

cmd({
    pattern: "delete",
    alias: ["del", "remove"],
    use: '.delete (reply to a message)',
    desc: "Delete a message for you or for everyone.",
    category: "main",
    react: "🗑️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply, sender, isGroup }) => {
    try {
        if (!quoted) {
            return reply("❌ Please reply to the message you want to delete.");
        }

        // Ask user for choice
        await conn.sendMessage(from, {
            text: `🗑️ *Delete Options*\n\n1️⃣ Delete for *you only*\n2️⃣ Delete for *everyone*`,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });

        // Wait for the same user to reply in same chat
        const collector = m.chat;
        const filter = (msg) => {
            const text = msg.message?.conversation?.trim();
            return msg.key.remoteJid === from && msg.key.participant === sender && (text === "1" || text === "2");
        };

        const [response] = await conn.awaitMessages(from, filter, { max: 1, time: 15000 });

        if (!response) return reply("⌛ Timed out. Please try again.");

        const choice = response.message.conversation.trim();

        if (choice === "1") {
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

    } catch (e) {
        console.error("Error in delete command:", e);
        reply(`❌ Failed to delete message: ${e.message}`);
    }
});
