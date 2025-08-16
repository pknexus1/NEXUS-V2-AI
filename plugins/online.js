const { cmd } = require('../command');

cmd({
    pattern: "online",
    desc: "Tag all online members in the group",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, groupMetadata, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");

        const metadata = await groupMetadata(from);
        const participants = metadata.participants;

        // Filter online only (presence = 'composing', 'recording', 'available')
        let onlineUsers = [];
        for (let user of participants) {
            const presence = conn.presence?.[from]?.[user.id] || {};
            if (presence.lastKnownPresence === 'available' || presence.lastKnownPresence === 'composing' || presence.lastKnownPresence === 'recording') {
                onlineUsers.push(user.id);
            }
        }

        if (onlineUsers.length === 0) {
            return reply("⚠️ No members are online right now.");
        }

        let text = `🟢 *Online Members Tag* 🟢\n\n`;
        text += onlineUsers.map((u, i) => `${i + 1}. @${u.split('@')[0]}`).join('\n');

        await conn.sendMessage(from, {
            text,
            mentions: onlineUsers
        }, { quoted: mek });
    } catch (e) {
        console.log("ONLINE CMD ERROR: ", e);
        reply("❌ Something went wrong while tagging online members.");
    }
});
