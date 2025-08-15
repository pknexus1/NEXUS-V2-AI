const { cmd } = require('../command');

let antiBugEnabled = false;

cmd({
    pattern: "antibug",
    alias: ["bugblock", "lagblock"],
    use: ".antibug on/off",
    desc: "Toggle Anti-Bug reaction mode.",
    category: "security",
    react: "🛡️",
    filename: __filename
},
async (conn, mek, m, { from, args, sender, isGroup, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isAdmins) return reply("❌ Only group admins can enable Anti-Bug.");

        const choice = args[0]?.toLowerCase();
        if (choice === "on") {
            antiBugEnabled = true;
            reply("✅ Anti-Bug reaction is now *ENABLED* 🛡️");
        } else if (choice === "off") {
            antiBugEnabled = false;
            reply("❌ Anti-Bug reaction is now *DISABLED* 🚫");
        } else {
            reply("ℹ️ Usage: `.antibug on` or `.antibug off`");
        }
    } catch (e) {
        console.error("Error in antibug command:", e);
        reply(`❌ ${e.message}`);
    }
});

// Listen to all incoming messages for bug detection
cmd({
    on: "message",
    filename: __filename
},
async (conn, mek, m, { from, body, isGroup }) => {
    try {
        if (!antiBugEnabled || !isGroup) return;

        // Bug detection patterns
        const longText = body && body.length > 1500;
        const crashPatterns = /(‏‏|۝|۞|۩|𒀱|🇦🇫🇦🇫🇦🇫|🇮🇳🇮🇳🇮🇳)/g;

        if (longText || crashPatterns.test(body)) {
            await conn.sendMessage(from, {
                react: { text: "⚠️", key: mek.key } // Just react, no reply
            });
        }
    } catch (e) {
        console.error("AntiBug detection error:", e);
    }
});
    
