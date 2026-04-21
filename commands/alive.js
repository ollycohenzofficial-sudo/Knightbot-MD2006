const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {
    try {
        const statusMessage = `*🤖 Cohenz Pro Bot is Online!* ⚡\n\n` +
            `*Status:* 🟢 Active & Ready\n` +
            `*Producer:* Musaasizi Marvin (Cohenz Pro)\n` +
            `*AI Brain:* Google Gemini 1.5 Flash 🧠\n\n` +
            `*Available Features:* \n` +
            `• 🎵 Ugaflow Lyric Support\n` +
            `• 📚 Physics & Economics Tutor\n` +
            `• 🛠️ Group Management\n` +
            `• 🛡️ Anti-Link Security\n\n` +
            `_Type *.menu* to see what I can do!_`;

        await sock.sendMessage(chatId, {
            text: statusMessage,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '1203631513685998@newsletter',
                    newsletterName: 'Cohenz Pro Bot Updates',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: 'Cohenz Pro Bot is alive and running! 🚀' });
    }
}

module.exports = aliveCommand;
