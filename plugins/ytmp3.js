const config = require('../config')
const { cmd } = require('../command')
const DY_SCRAP = require('@dark-yasiya/scrap')
const dy_scrap = new DY_SCRAP()

function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
}

cmd({
    pattern: "music",
    alias: ["mp9", "ytmp9"],
    react: "🎵",
    desc: "Download YouTube mp3",
    category: "download",
    use: ".music <text or yt-url>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide a query or YouTube URL!")

        let id = q.startsWith("https://") ? replaceYouTubeID(q) : null
        let videoData

        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q)
            if (!searchResults?.results?.length) return reply("❌ No results found!")
            videoData = searchResults.results[0]
            id = videoData.videoId
        } else {
            const searchResults = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`)
            if (!searchResults?.results?.length) return reply("❌ Failed to fetch video!")
            videoData = searchResults.results[0]
        }

        // fetch mp3 data
        const mp3Data = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`)
        if (!mp3Data?.result?.download?.url) return reply("❌ Failed to fetch audio link!")

        const { url, title, image, timestamp, ago, views, author } = videoData

        let info = `🍄 *SONG DOWNLOADER* 🍄\n\n`
        info += `🎵 *Title:* ${title || "Unknown"}\n`
        info += `⏳ *Duration:* ${timestamp || "Unknown"}\n`
        info += `👀 *Views:* ${views || "Unknown"}\n`
        info += `🌏 *Release Ago:* ${ago || "Unknown"}\n`
        info += `👤 *Author:* ${author?.name || "Unknown"}\n`
        info += `🖇 *Url:* ${url || "Unknown"}\n\n`
        info += `🔽 *Reply with your choice:*\n`
        info += `1.1 *Audio Type* 🎵\n`
        info += `1.2 *Document Type* 📁\n\n`
        info += `${config.FOOTER || "> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇxᴜꜱ-ᴀɪ*"}`

        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek })
        const messageID = sentMsg.key.id

        const listener = async (msgUpdate) => {
            try {
                const newMsg = msgUpdate?.messages?.[0]
                if (!newMsg?.message) return

                const body = newMsg.message.conversation 
                           || newMsg.message.extendedTextMessage?.text
                if (!body) return

                const isReplyToSentMsg = newMsg.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID
                if (!isReplyToSentMsg) return

                // detach listener
                conn.ev.off('messages.upsert', listener)

                let userReply = body.trim()
                let type

                if (userReply === "1.1") {
                    await reply("⏳ Processing audio...")
                    type = { audio: { url: mp3Data.result.download.url }, mimetype: "audio/mpeg" }
                } else if (userReply === "1.2") {
                    await reply("⏳ Processing document...")
                    type = {
                        document: { url: mp3Data.result.download.url },
                        fileName: `${title}.mp3`,
                        mimetype: "audio/mpeg",
                        caption: title
                    }
                } else {
                    return reply("❌ Invalid choice! Reply with 1.1 or 1.2.")
                }

                await conn.sendMessage(from, type, { quoted: mek })
                await reply("✅ Media upload successful ✅")

            } catch (err) {
                console.error(err)
                reply(`❌ Error while processing: ${err.message}`)
            }
        }

        conn.ev.on('messages.upsert', listener)

    } catch (err) {
        console.error(err)
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        reply(`❌ *An error occurred:* ${err.message || "Error!"}`)
    }
})
