/**
 * COHENZ PRO BOT V2.0 
 * Edited from Knight Bot Fork
 */
require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const pino = require("pino")
const path = require('path')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    jidDecode,
    delay
} = require("@whiskeysockets/baileys")

// Branding & Config
global.botname = "COHENZ PRO BOT"
global.ownername = "Musaasizi Marvin"
let phoneNumber = "256709913725"

async function startXeonBotInc() {
    const { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)

    const XeonBotInc = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "20.0.04"], // Keeping your working fork's browser
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        defaultQueryTimeoutMs: 60000,
        connectTimeoutMs: 60000,
    })

    XeonBotInc.ev.on('creds.update', saveCreds)

    // --- PAIRING CODE LOGIC ---
    if (!XeonBotInc.authState.creds.registered) {
        console.log(chalk.cyan(`\n⏳ COHENZ PRO: Requesting pairing code for ${phoneNumber}...`))
        await delay(5000) 
        try {
            let code = await XeonBotInc.requestPairingCode(phoneNumber)
            code = code?.match(/.{1,4}/g)?.join("-") || code
            console.log(chalk.black(chalk.bgGreen(`\n✅ YOUR PAIRING CODE: `)), chalk.white.bold(code), `\n`)
        } catch (error) {
            console.log(chalk.red('❌ Pairing failed. Check your number format.'))
        }
    }

    // --- PLUGIN INTEGRATION ---
    XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
        try {
            const m = chatUpdate.messages[0]
            if (!m.message || m.key.fromMe) return
            
            const body = m.message.conversation || m.message.extendedTextMessage?.text || ''
            const prefix = "." // Change this if you use a different prefix in settings.js
            if (!body.startsWith(prefix)) return

            const command = body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
            const text = body.slice(prefix.length + command.length).trim()

            // Map variables to match your uploaded plugins
            const isCreator = [phoneNumber, "256709913725"].includes(m.key.remoteJid.split('@')[0])
            
            // Loading your specific plugins
            const plugins = ['./system.js', './gemini.js', './group.js', './tools.js']
            for (const file of plugins) {
                if (fs.existsSync(file)) {
                    const plugin = require(file)
                    if (plugin.name === command || (plugin.alias && plugin.alias.includes(command))) {
                        await plugin.start(XeonBotInc, m, { text, command, isCreator })
                        break
                    }
                }
            }
        } catch (err) {
            console.error(err)
        }
    })

    XeonBotInc.ev.on('connection.update', async (s) => {
        const { connection, lastDisconnect } = s
        if (connection === 'open') {
            console.log(chalk.green(`\n✅ COHENZ PRO BOT IS ALIVE!`))
            console.log(chalk.cyan(`Logged in as: ${XeonBotInc.user.id}`))
        }
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason !== DisconnectReason.loggedOut) startXeonBotInc()
        }
    })
}

startXeonBotInc()

