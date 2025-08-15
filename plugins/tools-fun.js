const axios = require("axios");
const fetch = require("node-fetch");
const { sleep } = require('../lib/functions');
const { cmd } = require("../command");

/*──────────────────────────────
 📌 JOKE COMMAND
──────────────────────────────*/
cmd({
    pattern: "joke",
    desc: "🤣 Get a random joke to brighten your day.",
    react: "😂",
    category: "fun",
    filename: __filename
}, async (conn, m, store, { reply }) => {
    try {
        const res = await axios.get("https://official-joke-api.appspot.com/random_joke");
        const joke = res.data;

        if (!joke?.setup || !joke?.punchline) {
            return reply("❌ Oops! Couldn't fetch a joke right now.");
        }

        const message = `😂 *Here's a joke for you!* 😂\n\n💬 ${joke.setup}\n\n🤣 ${joke.punchline}\n\n> © pkdriller`;
        await conn.sendMessage(m.from, { text: message, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });

    } catch (err) {
        console.error("❌ Joke Error:", err);
        reply("⚠️ Something went wrong while fetching the joke.");
    }
});

/*──────────────────────────────
 💘 FLIRT COMMAND
──────────────────────────────*/
cmd({
    pattern: "flirt",
    alias: ["masom", "line"],
    desc: "💖 Get a random flirty pickup line.",
    react: "💘",
    category: "fun",
    filename: __filename
}, async (conn, m, store, { from, reply }) => {
    try {
        const apiKey = 'shizo';
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/flirt?apikey=${apiKey}`);
        const json = await res.json();

        if (!json?.result) {
            throw new Error("No flirt line found.");
        }

        const message = `💘 *Flirty Line* 💘\n\n${json.result}\n\n> © pkdriller`;
        await conn.sendMessage(from, { text: message, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });

    } catch (err) {
        console.error("❌ Flirt Error:", err);
        reply("⚠️ Couldn't fetch a flirty line at the moment.");
    }
});

/*──────────────────────────────
 ❓ TRUTH COMMAND
──────────────────────────────*/
cmd({
    pattern: "truth",
    alias: ["truthquestion"],
    desc: "🤔 Get a random truth question.",
    react: "❓",
    category: "fun",
    filename: __filename
}, async (conn, m, store, { from, reply }) => {
    try {
        const apiKey = 'shizo';
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/truth?apikey=${apiKey}`);
        const json = await res.json();

        if (!json?.result) {
            throw new Error("No truth question found.");
        }

        const message = `❓ *Truth Time!* ❓\n\n${json.result}\n\n> © pkdriller`;
        await conn.sendMessage(from, { text: message, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });

    } catch (err) {
        console.error("❌ Truth Error:", err);
        reply("⚠️ Couldn't fetch a truth question right now.");
    }
});

/*──────────────────────────────
 🎯 DARE COMMAND
──────────────────────────────*/
cmd({
    pattern: "dare",
    alias: ["truthordare"],
    desc: "🎯 Get a random dare challenge.",
    react: "🎯",
    category: "fun",
    filename: __filename
}, async (conn, m, store, { from, reply }) => {
    try {
        const apiKey = 'shizo';
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/dare?apikey=${apiKey}`);
        const json = await res.json();

        if (!json?.result) {
            throw new Error("No dare found.");
        }

        const message = `🎯 *Your Dare:* 🎯\n\n${json.result}\n\n> © pkdriller`;
        await conn.sendMessage(from, { text: message, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });

    } catch (err) {
        console.error("❌ Dare Error:", err);
        reply("⚠️ Couldn't fetch a dare challenge.");
    }
});

/*──────────────────────────────
 🧠 FACT COMMAND
──────────────────────────────*/
cmd({
    pattern: "fact",
    desc: "🧠 Get a random fun fact.",
    react: "🧠",
    category: "fun",
    filename: __filename
}, async (conn, m, store, { reply }) => {
    try {
        const res = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
        const fact = res.data.text;

        if (!fact) {
            return reply("❌ Couldn't fetch a fact.");
        }

        const message = `🧠 *Fun Fact:* 🧠\n\n${fact}\n\n> © pkdriller`;
        await conn.sendMessage(m.from, { text: message, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });

    } catch (err) {
        console.error("❌ Fact Error:", err);
        reply("⚠️ Something went wrong while fetching the fact.");
    }
});

/*──────────────────────────────
 💬 PICKUP LINE COMMAND
──────────────────────────────*/
cmd({
    pattern: "pickupline",
    alias: ["pickup"],
    desc: "💬 Get a random pickup line.",
    react: "💬",
    category: "fun",
    filename: __filename
}, async (conn, m, store, { from, reply }) => {
    try {
        const res = await fetch('https://api.popcat.xyz/pickuplines');
        const json = await res.json();

        if (!json?.pickupline) {
            throw new Error("No pickup line found.");
        }

        const message = `💬 *Pickup Line:* 💬\n\n"${json.pickupline}"\n\n> © pkdriller`;
        await conn.sendMessage(from, { text: message }, { quoted: m });

    } catch (err) {
        console.error("❌ Pickup Line Error:", err);
        reply("⚠️ Couldn't fetch a pickup line right now.");
    }
});

/*──────────────────────────────
 🔥 CHARACTER COMMAND
──────────────────────────────*/
cmd({
    pattern: "character",
    alias: ["char"],
    desc: "🔥 Check the character of a mentioned user.",
    react: "🔥",
    category: "fun",
    filename: __filename
}, async (conn, m, store, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");

        const mentionedUser = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentionedUser) return reply("❌ Please mention a user to check their character.");

        const traits = ["Sigma", "Generous", "Cool", "Kind", "Sexy", "Gorgeous", "Patient", "Hot", "Simp", "Brilliant"];
        const randomTrait = traits[Math.floor(Math.random() * traits.length)];

        const message = `🔥 Character of @${mentionedUser.split("@")[0]}: *${randomTrait}* 🔥`;
        await conn.sendMessage(from, { text: message, contextInfo: { mentionedJid: [mentionedUser] } }, { quoted: m });

    } catch (err) {
        console.error("❌ Character Error:", err);
        reply("⚠️ Couldn't process the character check.");
    }
});
