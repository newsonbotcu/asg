const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');

class Booster extends Command {

    constructor(client) {
        super(client, {
            name: "cihaz",
            description: "Belirtilen ismi adınız yapar",
            usage: "cihaz",
            examples: ["cihaz Tantoony"],
            category: "Genel",
            accaptedPerms: [],
            aliases: [],
            cooldown: 300000
        });
    }

    async run(client, message, args) {
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (mentioned.user.id === message.member.user.id) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (mentioned.user.presence.status == "offline") return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));

        let adana = "Bilinmiyor";
        let ceyhan = Object.keys(mentioned.user.presence.clientStatus)
        if (ceyhan[0] == "desktop") adana = "Masaüstü Uygulama"
        if (ceyhan[0] == "web") adana = "İnternet Tarayıcısı"
        if (ceyhan[0] == "mobile") adana = "Mobil Telefon"
        await message.inlineReply(new Discord.MessageEmbed().setDescription(`${mentioned} Kullanıcısının şu anda kullandığı cihaz: \`${adana}\``)).setColor("BLACK");

    }
}

module.exports = Booster;