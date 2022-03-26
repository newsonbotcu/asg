const Command = require("../../../Base/Command");
const low = require('lowdb');
class Link extends Command {

    constructor(client) {
        super(client, {
            name: "link",
            description: "sunucunun linkini gönderir",
            usage: "link",
            examples: ["link"],
            cmmChannel: "bot-komut",
            cooldown: 300000,
        });
    }

    async run(client, message, args) {
        if (!message.guild.vanityURLCode) return;
        const emojis = await low(client.adapters('emojis'));
        message.inlineReply(`discord.gg/${message.guild.vanityURLCode}`);
        function bar(point, maxPoint) {
            const deger = Math.trunc(point * 10 / maxPoint);
            let str = "";
            for (let index = 2; index < 9; index++) {
                if ((deger / index) >= 1) {
                    str = str + emojis.get("ortabar_dolu").value()
                } else {
                    str = str + emojis.get("ortabar").value()
                }
            }
            if (deger === 0) {
                str = `${emojis.get("solbar").value()}${str}${emojis.get("sagbar").value()}`
            } else if (deger === 10) {
                str = `${emojis.get("solbar_dolu").value()}${str}${emojis.get("sagbar_dolu").value()}`
            } else {
                str = `${emojis.get("solbar_dolu").value()}${str}${emojis.get("sagbar").value()}`
            }
            return str;
        }
    }
}

module.exports = Link;