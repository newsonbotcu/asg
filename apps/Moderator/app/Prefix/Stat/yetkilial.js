const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');

class Upgrade extends Command {
    constructor(client) {
        super(client, {
            name: "yetkilial",
            description: "Belirtilen kullanıcıyı yetkiye başlatır.",
            usage: "yetkilial @etiket/id",
            examples: ["yetkibaslat 853011311328100411"],
            category: "Management",
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "yetkilialım"],
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));

        if (!mentioned.user.username.includes(client.config.tag)) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));

    
        await mentioned.roles.add("848920653633028170")
        await message.inlineReply(new Discord.MessageEmbed()
        .setColor("BLACK")
        .setDescription(`${mentioned.toString()} Kullanıcısı Artık Yeni Yetkilimiz!`))
        
      }
}

module.exports = Upgrade;