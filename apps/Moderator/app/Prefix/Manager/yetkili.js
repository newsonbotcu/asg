const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
const { checkSecs } = require("../../../../../HELPERS/functions");
const { stripIndent } = require("common-tags");
const tagged = require("../../../../../MODELS/StatUses/authorized");

class CountByRole extends Command {

    constructor(client) {
        super(client, {
            name: "yetkili",
            description: "kişinin yetkili çektiğini veri tabanına işler.",
            usage: "yetkili @etiket/id(yetki veren) id(yetki alan)",
            examples: ["yetkili @Tantoony 890344502433296404"],
            cooldown: 3600000,
            category: "Yetkili",
            accaptedPerms: ["yetkilitaglı"]
        });
    }

    async run(client, message, args) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const tagAlan = message.guild.members.cache.get(args[1]);
        if (!mentioned || !tagAlan) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (!tagAlan.user.username.includes(client.config.tag[0])) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (mentioned.user.id === message.member.user.id) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (tagAlan.user.id === message.member.user.id) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        await tagged.create({
            _id: tagAlan.user.id,
            verifier: message.author.id,
            executor: mentioned.user.id,
            created: new Date()
        });


    }

}

module.exports = CountByRole;