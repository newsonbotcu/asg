const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const sicil = require('../../../../../MODELS/StatUses/Punishments');
const stringTable = require('string-table');
const { checkDays, sayi } = require('../../../../../HELPERS/functions');
const { stripIndent } = require("common-tags");
const { table } = require("table");
const low = require('lowdb');
const moment = require("moment");
moment.locale("tr");

class BanSorgu extends Command {
    constructor(client) {
        super(client, {
            name: "cezasorgu",
            description: "Belirtilen kullanıcının banını sorgular",
            usage: "cezasorgu etiket/id <ceza-id>",
            examples: ["cezasorgu 674565119161794560 KwFt7TkLKy"],
            category: "Sorgu",
            aliases: [],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "cmd-ban"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {


        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        let datam = await sicil.findOne({ _id: member.user.id });
        if (!datam) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));

        let cezano = args[1];
        if (!cezano) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        // ctrl + c başla
        let renk;
        let renkRol = member.roles.cache.array().filter(r => r.hoist).sort((a, b) => b.rawPosition - a.rawPosition)[0];
        if (!renkRol) {
            renk = '#ffffff';
        } else renk = renkRol.hexColor;
        //ctrl + v bitir
        let embed = new Discord.MessageEmbed().setAuthor(message.member.user.tag, message.member.user.avatarURL({ dynamic: true })).setThumbnail(message.member.user.avatarURL({ dynamic: true })).setColor(renk)
        let data = await datam.find(d => d.id === cezano);
        if (data) {
            embed.setDescription(`
        <@!${member}> kişisine uygulanan **${cezano}** numaralı ceza bilgisi;
        
        **Ceza Türü**
        ${data.type}
    
        **Ceza Atan Yetkili:**
        ${data.executor ? `<@!${data.executor}>` : "Bulunamadı"}
    
        **Ceza Sebebi:**
        ${data.reason}
    
        **Ceza Başlangıcı:**
        ${moment(data.created.getTime()).format("LLL")}

        `);
            message.inlineReply(embed);
        } else return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));


    }
}
module.exports = BanSorgu;