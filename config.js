require('dotenv').config(); // MUST BE LINE 1
global.ownername = "Musaasizi Marvin";
global.botname = "Cohenz Pro Bot";
global.sudo = ["256709913725"];
global.owner = ["256709913725"];
global.packname = "Cohenz Pro";
global.author = "iMac Recordz";
global.prefix = ".";

// AI API KEYS
global.gemini_api_key = process.env.GEMINI_API_KEY;
global.suno_api_key = process.env.SUNO_API_KEY;
global.gemini_model = "gemini-1.5-flash";

global.APIs = {
  xteam: 'https://api.xteam.xyz',
  lol: 'https://api.lolhuman.xyz',
  neoxr: 'https://api.neoxr.my.id',
  zenzapis: 'https://zenzapis.xyz',
  akuari: 'https://api.akuari.my.id',
};

global.APIKeys = {
  'https://api.xteam.xyz': 'd90a9e986e18778b',
  'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
};

module.exports = {
  WARN_COUNT: 3,
  APIs: global.APIs,
  APIKeys: global.APIKeys
};

