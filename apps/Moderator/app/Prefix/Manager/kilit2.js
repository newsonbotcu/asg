const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
class Lock extends Command {
    constructor(client) {
        super(client, {
            name: "kilit2",
            description: "Mesajın atıldığı kanalı kilitler",
            usage: "kilit2",
            examples: ["lock"],
            cooldown: 300000,
            category: "Düzen",
            accaptedPerms: ["root", "owner", "cmd-ceo","cmd-double",]
        });
    }

    async run(client, message, args) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (!message.member.hasPermission("ADMINISTRATOR")) return;
        
        const everyone = message.channel.permissionsFor(message.guild.id).has("SEND_MESSAGES");
        const embed = new Discord.MessageEmbed()
       await message.inlineReply(embed
                .setFooter(`Tantoony sizi önemsiyor (:`)
                .setColor("RANDOM")
                .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                .setDescription(`Başarılı bir şekilde kanal \`${everyone ? "kilitlendi" : "açıldı"}!\``)
        ).then(msg => msg.delete({ timeout: 5000 }));

         message.channel.updateOverwrite(message.guild.id, {
            SEND_MESSAGES: !everyone,
        });
        await message.channel.updateOverwrite(roles.get("cmd-ceo").value(), {
            SEND_MESSAGES: true
        });
        await message.channel.updateOverwrite(roles.get("owner").value(), {
            SEND_MESSAGES: true
        });
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
    }
}

module.exports = Lock;