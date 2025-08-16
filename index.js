const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  isJidBroadcast,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID, makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys')

const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const config = require('./config')
const GroupEvents = require('./lib/groupevents');
const qrcode = require('qrcode-terminal')
const StickersTypes = require('wa-sticker-formatter')
const util = require('util')
const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
const FileType = require('file-type');
const axios = require('axios')
const { File } = require('megajs')
const { fromBuffer } = require('file-type')
const bodyparser = require('body-parser')
const os = require('os')
const Crypto = require('crypto')
const path = require('path')
const prefix = config.PREFIX

const ownerNumber = ['254799056874']

// ================== CHANNEL CONFIG ==================
const CHANNEL_JID = "120363288304618280@newsletter";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x";
// ================== END CHANNEL CONFIG ==================

// ================== AUTO BIO CONFIG ==================
const updateBio = async (conn) => {
  try {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    
    const bioQuotes = [
      `🕒 NEXUS-AI | Live: ${timeString} | AI-Powered`,
      `⚡ NEXUS-AI | Live: ${timeString} | Always Active`,
      `🌐 NEXUS-AI | Live: ${timeString} | 24/7 Online`,
      `🚀 NEXUS-AI | Live: ${timeString} | Cutting-Edge Tech`,
      `🔮 NEXUS-AI | Live: ${timeString} | Future Ready`
    ];
    
    const newBio = bioQuotes[Math.floor(Math.random() * bioQuotes.length)];
    await conn.updateProfileStatus(newBio);
    console.log(`Bio updated to: ${newBio}`);
  } catch (error) {
    console.error('Error updating bio:', error);
  }
};
// ================== END AUTO BIO ==================

const tempDir = path.join(os.tmpdir(), 'cache-temp')
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
}

const clearTempDir = () => {
    fs.readdir(tempDir, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(tempDir, file), err => {
                if (err) throw err;
            });
        }
    });
}

// Clear the temp directory every 5 minutes
setInterval(clearTempDir, 5 * 60 * 1000);

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
const sessdata = config.SESSION_ID.replace("nexus~", '');
const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
filer.download((err, data) => {
if(err) throw err
fs.writeFile(__dirname + '/sessions/creds.json', data, () => {
console.log("Session downloaded ✅")
})})}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;
  
//=============================================
  
async function connectToWA() {
  console.log("Connecting to WhatsApp ⏳️...");
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
  var { version } = await fetchLatestBaileysVersion()
  
  const conn = makeWASocket({
          logger: P({ level: 'silent' }),
          printQRInTerminal: false,
          browser: Browsers.macOS("Firefox"),
          syncFullHistory: true,
          auth: state,
          version
          })
      
  conn.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect } = update
  if (connection === 'close') {
  if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
  connectToWA()
  }
  } else if (connection === 'open') {
  console.log('🧬 Installing Plugins')
  const path = require('path');
  fs.readdirSync("./plugins/").forEach((plugin) => {
  if (path.extname(plugin).toLowerCase() == ".js") {
  require("./plugins/" + plugin);
  }
  });
  console.log('Plugins installed successful ✅')
  console.log('Bot connected to whatsapp ✅')
  
  // Start auto-bio feature with live time updates
  updateBio(conn);
  setInterval(() => updateBio(conn), 1000); // Update every second
  
  // Unique connection message with channel info
  const now = new Date();
  const launchTime = now.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  
  const up = `
╔════════════════════════╗
║   🚀 *NEXUS-AI ACTIVATED* 🚀   ║
╠════════════════════════╣
║⏰ *Launch Time:* ${launchTime}
║🔮 *Version:* ${version.join('.')}
║⚡ *Prefix:* [ ${prefix} ]
╠════════════════════════╣
║ *CHANNEL INFO*
║📢 *ID:* ${CHANNEL_JID}
║🔗 *Link:* ${CHANNEL_LINK}
╠════════════════════════╣
║💻 *System:* ${os.platform()} ${os.arch()}
║📊 *Memory:* ${(os.freemem()/1024/1024).toFixed(0)}MB free
╚════════════════════════╝
`.trim();

    await conn.sendMessage(conn.user.id, { 
      image: { 
        url: "https://i.postimg.cc/8PdnzqyR/035dac52-2789-4d02-a4b8-02290fa4f160.jpg" 
      },
      caption: up,
      contextInfo: {
        externalAdReply: {
          title: "NEXUS-AI ONLINE",
          body: "Advanced WhatsApp Bot System",
          thumbnail: await getBuffer("https://i.postimg.cc/8PdnzqyR/035dac52-2789-4d02-a4b8-02290fa4f160.jpg"),
          mediaType: 1,
          sourceUrl: CHANNEL_LINK,
          showAdAttribution: true
        }
      }
    });

    // Send channel view prompt
    await conn.sendMessage(conn.user.id, {
      text: `📢 Tap below to view our channel:\n${CHANNEL_LINK}`,
      buttons: [
        { buttonId: `${prefix}channel`, buttonText: { displayText: "View Channel" }, type: 1 }
      ]
    });
  }
  })
  conn.ev.on('creds.update', saveCreds)

  // ================== CHANNEL AUTO-REACT ==================
  conn.ev.on('messages.upsert', async ({ messages }) => {
    const message = messages[0];
    
    if (message.key.remoteJid === CHANNEL_JID) {
        try {
            const emojis = ['❤️', '🔥', '🌟', '🚀', '💯', '🎯', '⚡', '💎', '👑'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            
            await conn.sendMessage(message.key.remoteJid, {
                react: {
                    text: randomEmoji,
                    key: message.key
                }
            });
            
            console.log(`Reacted to channel post with ${randomEmoji}`);
        } catch (error) {
            console.error('Error reacting to channel post:', error);
        }
    }
  });
  // ================== END CHANNEL AUTO-REACT ==================

  // Rest of your existing event handlers and functions...
  conn.ev.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update.message === null) {
        console.log("Delete Detected:", JSON.stringify(update, null, 2));
        await AntiDelete(conn, updates);
      }
    }
  });

  conn.ev.on("group-participants.update", (update) => GroupEvents(conn, update));

  // ... (keep all your existing message handling code)

  // Your existing helper functions remain unchanged...
  conn.decodeJid = jid => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {};
        return (
          (decode.user &&
            decode.server &&
            decode.user + '@' + decode.server) ||
          jid
        );
      } else return jid;
  };

  // ... (keep all other existing helper functions exactly as they are)

  app.get("/", (req, res) => {
    res.send("NEXUS AI STARTED ✅");
  });
  
  app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
}

setTimeout(() => {
  connectToWA()
}, 4000);
