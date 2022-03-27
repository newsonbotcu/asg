const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
class Move extends Command {

    constructor(client) {
        super(client, {
            name: "kilit",
            description: "Mesajın atıldığı kanalı kilitler",
            usage: "kilit",
            examples: ["kilit"],
            cooldown: 3600000,
            category: "Düzen",
            accaptedPerms: ["root","owner", "cmd-ceo"]
        });
    }

    async run(client, message, args) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        if (args[0] && (args[0] === "aç")) {
            await message.react(data.emojis["ok"].split(':')[2].replace('>', ''));
            return await message.channel.updateOverwrite(message.guild.roles.everyone.id, {
                SEND_MESSAGES: null
            });
        }
        await message.channel.updateOverwrite(message.guild.roles.everyone.id, {
            SEND_MESSAGES: false
        });
        await message.channel.updateOverwrite(data.roles["cmd-ceo"], {
            SEND_MESSAGES: true
        });
        await message.channel.updateOverwrite(data.roles["owner"], {
            SEND_MESSAGES: true
        });
        await message.react(data.emojis["ok"].split(':')[2].replace('>', ''));
    }
}

module.exports = Move;