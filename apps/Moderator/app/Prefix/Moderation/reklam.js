const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { sayi } = require("../../../../../HELPERS/functions");
class Jail extends Command {
    constructor(client) {
        super(client, {
            name: "reklam",
            description: "Belirtilen kullanıcıyı reklam cezası ile hapse atar",
            usage: "reklam etiket/id sebep",
            examples: ["reklam 674565119161794560"],
            category: "Moderasyon",
            aliases: ["rek", "req"],
            accaptedPerms: ["root", "owner", "cmd-ceo","cmd-double","cmd-single", "cmd-jail"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        client = this.client;
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        if (!mentioned.bannable) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        client.handler.emit('Jail', mentioned, message.author.id, "REKLAM", "perma");
        if (mentioned.voice.channel) await mentioned.voice.kick();
        await message.react(data.emojis["ok"].split(':')[2].replace('>', ''));
    }
}
module.exports = Jail;