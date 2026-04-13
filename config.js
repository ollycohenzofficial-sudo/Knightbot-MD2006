const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

// --- 1. THE OWNER IDENTITY ---
global.ownername = "Musaasizi Marvin";
global.botname = "Cohenz Pro Bot";
global.author = "COHENZ PRO";
global.packname = "Cohenz Pro";
global.sudo = ["256709913725"];
global.prefix = ".";

// --- 2. THE IMAGE LINK (Paste your Direct Link here) ---
global.menu_img = "https://i.postimg.cc/W1jfCXRv/IMG-20260413-WA0015.jpg"; 
global.thumb = "https://i.postimg.cc/W1jfCXRv/IMG-20260413-WA0015.jpg";
global.allimg = "https://i.postimg.cc/W1jfCXRv/IMG-20260413-WA0015.jpg";

// --- 3. SYSTEM & AI ---
global.lang = "EN"; // No more foreign languages
global.gemini_api_key = process.env.GEMINI_API_KEY;
global.gemini_model = "gemini-1.5-flash"; 

// --- 4. SOCIALS ---
global.link = 'https://youtube.com/@cohenzpro'; 
global.channel = 'https://youtube.com/@cohenzpro'; 
global.footer = "© 2026 iMac Recordz";
