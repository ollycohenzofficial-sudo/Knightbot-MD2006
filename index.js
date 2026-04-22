/**
 * COHENZ PRO BOT - REWRITTEN V2.0
 * Fixed for CommonJS & Knight Bot Architecture
 */

require('./settings');
require('./config');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore, 
    jidDecode, 
    delay 
} = require("@whiskeysockets/baileys");
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const chalk = require('chalk');
const pino = require("pino");

// Identity Setup
const phoneNumber = global.owner?.[0] || "256709913725";

async function startCohenzBot() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(`./session`);

    const client = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "20.0.04"], // Matches working fork identity
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
    });

    client.ev.on('creds.update', saveCreds);

    // --- AUTOMATIC PAIRING CODE ---
    if (!client.authState.creds.registered) {
        console.log(chalk.cyan(`\n⏳ COHENZ PRO: Stabilizing connection for ${phoneNumber}...`));
        await delay(10000); // 10-second wait to prevent HF blocking
        try {
            let code = await client.requestPairingCode(phoneNumber);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            console.log(chalk.black(chalk.bgGreen(`\n✅ YOUR PAIRING CODE: `)), chalk.white.bold(code), `\n`);
        } catch (error) {
            console.log(chalk.red('❌ Pairing Request Blocked. Go to Settings and click FACTORY REBOOT.'));
        }
    }

    // --- DYNAMIC PLUGIN LOADER (Only "The Few") ---
    client.ev.on('messages.upsert', async chatUpdate => {
        try {
            const m = chatUpdate.messages[0];
            if (!m.message || m.key.fromMe) return;
            
            const body = m.message.conversation || m.message.extendedTextMessage?.text || '';
            const prefix = global.prefix || ".";
            if (!body.startsWith(prefix)) return;

            const command = body.slice(prefix.length).trim().split(' ')[0].toLowerCase();
            const text = body.slice(prefix.length + command.length).trim();

            // Setup Permissions
            const isCreator = [phoneNumber, "256709913725"].includes(m.key.remoteJid.split('@')[0]);
            
            // Strictly loading only your required plugins
            const plugins = ['./system.js', './gemini.js', './group.js', './tools.js'];
            
            for (const file of plugins) {
                if (fs.existsSync(file)) {
                    const plugin = require(file);
                    if (plugin.name === command || (plugin.alias && plugin.alias.includes(command))) {
                        await plugin.start(client, m, { text, command, isCreator });
                        break;
                    }
                }
            }
        } catch (err) { 
            console.error(chalk.red("Plugin Error: "), err); 
        }
    });

    // --- CONNECTION HANDLING ---
    client.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            console.log(chalk.green(`\n✅ ${global.botname || "COHENZ PRO"} IS ONLINE AND READY!`));
        }
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                console.log(chalk.yellow("🔄 Connection lost. Reconnecting..."));
                startCohenzBot();
            } else {
                console.log(chalk.red("❌ Logged out. Delete 'session' folder and restart."));
            }
        }
    });
}

startCohenzBot();
            
