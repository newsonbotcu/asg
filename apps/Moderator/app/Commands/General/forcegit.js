const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Git extends Command {

    constructor(client) {
        super(client, {
            name: "forcegit",
            description: "İstediğiniz kişinin odasına gidin",
            usage: "forcegit etiket/id",
            examples: ["forcegit 674565119161794560"],
            accaptedPerms: ["cmd_dante"],
            category: "Moderasyon",
            aliases: ["fgit"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.channel.semessage.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (mentioned.user.id === message.member.user.id) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        let kanal = mentioned.voice.channel;
        if (!kanal) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (!message.member.voice || !message.member.voice.channel) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (kanal.id === message.member.voice.channel.id) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if(!kanal) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        await message.member.voice.setChannel(kanal.id);
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''))

    }
}

module.exports = Git;