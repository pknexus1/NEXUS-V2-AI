const { cmd } = require('../command');

cmd({
  pattern: "online",
  desc: "Tag all online members in the group.",
  category: "group",
  filename: __filename
}, async (conn, m, { from, isGroup, groupMetadata, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command only works in groups.");

    let metadata = await groupMetadata(from);
    let participants = metadata.participants;

    // Collect online users from presence data
    let onlineMembers = [];
    for (let user of participants) {
      let pres = conn.presence?.[from]?.[user.id];
      if (pres && pres.lastKnownPresence !== "unavailable") {
        onlineMembers.push(user.id);
      }
    }

    if (onlineMembers.length === 0) {
      return reply("📵 No members are currently online.");
    }

    await conn.sendMessage(from, {
      text: `👥 Online members:\n\n${onlineMembers.map(u => `@${u.split('@')[0]}`).join(' ')}`,
      mentions: onlineMembers
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    reply("❌ Something went wrong while tagging online members.");
  }
});
