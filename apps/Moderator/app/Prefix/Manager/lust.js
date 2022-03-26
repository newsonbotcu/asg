const { MessageEmbed } = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');

class Lust extends Command {
    constructor(client) {
        super(client, {
            name: "lust",
            description: "0054 Üyelerine özel rol verir.",
            usage: "lust @member/ID",
            examples: ["lust"],
            category: "Yetkili",
            aliases: ["lt"],
            accaptedPerms: ["root", "owner", "cmd-ceo","cmd-double","cmd-single"],
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.react(emojis.get("warn").value().split(':')[2].replace('>', ''));
        if (member.roles.cache.has(roles.get("starter").value())) return message.reply("Kullanıcıda zaten perm var bilader amacın ne ?").catch(() => { })

        member.roles.add(roles.get("starter").value()).catch(() => { })
        message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
    }
}
module.exports = Lust;