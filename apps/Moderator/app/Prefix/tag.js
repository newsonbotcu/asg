const { DotCommand } = require("../../../../base/utils");
class Link extends DotCommand {

    constructor(client) {
        super(client, {
            name: "tag",
            description: "sunucunun tagını gönderir",
            usage: "tag",
            examples: ["tag"],
            cooldown: 300000,
        });
    }

    async run(client, message, args) {
        if (client.config.tags.length === 0) return;
        message.inlineReply(`Kullanıcı adı için: **${client.config.tags.join("** - **")}**\nEtiket için: **${client.config.dis}**`);
    }
}

module.exports = Link;