require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const pino = require("pino")
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")

// Load your specific Settings
const settings = require('./settings')
let phoneNumber = settings.ownerNumber || "256709913725"

async function startCohenzBot() {
    const { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)

    const client = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        // Matches the Ubuntu/Chrome identity of your working fork
        browser: ["Ubuntu", "Chrome", "20.0.04"], 
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
    })

    client.ev.on('creds.update', saveCreds)

    // --- AUTOMATIC PAIRING CODE ---
    if (!client.authState.creds.registered) {
        console.log(chalk.cyan(`\n⏳ COHENZ PRO: Initializing pairing for ${phoneNumber}...`))
        await delay(10000) // stabilization wait
        try {
            let code = await client.requestPairingCode(phoneNumber)
            code = code?.match(/.{1,4}/g)?.join("-") || code
            console.log(chalk.black(chalk.bgGreen(`\n✅ YOUR PAIRING CODE: `)), chalk.white.bold(code), `\n`)
        } catch (error) {
            console.log(chalk.red('❌ Pairing Request Failed. Please Factory Reboot in Hugging Face settings.'));
        }
    }

    // --- PLUGIN COMMAND HANDLER ---
    client.ev.on('messages.upsert', async chatUpdate => {
        try {
            const m = chatUpdate.messages[0]
            if (!m.message || m.key.fromMe) return
            
            const body = m.message.conversation || m.message.extendedTextMessage?.text || ''
            const prefix = global.prefix || "."
            if (!body.startsWith(prefix)) return

            const command = body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
            const text = body.slice(prefix.length + command.length).trim()

            // Setup permissions for plugins
            const isCreator = [phoneNumber, "256709913725"].includes(m.key.remoteJid.split('@')[0])
            const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat) : null
            const participants = m.isGroup ? groupMetadata.participants : []
            const userAdmins = participants.filter(p => p.admin !== null).map(p => p.id)
            const isAdmin = userAdmins.includes(m.key.participant || m.key.remoteJid)
            const isBotAdmin = userAdmins.includes(client.user.id.split(':')[0] + '@s.whatsapp.net')

            // Load your plugins
            const plugins = ['./system.js', './gemini.js', './group.js', './tools.js']
            for (const file of plugins) {
                if (fs.existsSync(file)) {
                    const plugin = require(file)
                    if (plugin.name === command || (plugin.alias && plugin.alias.includes(command))) {
                        // Pass 'client' instead of 'conn' to match your system.js
                        await plugin.start(client, m, { text, command, isCreator, isAdmin, isBotAdmin, participants })
                        break
                    }
                }
            }
        } catch (err) { console.error(err) }
    })

    client.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'open') console.log(chalk.green(`\n✅ ${global.botname} IS CONNECTED\n`))
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason !== DisconnectReason.loggedOut) startCohenzBot()
        }
    })
}

startCohenzBot()
                
