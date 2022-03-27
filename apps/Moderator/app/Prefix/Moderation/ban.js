const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { sayi } = require('../../../../../HELPERS/functions');
const moment = require("moment")
moment.locale('tr')

class Ban extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Belirtilen kullanıcıyı banlar",
            usage: "ban etiket/id gün/perma sebep",
            examples: ["ban 479293073549950997 10 botları kötü yapıyor"],
            category: "Moderasyon",
            aliases: ["yargı", "infaz"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "cmd-ban"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {

        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));

        let sebep = args.slice(1).join(" ");
        if (!sebep) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        if (!mentioned.bannable) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        client.handler.emit('Ban', message.guild, mentioned.user, message.author.id, sebep);
        await message.reply(`${mentioned} Kullanıcısı ${message.author} tarafından **${sebep}** dolayısıyla yasaklandı.`);
        await message.react(data.emojis["ok"].split(':')[2].replace('>', ''));


    }
}
module.exports = Ban;