const axios = require('axios');

async function aiCommand(sock, chatId, message) {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
    if (!text) return;

    const parts = text.split(' ');
    const command = parts[0].toLowerCase();
    const query = parts.slice(1).join(' ').trim();

    if (!query) {
        return await sock.sendMessage(chatId, { text: `Yo! Provide a question after ${command}\n\nExample: ${command} write a rap intro.` }, { quoted: message });
    }

    try {
        // Reaction to show the bot is thinking
        await sock.sendMessage(chatId, { react: { text: '🎸', key: message.key } });

        // Using your Gemini API Secret from Hugging Face
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await axios.post(url, {
            contents: [{ parts: [{ text: query }] }]
        });

        const answer = response.data.candidates[0].content.parts[0].text;

        await sock.sendMessage(chatId, { text: answer }, { quoted: message });

    } catch (error) {
        console.error("Gemini Error:", error);
        await sock.sendMessage(chatId, { text: "Connection lag! Try again in a second." }, { quoted: message });
    }
}

module.exports = aiCommand;
        
