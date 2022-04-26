const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { checkDays } = require('../../../../../HELPERS/functions');
const Jails = require('../../../../../MODELS/Moderation/Jails');
const { stripIndent } = require('common-tags');
class JailSorgu extends Command {
    constructor(client) {
        super(client, {
            name: "jailbilgi",
            description: "Belirtilen kullanıcının cezasını sorgular",
            usage: "jailbilgi etiket/id",
            examples: ["jailbilgi 674565119161794560"],
            category: "Sorgu",
            aliases: ["jbilgi"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "cmd-jail"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        let mentionedID = message.mentions.members.first() ? message.mentions.members.first().user.id : args[0];
        if (!mentionedID) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        const jailData = await Jails.findOne({ _id: mentionedID });
        if (!jailData) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        const embed = new Discord.MessageEmbed().setTitle("Jail Bilgisi").setDescription(stripIndent`
        ${data.emojis["user"]} **Kullanıcı:** ${message.guild.members.cache.get(mentionedID) || `Sunucuda değil (${mentionedID})`}
        ${data.emojis["reason"]} **Jail sebebi:** ${jailData.reason}
        ${data.emojis["id"]} **Kullanıcı ID'si:** ${mentionedID}
        \`Komut sebebi:\` ${jailData.reason}
        \`Komutu Kullanan:\` ${message.guild.members.cache.get(jailData.executor) || `Sunucuda değil (${jailData.executor})`}
        \`Jail türü:\` ${jailData.type}
        \`Açılacağı tarih:\` ${(jailData.type === "temp") ? jailData.duration - checkDays(jailData.created) : "Açılmayacak"}
        `).setColor('#2f3136').setFooter("İnfenro Forever <3");
        await message.reply(embed);
        client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
    }
}
module.exports = JailSorgu;