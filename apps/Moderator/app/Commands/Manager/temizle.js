const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Avatar extends Command {

    constructor(client) {
        super(client, {
            name: "temizle",
            description: "mesaj atılan kanalda belirtilen sayıdalki mesajları temizler.",
            usage: "temizle 10",
            examples: ["temizle 10", "temizle 100"],
            category: "Düzen",
            aliases: ["sil"],
            accaptedPerms: ["root", "owner","cmd-ceo", "cmd-dobule"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));

        function allah(anan) {
            var reg = new RegExp("^\\d+$");
            var valid = reg.test(anan);
            return valid;
        }

        if (!allah(args[0])) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));


        const amount = args[0];

        if (!amount) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (isNaN(amount)) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));

        if (amount > 100) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (amount < 1) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));

        await message.channel.messages.fetch(
            { limit: amount }).then(messages => {
                message.channel.bulkDelete(messages);
                message.inlineReply(`${messages.size} Mesaj Temizlenmiştir`)
            });

    }
}

module.exports = Avatar;