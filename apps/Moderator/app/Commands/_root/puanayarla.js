const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');

const Points_config = require('../../../../../MODELS/Economy/Points_config');
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "puanayarla",
            description: "Açıklama Belirtilmemiş.",
            usage: "requiredPoint, expiringHours, registry, invite, tagged, authorized, message, voicePublicPerMinute, voiceOtherPerMinute",
            examples: ["Örnek Bulunmamakta"],
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

        const role = message.guild.roles.cache.find(r => r.name.toLowerCase().slice(2) === args[0]);
        if (!role) return await message.react(client.emoji("error"));
        await Points_config.updateOne({ _id: role.id }, {
            $set: {
                [args[1]]: args[2]
            }
        });
        await message.inlineReply(new Discord.MessageEmbed().setDescription(`${role} rolü için gereken görev yapılandırması oluşturuldu.`));


    }

}

module.exports = Kur;