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
        message.reply(`discord.gg/${message.guild.vanityURLCode}`);
        function bar(point, maxPoint) {
            const deger = Math.trunc(point * 10 / maxPoint);
            let str = "";
            for (let index = 2; index < 9; index++) {
                if ((deger / index) >= 1) {
                    str = str + data.emojis["ortabar_dolu"]
                } else {
                    str = str + data.emojis["ortabar"]
                }
            }
            if (deger === 0) {
                str = `${data.emojis["solbar"]}${str}${data.emojis["sagbar"]}`
            } else if (deger === 10) {
                str = `${data.emojis["solbar_dolu"]}${str}${data.emojis["sagbar_dolu"]}`
            } else {
                str = `${data.emojis["solbar_dolu"]}${str}${data.emojis["sagbar"]}`
            }
            return str;
        }
    }
}

module.exports = Link;