const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const { checkDays, rain } = require('../../../../../HELPERS/functions');
const InviteData = require('../../../../../MODELS/StatUses/Invites');
const { stripIndent } = require('common-tags');
class Invites extends Command {
    constructor(client) {
        super(client, {
            name: "invites",
            description: "Belirtilen kullanıcının davetlerini gösterir",
            usage: "invites etiket/id",
            examples: ["invites 674565119161794560"],
            category: "Stats",
            aliases: ["invs"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const Data = await InviteData.findOne({ _id: mentioned.user.id });
        if (!Data) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));

        const embed = new Discord.MessageEmbed().setColor('#2f3136').setDescription(stripIndent`
        Kullanıcı: **${mentioned.user.username}**
        Davet sayısı: ${rain(client, Data.records.length)}
        Sunucuda olan davet ettiği kişi sayısı: ${rain(client, Data.records.filter(rec => message.guild.members.cache.get(rec.user)).length)}
        `).setThumbnail(mentioned.user.displayAvatarURL({ type: 'gif' })).setColor(mentioned.displayHexColor).setTitle("† Dante's INFEЯИO");

        await message.inlineReply(embed);
    }
}
module.exports = Invites;
