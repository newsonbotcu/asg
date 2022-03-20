const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const izin = require('../../../../../MODELS/Temprorary/Permissions');
const keyz = require('shortid');
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "izinver",
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

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));


        let efct;
        if (args[1] === "emoji") efct = "emoji";
        if (args[1] === "rol") efct = "role";
        if (args[1] === "kanal") efct = "channel";
        if (!efct) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));

        let typo;
        if (args[2] === "ekle") typo = "create";
        if (args[2] === "sil") typo = "delete";
        if (args[2] === "yenile") typo = "update";
        if (!typo) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (!sayi(args[3])) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (!sayi(args[4])) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (args[4] > 5) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        const system = await izin.findOne({ user: mentioned.user.id, type: typo, effect: efct });
        if (system) {
            await izin.updateOne({ user: mentioned.user.id, type: typo, effect: efct }, { $inc: { count: args[3] } });
            await message.inlineReply(new Discord.MessageEmbed().setDescription(`İzin başarıyla yenilendi!`));
        } else {
            try {
                const sex = await izin({ _id: keyz.generate(), user: mentioned.user.id, count: args[3], type: typo, effect: efct, created: new Date(), time: args[4] });
                await sex.save();
            } catch (error) {
                console.log(error);
            };
            await message.inlineReply(new Discord.MessageEmbed().setDescription(`İzin başarıyla oluşturuldu!`));
        }

    }

}

module.exports = Kur;