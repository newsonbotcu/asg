const Tantoony = require('../../base/Tantoony');
const { Intents } = require('discord.js');
const client = new Tantoony({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES
    ]
}, __dirname.split('/').pop());
process.on("warning", (warn) => { client.log(warn, "varn") });
process.on("beforeExit", () => { console.log('Bitiriliyor...'); });
process.on("message", (packet) => {
    console.log(packet);
});
