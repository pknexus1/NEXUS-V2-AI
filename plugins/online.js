const { cmd } = require('../command');

cmd({
    pattern: "online",
    desc: "Check who is online in the group",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, participants, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("❌ Failed to fetch group info.");

        let groupName = groupInfo.subject;
        let totalMembers = participants.length;

        let onlineList = [];
        for (let member of participants) {
            try {
                let pres = await conn.fetchPresence(member.id);
                if (pres === "available" || pres === "composing" || pres === "recording") {
                    onlineList.push(`🟢 @${member.id.split('@')[0]}`);
                }
            } catch {
                continue;
            }
        }

        let teks = `📡 *Online Members in ${groupName}*\n\n`;
        teks += onlineList.length > 0 
            ? onlineList.join("\n") 
            : "No one is online right now 🚫";

        await conn.sendMessage(from, {
            text: teks,
            mentions: participants.map(a => a.id),
            contextInfo: {
                mentionedJid: participants.map(a => a.id),
                externalAdReply: {
                    title: `👥 Online Status`,
                    body: `NEXUS-AI • Checking active members`,
                    thumbnailUrl: "https://files.catbox.moe/qoupjv.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x"
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Online Command Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
