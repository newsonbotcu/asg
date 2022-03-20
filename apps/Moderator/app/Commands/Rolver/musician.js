const Command = require('../../../Base/Command');
const Discord = require('discord.js');
const low = require('lowdb');
class Musician extends Command {
    constructor(client) {
        super(client, {
            name: "müzisyen",
            description: "Kişiye Müzisyen rolü verir",
            usage: "müzisyen @Fero/ID",
            examples: ["müzisyen @Fero/ID"],
            category: "Rolver",
            aliases: ["musicians","musician"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "cmd-ability"],
            cooldown: 1000
        });
    };
    async run(client, message, args) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        let emoji = "ok";
        let durum = "Verildi";
        if (mentioned.roles.cache.has(roles.get("role_musician").value())) {
            await mentioned.roles.remove(roles.get("role_musician").value());
            await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        } else {
            await mentioned.roles.add(roles.get("role_musician").value());
            await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
            emoji = "error"
            durum = "Alındı";
        }
        const aylar = [
            "Ocak",
            "Şubat",
            "Mart",
            "Nisan",
            "Mayıs",
            "Haziran",
            "Temmuz",
            "Ağustos",
            "Eylül",
            "Ekim",
            "Kasım",
            "Aralık"
        ];
        const tarih = new Date();
        const embed = new Discord.MessageEmbed().setDescription(stripIndents`
        ${emojis.get(emoji).value()} **Rol ${durum}**
        
        ${message.member} (\`${message.member.user.id}\`) adlı yetkili, ${mentioned} (\`${mentioned.user.id}\`) üyesin${durum === "Verildi" ? "e" : "den"} <@&${roles.get("role_musician").value()}> rolü ${durum.toLowerCase()}.
        **Tarih:** \`${tarih.getDate()} ${aylar[tarih.getMonth()]} ${tarih.getFullYear()} ${tarih.getHours() + 3}:${tarih.getMinutes()}\`
        `)


        await message.guild.channels.cache.get(channels.get("log_rol").value()).send(embed);
    }
}
module.exports = Musician;