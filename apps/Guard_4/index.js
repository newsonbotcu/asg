const Tantoony = require('../../base/Tantoony');
const { Intents } = require('discord.js');
const client = new Tantoony({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS
    ]
}, __dirname.split('/').pop());
process.on("warning", (warn) => { client.log(warn, "varn") });
process.on("beforeExit", () => { console.log('Bitiriliyor...'); });
