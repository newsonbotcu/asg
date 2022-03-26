const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { checkDays, rain } = require('../../../../../HELPERS/functions');
const StatData = require('../../../../../MODELS/StatUses/VoiceRecords');
const InviteData = require('../../../../../MODELS/StatUses/Invites');
const RegData = require('../../../../../MODELS/Datalake/Registered');
const stat_msg = require('../../../../../MODELS/StatUses/stat_msg');

const { stripIndent } = require('common-tags');
const stringTable = require('string-table');
const moment = require("moment")
moment.locale('tr');

class Invites extends Command {
    constructor(client) {
        super(client, {
            name: "tstat",
            description: "Belirtilen segmenteki istatistiklerini gösterir",
            usage: "tstat ses/davet/teyit",
            examples: ["tstat ses/davet/teyit"],
            category: "Stats",
            aliases: ["t31", "me"],
            accaptedPerms: ["crew"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        function msToTime(duration) {
            var milliseconds = Math.floor((duration % 1000) / 100),
                seconds = Math.floor((duration / 1000) % 60),
                minutes = Math.floor((duration / (1000 * 60)) % 60),
                hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
            /*
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            */
            return hours + " saat, " + minutes + " dk, " + seconds + " sn";
        }
        let tstatstatus = mentioned.presence.status
            .replace('online', 'Çevrim İçi <:inferno_cervimici:866719561944662016>')
            .replace('idle', 'Boşta <:inferno_bostaa:866719581493526549>')
            .replace('dnd', 'Rahatsız Etmeyin <:inferno_rahatsizetmeyin:866719649865269268>')
            .replace('offline', 'Çevrim Dışı <:inferno_cevrimdisi:866719610303414292>');

        if (mentioned.user.id !== message.author.id) args = args.slice(1);
        let days = args[2] || 7;

        const embed = new Discord.MessageEmbed().setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }));
        if (!args[0] || (args[0] !== 'ses' && args[0] !== 'davet' && args[0] !== 'teyit' && args[0] !== 'mesaj')) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (args[0] === 'ses') {
            const Data = await StatData.findOne({ _id: mentioned.user.id });
            if (!Data) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
            const records = Data.records.filter(r => checkDays(r.enter) < days);
            const responseEmbed = new Discord.MessageEmbed().setDescription(stripIndent`
            ${mentioned} kişisine ait ${days} günlük ses bilgileri:

               **Not:** Bu sistem test amaçlı yapılmıştır komutun daha güncel ve daha iyi hali gelene kadar bir süre bununla idare ediniz seviyiorsunuz <3.
            
            **Genel Bilgileri:**
            • ID: \`${mentioned.id}\`
            • Kullanıcı: ${mentioned}
            • Durum: ${tstatstatus}
            • Sunucuya Katılma Tarihi: \`${moment(mentioned.joinedAt).format("LLL")}\`
            • Geçirilen toplam süre: \`${msToTime(records.map(r => r.duration).reduce((a, b) => a + b, 0))}\`

            **Ses Bilgileri:**
            • Public ses süresi: \`${msToTime(records.filter(r => r.channelType === "st_public").map(r => r.duration).reduce((a, b) => a + b, 0))}\`
            • Register ses süresi: \`${msToTime(records.filter(r => r.channelType === "st_registry").map(r => r.duration).reduce((a, b) => a + b, 0))}\`
            • Private ses süresi: \`${msToTime(records.filter(r => r.channelType === "st_private").map(r => r.duration).reduce((a, b) => a + b, 0))}\`

            **Toplam Ses İstatistikleri**
            • Toplam ses: \`${msToTime(records.map(r => r.duration).reduce((a, b) => a + b, 0))}\`
            • Mikrofon kapalı: \`${msToTime(records.filter(r => r.selfMute).map(r => r.duration).reduce((a, b) => a + b, 0))}\`
            • Kulaklık kapalı: \`${msToTime(records.filter(r => r.selfDeaf).map(r => r.duration).reduce((a, b) => a + b, 0))}\`
         `).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setFooter("• Tantoony seni önemsiyor- vallaha önemsiyom abi").setTitle(message.guild.name);
            return await message.inlineReply(responseEmbed).then(msg => msg.delete({ timeout: 20000 }));
        }

        if (args[0] === 'davet') {
            const DataInv = await InviteData.findOne({ _id: mentioned.user.id });
            if (!DataInv) return await message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
            const embed = new Discord.MessageEmbed().setColor('RANDOM').setDescription(stripIndent`
            • Kullanıcı: ${mentioned}
            • Toplam Davet sayısı: ${DataInv.records.length}
            • Sunucuda olan davet ettiği kişi sayısı: ${DataInv.records.filter(rec => message.guild.members.cache.get(rec.user)).length}
            `).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setTitle(message.guild.name);
            return await message.inlineReply(embed).then(msg => msg.delete({ timeout: 10000 }));
        }

        if (args[0] === 'teyit') {
            const datam = await RegData.find({ executor: mentioned.user.id });
            if (!datam) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
            const embedD = new Discord.MessageEmbed().setColor('RANDOM').setDescription(stripIndent`
            • Kullanıcı: ${mentioned}
            • Toplam Kayıt sayısı: ${rain(client, datam.length)}
            • Bugünkü kayıt sayısı: ${rain(client, datam.filter(data => checkDays(data.created) <= 1).length)} 
            • Haftalık kayıt sayısı: ${rain(client, datam.filter(data => checkDays(data.created) <= 7).length)} 
            `).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setTitle(message.guild.name);
            return await message.inlineReply(embedD).then(msg => msg.delete({ timeout: 10000 }));
        }
        if (args[0] == 'mesaj') {
            const Data = await stat_msg.findOne({ _id: mentioned.user.id });
            if (!Data) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
            const records = Data.records.filter(r => checkDays(r.created) < days);
            let stats = {};
            for (let index = 0; index < records.length; index++) {
                const element = records[index];
                if (!stats[element.channel]) stats[element.channel] = 0
                stats[element.channel] = stats[element.channel] + 1;
            }
            const description = Object.keys(stats).map(channelID => `\`•\` ${message.guild.channels.cache.get(channelID) || "\`Bilinmiyor\`"}: ${stats[channelID] || 0} mesaj`).join('\n');

            const responseEmbed = new Discord.MessageEmbed().setDescription(stripIndent`
            ${mentioned} kişisine ait ${days} günlük mesaj bilgileri:
        
            **Genel Bilgileri:**
            • ID: \`${mentioned.id}\`
            • Kullanıcı: ${mentioned}
            • Durum: ${tstatstatus}
            • Sunucuya Katılma Tarihi: \`${moment(mentioned.joinedAt).format("LLL")}\`

            **Toplam Mesaj İstatistikleri**
             ${description}
             `).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setFooter("• bla bla bla - Starks").setTitle(message.guild.name);
            return await message.inlineReply(responseEmbed).then(msg => msg.delete({ timeout: 20000 }));
        }
        return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
    }
}
module.exports = Invites;
