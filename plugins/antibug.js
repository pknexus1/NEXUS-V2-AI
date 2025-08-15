const { cmd } = require('../command');

let antiBugEnabled = false;

cmd({
    pattern: "antibug",
    alias: ["bugblock", "lagblock"],
    use: ".antibug on/off",
    desc: "Toggle full Anti-Bug protection (delete + kick/block).",
    category: "security",
    react: "🛡️",
    filename: __filename
},
async (conn, mek, m, { from, args, sender, isGroup, isAdmins, isOwner, reply }) => {
    try {
        if (!isOwner) return reply("❌ Only bot owner can enable Anti-Bug.");

        const choice = args[0]?.toLowerCase();
        if (choice === "on") {
            antiBugEnabled = true;
            reply("✅ Anti-Bug protection is now *ENABLED* 🛡️");
        } else if (choice === "off") {
            antiBugEnabled = false;
            reply("❌ Anti-Bug protection is now *DISABLED* 🚫");
        } else {
            reply("ℹ️ Usage: `.antibug on` or `.antibug off`");
        }
    } catch (e) {
        console.error("Error in antibug command:", e);
        reply(`❌ ${e.message}`);
    }
});

// Listen to all incoming messages
cmd({
    on: "message",
    filename: __filename
},
async (conn, mek, m, { from, body, isGroup, sender, isBotAdmins }) => {
    try {
        if (!antiBugEnabled) return;

        const longText = body && body.length > 1500;
        const crashPatterns = /(‏‏|۝|۞|۩|𒀱|🇦🇫🇦🇫🇦🇫|🇮🇳🇮🇳🇮🇳)/g;

        if (longText || crashPatterns.test(body)) {
            console.log(`🚨 Bug detected from ${sender} in ${isGroup ? "group" : "private chat"}`);

            if (isGroup) {
                // Delete the bug message
                await conn.sendMessage(from, { delete: mek.key });

                // Kick sender if bot is admin
                if (isBotAdmins) {
                    await conn.groupParticipantsUpdate(from, [sender], "remove");
                    await conn.sendMessage(from, { text: `⚠️ ${sender} has been removed for sending bug messages.` });
                } else {
                    await conn.sendMessage(from, { text: "❌ Bot is not admin, can't remove member." });
                }
            } else {
                // In private chat → block sender
                await conn.updateBlockStatus(sender, "block");
                console.log(`🚫 Blocked ${sender} for sending bug in private chat`);
            }
        }
    } catch (e) {
        console.error("AntiBug detection error:", e);
    }
});
                                                       
