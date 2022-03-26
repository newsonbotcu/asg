const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const { stripIndents } = require("common-tags");
const children = require("child_process");
const VoiceChannels = require("../../../../../MODELS/Datalake/VoiceChannels");
const request = require("request");
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "rolsüz",
            description: "Herhangi bir rolü olmayan kullanıcıları kayıtsız yapar",
            usage: "rolsüz",
            examples: ["rolsüz"],
            category: "OWNER",
            aliases: [],
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

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let rolsuz = message.guild.members.cache.filter(a => a.roles.cache.size <= 1)
        if (rolsuz.size == 0) return await message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        await rolsuz.forEach(async member => {
            await member.roles.add(roles.get("welcome").value());
        });
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        await message.inlineReply(new Discord.MessageEmbed().setDescription(`\`\`\`Herhangi bir rolü olmayan ${rolsuz.size} kişiye kayıtsız rolü verildi.\`\`\``).setColor('#6be4a2'));

    }

}

module.exports = Kur;