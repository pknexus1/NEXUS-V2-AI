const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios'); // Make sure axios is installed: npm install axios

cmd({
    pattern: "repo",
    alias: ["github", "repository"],
    use: '.repo',
    desc: "Display GitHub repo information.",
    category: "tools",
    react: "📦",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const githubUser = "officialPkdriller";
        const repoName = "NEXUS-AI";

        // Fetch data from GitHub API
        const res = await axios.get(`https://api.github.com/repos/${githubUser}/${repoName}`);
        const data = res.data;

        const repoMessage = `
🌐 *GitHub Repository Info*
────────────────────
📦 *Name:* ${data.name}
📝 *Description:* ${data.description || "No description"}
⭐ *Stars:* ${data.stargazers_count}
🍴 *Forks:* ${data.forks_count}
👀 *Watchers:* ${data.watchers_count}
🐛 *Open Issues:* ${data.open_issues_count}
📅 *Last Updated:* ${new Date(data.updated_at).toLocaleString()}
🔗 *URL:* ${data.html_url}
────────────────────
💬 Data fetched live from GitHub API.
        `.trim();

        await conn.sendMessage(from, {
            text: repoMessage,
            contextInfo: {
                mentionedJid: [sender]
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in repo command:", e);
        reply(`❌ Could not fetch repository info: ${e.message}`);
    }
});
