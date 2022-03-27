const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');

class Booster extends Command {

    constructor(client) {
        super(client, {
            name: "booster",
            description: "Belirtilen ismi adınız yapar",
            usage: "booster Tantoony",
            examples: ["booster Tantoony"],
            category: "Genel",
            accaptedPerms: ["booster"],
            aliases: ["zengin", "bisim", "booserisim"],
            cooldown: 300000
        });
    }

    async run(client, message, args) {
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const isim = args.join(" ");
        if (!isim) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        let taglo = '•';
        if (client.config.tags[0].some(tag => message.member.user.username.includes(tag))) {
            taglo = client.config.tag[0];
        }
        await message.member.setNickname(`${taglo} ${isim}`);
        await message.react(data.emojis["ok"].split(':')[2].replace('>', ''));
    }
}

module.exports = Booster;