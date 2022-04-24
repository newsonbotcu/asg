const { ClientEvent } = require('../../../base/utils');
class EmojiDelete extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "roleCreate",
            action: "ROLE_CREATE",
            punish: "ban",
            privity: true
        });
        this.client = client;
    }
    async refix(emoji) {
        await emoji.guild.emojis.create(emoji.url, emoji.name, {
            reason: `${entry.executor.username} tarafından silinmiştir.`
        });
    }
}

module.exports = EmojiDelete;