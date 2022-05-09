console.log(__dirname.toString().replace("apps/Welcome", 'base/.env'));
require('dotenv').config({ path: __dirname.toString().replace("apps/Welcome", 'base/.env') });
const { Client, Intents } = require('discord.js');
const tokens = [
    process.env.mod,
    process.env.reg,
    process.env.grd
]

for (let j = 0; j < tokens.length; j++) {
    const token = tokens[j];
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_VOICE_STATES
        ]
    });
    client.login(token);
    client.on("ready", () => {
        const { joinVoiceChannel } = require('@discordjs/voice');
        const channel = client.channels.cache.get("969649579844861982");
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
    });
}

const wcm = [
    "936332594386186301",
    "936332642268364851",
    "936332677001400342"
]

for (let i = 0; i < wcm.length; i++) {
    const kanal = wcm[i];
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_VOICE_STATES
        ]
    });
    client.login(process.env[`ses${i + 1}`]);
    client.on("ready", () => {
        const { joinVoiceChannel } = require('@discordjs/voice');
        const channel = client.channels.cache.get(kanal);
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
    });
}