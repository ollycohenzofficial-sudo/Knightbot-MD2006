const settings = {
  packname: 'Cohenz Pro Bot',
  author: 'Marvin Musaasiz',
  botName: "Cohenz Pro Bot",
  botOwner: 'Musaasizi Marvin',
  ownerNumber: '256709913725', 
  giphyApiKey: 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
  commandMode: "public",
  maxStoreMessages: 20, 
  storeWriteInterval: 10000,
  description: "This is a bot for managing group commands and automating tasks.",
  version: "3.0.7",
};

// Global variables for plugin compatibility
global.packname = settings.packname
global.author = settings.author
global.botname = settings.botName
global.ownername = settings.botOwner
global.owner = [settings.ownerNumber]
global.prefix = "." 
global.public_mode = settings.commandMode === "public" ? true : false

module.exports = settings;
