const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "wstalk",
    alias: ["channelstalk", "chinfo"],
    desc: "Fetch WhatsApp channel details",
    category: "utility",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) {
            return reply("❌ Please provide a WhatsApp channel link.\n\n📌 *Example:* `.wstalk https://whatsapp.com/channel/0029VatOy2EAzNc2WcShQw1j`");
        }

        // Extract channel ID from URL
        const channelId = args[0].match(/channel\/([0-9A-Za-z]+)/i)?.[1];
        if (!channelId) {
            return reply("❌ Invalid WhatsApp channel URL. Please check and try again.");
        }

        // Fetch channel data
        const apiUrl = `https://itzpire.com/stalk/whatsapp-channel?url=https://whatsapp.com/channel/${channelId}`;
        const response = await axios.get(apiUrl);
        const data = response.data.data;

        // Clean JID
        const cleanJid = (data.jid || "")
            .trim()
            .replace(/@newsletterr$/, "@newsletter");

        // Format message
        const channelInfo = `
╭━━━〔  *📢 WhatsApp Channel Info*  〕━━━┈⊷
┃ 🏷️ *Title:* ${data.title}
┃ 👥 *Followers:* ${data.followers}
┃ 📝 *Description:* ${data.description || "No description available."}
┃ 🆔 *Channel JID:* ${cleanJid || "Not available"}
┃ 🔗 *Link:* https://whatsapp.com/channel/${channelId}
╰━━━━━━━━━━━━━━━━━━━━━━┈⊷
> 🤖 Powered by NEXUS-AI | Credits: pkdriller
        `.trim();

        // Send with image + context
        await conn.sendMessage(from, {
            image: { url: data.img },
            caption: channelInfo,
            contextInfo: {
                mentionedJid: [cleanJid],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: cleanJid,
                    newsletterName: data.title,
                    serverMessageId: 146
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in wstalk command:", e);
        reply(`❌ Error: ${e.response?.data?.message || e.message}`);
    }
});
