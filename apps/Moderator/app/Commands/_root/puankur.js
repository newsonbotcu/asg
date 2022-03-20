const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');

const Points_config = require('../../../../../MODELS/Economy/Points_config');
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "puankur",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
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
        if (!role) return await message.inlineReply("Böyle bir rol yok")
        await Points_config.create({
            _id: role.id,
            requiredPoint: args[1],
            expiringHours: args[2],
            registry: 0,
            invite: 0,
            tagged: 0,
            authorized: 0,
            message: 0,
            voicePublicPerMinute: 0,
            voiceOtherPerMinute: 0
        });
        await message.inlineReply(new Discord.MessageEmbed().setDescription(`${role} rolü için gereken görev yapılandırması oluşturuldu.`));
        
        
    }

}

module.exports = Kur;