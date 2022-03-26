const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const Points_profile = require('../../../../../MODELS/Economy/Points_profile');
const Points_config = require('../../../../../MODELS/Economy/Points_config');
const { checkHours } = require('../../../../../HELPERS/functions');

class stark extends Command {

    constructor(client) {
        super(client, {
            name: "stark",
            description: "Puan bilgisini verir..",
            usage: "stark",
            examples: ["stark"],
            category: "Genel",
            aliases: ["stark"],
            acceptedRoles: [],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: false,
            rootOnly: true,
            dmCmd: false
        });
    }

    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const roles = await low(client.adapters('roles'));

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


       // const pointData = await Points_profile.findOne({ _id: message.author.id });
       // const pointConfig = await Points_config.findOne({ _id: pointData.role });
        const myRole = message.guild.roles.cache.get("856266299285045288");
        const nexReole = message.guild.roles.cache.get("871185595492360222")
     /*   const nextRole = message.guild.roles.cache
            .filter(r => r.rawPosition >= myRole.rawPosition)
            .filter(r => r.hoist)
            .filter(r => r.id !== roles.get("booster").value())
            .sort((a, b) => a.rawPosition - b.rawPosition).array().find(role => role.rawPosition > myRole.rawPosition);*/

        message.inlineReply(new Discord.MessageEmbed().setDescription(`
        **Dante's INFEЯИO** puan bilgileri
        ${message.member} kullanıcısının puan bilgileri
        Yetkisi: ${myRole}
        ●▬▬▬▬▬▬▬▬▬▬●
        Toplam Puan: \`10000\`
        Kayıt Puanı: \`30\`
        Mesaj Puanı: \`1000\`
        Davet Puanı: \`50\`
        Taglı Puanı: \`50\`
        Yetkili Alım Puanı: \`50\`
        Public Puanı: \`5000\`
        Diğer Ses Puanı: \`3820\`
        Bonus Puan: \`0\`
        ●▬▬▬▬▬▬▬▬▬▬●
        ${nexReole} rolüne yükselmek için \`500\` saatin var!
        ${bar(10000, 15000)}
        `).setColor('#7bf3e3'));

        
      /*  const pointData = await Points_profile.findOne({ _id: message.author.id });
        const pointConfig = await Points_config.findOne({ _id: pointData.role });
        const myRole = message.guild.roles.cache.get(pointData.role);
        const nextRole = message.guild.roles.cache
            .filter(r => r.rawPosition >= myRole.rawPosition)
            .filter(r => r.hoist)
            .filter(r => r.id !== roles.get("booster").value())
            .sort((a, b) => a.rawPosition - b.rawPosition).array().find(role => role.rawPosition > myRole.rawPosition);

        message.inlineReply(new Discord.MessageEmbed().setDescription(`
        **Dante's INFEЯИO** puan bilgileri
        ${message.member} kullanıcısının puan bilgileri
        Yetkisi: ${myRole}
        ●▬▬▬▬▬▬▬▬▬▬●
        Toplam Puan: \`${pointData.msgPoints + pointData.points.map(plog => plog.points).reduce((a, b) => a + b, 0)}\`
        Kayıt Puanı: \`${pointData.points.filter(plog => plog.type === "registry").map(plog => plog.points).reduce((a, b) => a + b, 0)}\`
        Mesaj Puanı: \`${pointData.msgPoints}\`
        Davet Puanı: \`${pointData.points.filter(plog => plog.type === "invite").map(plog => plog.points).reduce((a, b) => a + b, 0)}\`
        Taglı Puanı: \`${pointData.points.filter(plog => plog.type === "tagged").map(plog => plog.points).reduce((a, b) => a + b, 0)}\`
        Yetkili Alım Puanı: \`${pointData.points.filter(plog => plog.type === "authorized").map(plog => plog.points).reduce((a, b) => a + b, 0)}\`
        Public Puanı: \`${pointData.points.filter(plog => plog.type === "voice-public").map(plog => plog.points).reduce((a, b) => a + b, 0)}\`
        Diğer Ses Puanı: \`${pointData.points.filter(plog => plog.type === "voice-other").map(plog => plog.points).reduce((a, b) => a + b, 0)}\`
        Bonus Puan: \`${pointData.points.filter(plog => plog.type === "bonus").map(plog => plog.points).reduce((a, b) => a + b, 0)}\`
        ●▬▬▬▬▬▬▬▬▬▬●
        ${nextRole} rolüne yükselmek için ${pointConfig.expiringHours - checkHours(pointData.created)} saatin var!
        ${bar(pointData.msgPoints + pointData.points.map(plog => plog.points).reduce((a, b) => a + b, 0), pointConfig.requiredPoint)}
        `).setColor('#7bf3e3'));*/
    }
}

module.exports = stark;