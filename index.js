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
const CHANNEL_JID = "120363288304618280@newsletter"; // Your channel JID
const CHANNEL_EMOJIS = [
    '❤️', '🔥', '🌟', '🚀', '💯', '🎯', '⚡', '💎', '👑', 
    '🤖', '💡', '🎉', '🌈', '🍃', '🌊', '✨', '🦾', '🧠',
    '🤯', '👀', '🙌', '🫶', '👍', '👏', '🥇', '🏆', '💪',
    '🎯', '💫', '🌌', '🛸', '🔮', '🧿', '⚙️', '🔋', '💥'
];
// ================== END CHANNEL CONFIG ==================

// ================== AUTO BIO CONFIG ==================
const bioQuotes = [
  "🌟 Powered by Nexus-AI",
  "🔥 Best WhatsApp Bot",
  "💻 Coding is my passion",
  "🤖 AI is the future",
  "🚀 Exploring new technologies",
  "📚 Learning never stops",
  "💡 Ideas change the world",
  "🌍 Connecting people",
  "⚡ Fast and efficient",
  "🎯 Precision matters"
];
let currentBioIndex = 0;

const updateBio = async (conn) => {
  try {
    const newBio = bioQuotes[currentBioIndex];
    await conn.updateProfileStatus(newBio);
    console.log(`Bio updated to: ${newBio}`);
    
    currentBioIndex = (currentBioIndex + 1) % bioQuotes.length;
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
  
  // Start auto-bio feature
  updateBio(conn);
  setInterval(() => updateBio(conn), 30 * 1000);
  
  let up = `╭─〔 *🤖 NEXUS-AI BOT CONNECTED* 〕
  
├─▸  https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x
★      FOLLOW OURW CHANNEL 👆
     ___________________________________
│★  
╰─➤  
├─ 🧩 *Prefix:* = ${prefix} 
|    
╰─🔥 *Powered by Pkdriller*`;
    conn.sendMessage(conn.user.id, { image: { url: `https://i.postimg.cc/8PdnzqyR/035dac52-2789-4d02-a4b8-02290fa4f160.jpg` }, caption: up })
  }
  })
  conn.ev.on('creds.update', saveCreds)

  // ================== CHANNEL AUTO-REACT ==================
  conn.ev.on('messages.upsert', async ({ messages }) => {
    const message = messages[0];
    
    if (message.key.remoteJid === CHANNEL_JID) {
        try {
            const randomEmoji = CHANNEL_EMOJIS[Math.floor(Math.random() * CHANNEL_EMOJIS.length)];
            
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

  // Rest of your existing event handlers...
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
  
  // Your existing helper functions...
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

  // ... (keep all your existing helper functions)

  app.get("/", (req, res) => {
    res.send("NEXUS AI STARTED ✅");
  });
  
  app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
}

setTimeout(() => {
  connectToWA()
}, 4000);
