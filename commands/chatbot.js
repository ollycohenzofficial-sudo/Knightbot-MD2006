const fs = require('fs');
const axios = require('axios');

async function chatbot(sock, chatId, message) {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
    if (!text) return;

    try {
        // Show the bot is "typing" to look natural
        await sock.sendPresenceUpdate('composing', chatId);

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // System instructions to keep the bot in character for Cohenz Pro
        const prompt = `You are Cohenz Pro Bot, a helpful and creative AI assistant. 
        Your boss is Musaasizi Marvin (Cohenz Pro). 
        Keep replies natural, helpful, and concise. 
        User says: ${text}`;

        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        const answer = response.data.candidates[0].content.parts[0].text;

        await sock.sendMessage(chatId, { text: answer }, { quoted: message });

    } catch (error) {
        console.error("Chatbot Error:", error);
    }
}

module.exports = chatbot;

