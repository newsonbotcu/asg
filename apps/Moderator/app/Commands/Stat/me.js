const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent, stripIndents } = require('common-tags');
const Messages = require('../../../../../MODELS/StatUses/stat_msg');
const Register = require('../../../../../MODELS/Datalake/Registered');
const Invites = require('../../../../../MODELS/StatUses/Invites');
const StatData = require('../../../../../MODELS/StatUses/VoiceRecords');
const TagData = require('../../../../../MODELS/StatUses/tagged');
const Auth = require('../../../../../MODELS/StatUses/authorized');
const { checkDays } = require('../../../../../HELPERS/functions');
//executor
class Nerede extends Command {
    constructor(client) {
        super(client, {
            name: "me",
            description: "etiketlenen kişinin yetkili statını gösterir.",
            usage: "me @fero/ID",
            examples: ["me"],
            aliases: [],
            category: "Genel",
            cmdChannel: "bot-komut",
            cooldown: 300000,
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "yetkilialım", "cmd-crew"],
        });
    }

    async run(client, message, args, data) {
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
            seconds = (seconds < 10) ? "0" + seconds : seconds;sasasasalim
            */
            return `${hours ? hours + " Saat, " : ""} ${minutes ? minutes + " Dakika, " : ""} ${seconds ? seconds + " Saniye" : ""}`;
        }

        let days = mentioned ? (args[1] || 7) : (args[0] || 7);
        const Veri = await Messages.findOne({ _id: mentioned.user.id });
        const MesajVeri = Veri ? Veri.records.filter(r => checkDays(r.created) < days).length + " Mesaj" : "0 Mesaj";

        const TVeri = await Register.find({ executor: mentioned.user.id });
        const KayıtVeri = TVeri ? TVeri.filter(r => checkDays(r.created) < days).length + " Kayıt" : "0 Kayıt";

        const DVeri = await Invites.findOne({ _id: mentioned.user.id });
        const DavetVeri = DVeri ? DVeri.records.filter(r => checkDays(r.created) < days).length + " Davet" : "0 Davet";

        const Data = await StatData.findOne({ _id: mentioned.user.id });
        const SesVeri = Data ? Data.records.filter(r => checkDays(r.enter) < days).map(r => r.exit.getTime() - r.enter.getTime()).reduce((a, b) => a + b, 0) : "0 Dakika";

        const TagliData = await TagData.find({ executor: mentioned.user.id });
        const taglilar = TagliData && TagliData.length ? TagliData.filter(td => checkDays(td.created) < days).length + " Taglı" : "0 Taglı";

        const TagliAuth = await Auth.find({ executor: mentioned.user.id });
        const yetkililerim = TagliAuth && TagliAuth.length ? TagliAuth.filter(td => checkDays(td.created) < days).length + " Yetkili" : "0 Yetkili";

        let kanallarim = {};
        if (Data) Data.records.filter(r => checkDays(r.enter) < days).forEach((r, i) => {
            kanallarim[r.channelID] = kanallarim[r.channelID] || 0
            kanallarim[r.channelID] = kanallarim[r.channelID] + r.exit.getTime() - r.enter.getTime();
        });
        console.log(kanallarim);
        const sesSira = Object.keys(kanallarim).sort((a, b) => kanallarim[b] - kanallarim[a]).slice(0, 5).map(k => {
            return {
                id: k,
                duration: kanallarim[k]
            }
        });
        console.log(sesSira);
        const birim = [
            "Saat",
            "Dakika",
            "Saniye"
        ];
        const embed = new Discord.MessageEmbed().setDescription(`${mentioned} adlı yetkilinin son 7 günlük verileri aşağıda yer almaktadır!`).setColor("BLACK").setTimestamp().setFooter(`🌟 fero sizi seviyor ❤ ${message.guild.name}`)
            .addField("__**Toplam Ses**__", `\`\`\`fix\n${msToTime(SesVeri).replace('Dakika', 'Dk').replace('Saniye', 'sn')}\`\`\``, true)
            .addField("__**Toplam Mesaj**__", `\`\`\`fix\n${MesajVeri}\`\`\``, true)
            .addField("__**Toplam Kayıt**__", `\`\`\`fix\n${KayıtVeri}\`\`\``, true)
            .addField("__**Toplam Davet**__", `\`\`\`fix\n${DavetVeri}\`\`\``, true)
            .addField("__**Toplam Taglı**__", `\`\`\`fix\n${taglilar}\`\`\``, true)
            .addField("__**Toplam Yetkili**__", `\`\`\`fix\n${yetkililerim}\`\`\``, true)
        // .addField(`Ses Kanalları`, `${emojis.get("statssh").value()} **Sohbet Odaları:** \`31 saat, 31 dakika\`
        // ${emojis.get("statssh").value()} **Kayıt Odaları:** \`31 saat, 31 dakika\`
        // ${emojis.get("statssh").value()} **Private Odaları:** \`31 saat, 31 dakika\`
        // ${emojis.get("statssh").value()} **Eğlence Odaları:** \`31 saat, 31 dakika\``)
        if (sesSira.length > 1) embed.addField(`Ses Kanalları`, stripIndents`${sesSira.map(sr => `<#${sr.id}> kanalında \`${msToTime(new Date(sr.duration))}\``).join('\n')}`)
            // .addField(`Metin Kanalları`, `\`\`\`Burası Bakımda\`\`\``)
            .addField(`Mesaj Kanalları`, `${emojis.get("statssh").value()} **Mesaj Kanalları:** \`${MesajVeri}\``).setTitle("Yetkili Stat Bilgi").setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true }));

        await message.inlineReply(embed);

        function bar(point, maxPoint) {
            const deger = Math.trunc(point * 10 / maxPoint);
            let str = "";
            for (let index = 2; index < 9; index++) {
                if ((deger / index) >= 1) {
                    str = str + emojis.get("ortabar_dolu").value()
                } else {
                    str = str + emojis.get("ortabar").value()
                }
            }
            if (deger === 0) {
                str = `${emojis.get("solbar").value()}${str}${emojis.get("sagbar").value()}`
            } else if (deger === 10) {
                str = `${emojis.get("solbar_dolu").value()}${str}${emojis.get("sagbar_dolu").value()}`
            } else {
                str = `${emojis.get("solbar_dolu").value()}${str}${emojis.get("sagbar").value()}`
            }
            return str;
        }

    }
}

module.exports = Nerede;