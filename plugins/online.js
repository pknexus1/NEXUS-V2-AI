// online.js
const { cmd } = require('../command');

// object ya kudumpia data za active users
let onlineUsers = {};

// Listener ya presence update
module.exports = (conn) => {
  conn.ev.on('presence.update', (json) => {
    try {
      let jid = json.id;
      let pres = json.presences ? Object.values(json.presences)[0] : null;
      if (pres && pres.lastKnownPresence === 'available') {
        onlineUsers[jid] = Date.now();
      }
    } catch (e) {
      console.error("Presence error:", e);
    }
  });
};

// Command yenyewe
cmd({
  pattern: "online",
  desc: "Check who is active recently.",
  category: "group",
  filename: __filename
}, async (conn, m, { from, isGroup, participants, reply }) => {
  if (!isGroup) return reply("❌ This command works in groups only.");

  let now = Date.now();
  let active = [];

  for (let p of participants) {
    if (onlineUsers[p.id] && (now - onlineUsers[p.id]) < 5 * 60 * 1000) { // last 5 min
      active.push("• @" + p.id.split("@")[0]);
    }
  }

  if (active.length === 0) {
    return reply("🚫 No one has been online recently (last 5 mins).");
  }

  await conn.sendMessage(from, {
    text: `✅ Active members (last 5 mins):\n\n${active.join("\n")}`,
    mentions: participants.map(p => p.id)
  }, { quoted: m });
});
    
