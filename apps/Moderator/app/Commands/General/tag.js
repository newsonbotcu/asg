const Command = require("../../../Base/Command");
class Link extends Command {

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
        if (!client.config.tag) return;
        message.inlineReply(client.config.tag);
    }
}

module.exports = Link;