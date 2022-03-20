const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');

class CountByRole extends Command {

    constructor(client) {
        super(client, {
            name: "rolrenk",
            description: "belirtilen rolün rengini yollar",
            usage: "rolrenk rolid",
            examples: ["rolrenk 718265023750996028"],
        //    cooldown: 3600000,
            category: "Yetkili",
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single"],
        });
    }

    async run(client, message, args) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentionedRole = message.guild.roles.cache.get(args[0]) || message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.includes(args[0]))
        if(!mentionedRole) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        //Ana sikm ! koymayı unutmuşum aq ajklshdlasd
        message.inlineReply(`\`\`\`${mentionedRole.name} Rolünün rengi: ${mentionedRole.hexColor}\`\`\``)
    }

}

module.exports = CountByRole;