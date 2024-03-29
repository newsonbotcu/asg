const { DotCommand } = require("../../../../base/utils");
class Avatar extends DotCommand {

    constructor(client) {
        super(client, {
            name: "avatar",
            description: "Etiketlenen kişinin avatarını gösterir",
            usage: "avatar @etiket/id",
            examples: ["avatar", "avatar 674565119161794560"],
            category: "Genel",
            cmdChannel: "bot-komut",
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        message.reply(mentioned.user.displayAvatarURL({ dynamic: true, size: 2048 }), { allowedMentions: { repliedUser: false } });
    }
}

module.exports = Avatar;