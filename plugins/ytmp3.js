const { cmd } = require('../command');

cmd({
    pattern: "dualplay",
    desc: "Send two songs together with button options",
    category: "music",
    filename: __filename
},
async (conn, m, { from, reply }) => {
    try {
        // Hapa unaweza hardcode nyimbo mbili au uweke search logic ya YouTube
        let song1 = {
            title: "🎶 Song One",
            url: "https://example.com/song1.mp3"
        };

        let song2 = {
            title: "🎶 Song Two",
            url: "https://example.com/song2.mp3"
        };

        // Buttons za kuskia moja moja
        const buttons = [
            { buttonId: 'song1', buttonText: { displayText: song1.title }, type: 1 },
            { buttonId: 'song2', buttonText: { displayText: song2.title }, type: 1 },
            { buttonId: 'both', buttonText: { displayText: "🎧 Play Both" }, type: 1 }
        ];

        await conn.sendMessage(from, {
            text: "Choose a song to play 🎵",
            footer: "Powered by NEXUS-AI",
            buttons,
            headerType: 2
        }, { quoted: m });

        // Handling button replies
        conn.ev.on('messages.upsert', async (msg) => {
            let buttonMessage = msg.messages[0];
            if (!buttonMessage.message) return;
            if (buttonMessage.key.remoteJid !== from) return;

            let btn = buttonMessage.message?.buttonsResponseMessage?.selectedButtonId;

            if (btn === 'song1') {
                await conn.sendMessage(from, { audio: { url: song1.url }, mimetype: 'audio/mp4', ptt: false }, { quoted: buttonMessage });
            } else if (btn === 'song2') {
                await conn.sendMessage(from, { audio: { url: song2.url }, mimetype: 'audio/mp4', ptt: false }, { quoted: buttonMessage });
            } else if (btn === 'both') {
                await conn.sendMessage(from, { audio: { url: song1.url }, mimetype: 'audio/mp4', ptt: false });
                await conn.sendMessage(from, { audio: { url: song2.url }, mimetype: 'audio/mp4', ptt: false });
            }
        });

    } catch (e) {
        console.error(e);
        reply("❌ Failed to send songs.");
    }
});
                   
