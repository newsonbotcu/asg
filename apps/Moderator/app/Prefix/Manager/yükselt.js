const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const yagmur = require("../../../../../BASE/stark.json")

class Upgrade extends Command {

    constructor(client) {
        super(client, {
            name: "yükselt",
            description: "Belirtilen kullanıcının yetkisini yükseltir",
            usage: "yükselt @etiket/id",
            examples: ["yükselt 674565119161794560"],
            category: "Management",
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "yetkilialım"],
            enabled: false
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        const embed = new Discord.MessageEmbed().setColor('BLACK');
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if(!mentioned.user.username.includes("†")) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));

        let yetkiNumber;
        let sahipOlunanRol = Number();
        for (yetkiNumber = 0; yetkiNumber < yagmur.Yetkiler.length; yetkiNumber++) {
            if (mentioned.roles.cache.has(yagmur.Yetkiler[yetkiNumber])) {
                sahipOlunanRol += yetkiNumber
            };
        }
        if (!mentioned.roles.cache.has(yagmur.Yetkiler[yagmur.Yetkiler.length - 1])) {
            await mentioned.roles.add(yagmur.Yetkiler[sahipOlunanRol + 1]).catch(e => { })
            await mentioned.roles.remove(yagmur.Yetkiler[sahipOlunanRol]).catch(e => { })
            await message.inlineReply(embed.setDescription(`${mentioned} Kullanısı <@&${yagmur.Yetkiler[sahipOlunanRol + 1]}> Yetkisine Başarılı bir Şekilde Yükseltildi.`)).catch(e => { })
        } else { message.inlineReply(embed.setDescription(`:x: Belirtilen Kullanıcı Zaten Max Role Sahip.`)).catch(e => { }) }
    }
}

module.exports = Upgrade;