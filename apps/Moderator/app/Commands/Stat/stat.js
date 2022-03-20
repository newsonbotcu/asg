const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { checkDays, rain } = require('../../../../../HELPERS/functions');
const StatData = require('../../../../../MODELS/StatUses/VoiceRecords');
const { stripIndent } = require('common-tags');
const stringTable = require('string-table');
const moment = require("moment")
moment.locale('tr');

class Invites extends Command {
    constructor(client) {
        super(client, {
            name: "stat",
            description: "Belirtilen kullanıcının istatistiklerini gösterir",
            usage: "stat @etiket/id",
            examples: ["stat 674565119161794560"],
            category: "Stats",
            aliases: ["st"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        let tstatstatus = mentioned.presence.status
            .replace('online', 'Çevrim İçi <:inferno_cervimici:883792952156102666>')
            .replace('idle', 'Boşta <:inferno_bosta:883792952042872952>')
            .replace('dnd', 'Rahatsız Etmeyin <:inferno_rahatsizetmeyin:883792951807991820>')
            .replace('offline', 'Çevrim Dışı <:inferno_cevrimdisi:883792952202231868>');

        if (mentioned.user.id !== message.author.id) args = args.slice(1);
        let days = args[1] || 7;

        const Data = await StatData.findOne({ _id: mentioned.user.id });
        if (!Data) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        const records = Data.records.filter(r => checkDays(r.enter) < days);
        const birim = [
            "Saat",
            "Dakika",
            "Saniye"
        ];
        const responseEmbed = new Discord.MessageEmbed().setDescription(stripIndent`
        ${mentioned} kişisine ait ${days} günlük ses bilgileri:
        **Genel Bilgileri:**
        • ID: \`${mentioned.id}\`
        • Kullanıcı: ${mentioned}
        • Durum: ${tstatstatus}
        • Sunucuya Katılma Tarihi: \`${moment(mentioned.joinedAt).format("LLL")}\`
        • Geçirilen toplam süre: \`${new Date(records.map(r => r.duration).reduce((a, b) => a + b, 0)).toISOString().substr(11, 8).toString().split(':').map((v, i) => v > 0 ? `${v} ${birim[i]}` : "").filter(str => str.length > 1).join(' ')}\`

        **Ses Bilgileri:**
        • Public ses süresi: \`${new Date(records.filter(r => r.channelType === "st_public").map(r => r.duration).reduce((a, b) => a + b, 0)).toISOString().substr(11, 8).toString().split(':').map((v, i) => v > 0 ? `${v} ${birim[i]}` : "").filter(str => str.length > 1).join(' ')}\`
        • Register ses süresi: \`${new Date(records.filter(r => r.channelType === "st_registry").map(r => r.duration).reduce((a, b) => a + b, 0)).toISOString().substr(11, 8).toString().split(':').map((v, i) => v > 0 ? `${v} ${birim[i]}` : "").filter(str => str.length > 1).join(' ')}\`
        • Private ses süsresi: \`${new Date(records.filter(r => r.channelType === "st_private").map(r => r.duration).reduce((a, b) => a + b, 0)).toISOString().substr(11, 8).toString().split(':').map((v, i) => v > 0 ? `${v} ${birim[i]}` : "").filter(str => str.length > 1).join(' ')}\`

        **Toplam Ses İstatistikleri**
        • Toplam ses: \`${new Date(records.map(r => r.duration).reduce((a, b) => a + b, 0)).toISOString().substr(11, 8).toString().split(':').map((v, i) => v > 0 ? `${v} ${birim[i]}` : "").join(' ')}\`
        • Mikrofon kapalı: \`${new Date(records.filter(r => r.selfMute).map(r => r.duration).reduce((a, b) => a + b, 0)).toISOString().substr(11, 8).toString().split(':').map((v, i) => v > 0 ? `${v} ${birim[i]}` : "").filter(str => str.length > 1).join(' ')}\`
        • Kulaklık kapalı: \`${new Date(records.filter(r => r.selfMute).map(r => r.duration).reduce((a, b) => a + b, 0)).toISOString().substr(11, 8).toString().split(':').map((v, i) => v > 0 ? `${v} ${birim[i]}` : "").filter(str => str.length > 1).join(' ')}\`
     `).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setFooter("• Fero seni önemsiyor- vallaha önemsiyom abi").setTitle(message.guild.name);
        return await message.inlineReply(responseEmbed)
    }
}
module.exports = Invites;
