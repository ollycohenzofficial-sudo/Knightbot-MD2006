require('dotenv').config(); 
global.ownername = "Musaasizi Marvin";
global.botname = "Cohenz Pro Bot";
global.sudo = ["256709913725"];
global.owner = ["256709913725"];
global.packname = "Cohenz Pro";
global.author = "iMac Recordz";
global.prefix = ".";
global.gemini_api_key = process.env.GEMINI_API_KEY; 
global.suno_api_key = process.env.SUNO_API_KEY;
global.gemini_model = "gemini-1.5-flash";

global.APIs = {
  xteam: 'https://api.xteam.xyz',
  dzx: 'https://api.dhamzxpath.my.id',
  lol: 'https://api.lolhuman.xyz',
  violetics: 'https://violetics.pw',
  neoxr: 'https://api.neoxr.my.id',
  zenzapis: 'https://zenzapis.xyz',
  akuari: 'https://api.akuari.my.id',
  akuari2: 'https://apimu.my.id',
  nrtm: 'https://fg-nrtm.ddns.net',
  bg: 'http://bochil.ddns.net',
  fgmods: 'https://api-fgmods.ddns.net'
};

global.APIKeys = {
  'https://api.xteam.xyz': 'd90a9e986e18778b',
  'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
  'https://api.neoxr.my.id': 'yourkey',
  'https://violetics.pw': 'beta',
  'https://zenzapis.xyz': 'yourkey',
  'https://api-fgmods.ddns.net': 'fg-dylux'
};

module.exports = {
  WARN_COUNT: 3,
  APIs: global.APIs,
  APIKeys: global.APIKeys
};
      
