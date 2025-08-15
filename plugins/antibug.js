const { cmd } = require('../command');

let antiBugEnabled = false;

cmd({
    pattern: "antibug",
    alias: ["bugblock", "lagblock"],
    use: ".antibug on/off",
    desc: "Toggle Anti-Bug protection for group.",
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

// Listen to all incoming messages for bug detection
cmd({
    on: "message", // Listen to all messages
    filename: __filename
},
async (conn, mek, m, { from, body, isGroup, sender, reply }) => {
    try {
        if (!antiBugEnabled || !isGroup) return;

        // Basic Bug Detection Rules
        const longText = body && body.length > 1500; // Huge text = possible bug
        const crashPatterns = /(‏‏|۝|۞|۩|𒀱|🇦🇫🇦🇫🇦🇫|🇮🇳🇮🇳🇮🇳)/g; // Known bug symbols

        if (longText || crashPatterns.test(body)) {
            await conn.sendMessage(from, { delete: mek.key }); // Delete the message
            await reply(`⚠️ *Bug message detected and removed!*`);
            console.log(`Blocked bug from ${sender}`);
        }
    } catch (e) {
        console.error("AntiBug detection error:", e);
    }
});
