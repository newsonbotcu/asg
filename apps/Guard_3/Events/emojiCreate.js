const { ClientEvent } = require('../../../base/utils');
class EmojiCreate extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "roleDeletex",
            action: "ROLE_DELETE",
            punish: "ban",
            privity: true
        });
        this.client = client;
    }

    async run(emoji) {
        const client = this.client;
        if (emoji.guild.id !== client.config.server) return;
        const entry = await client.fetchEntry("EMOJI_CREATE");
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await client.models.perms.findOne({ user: entry.executor.id, type: "create", effect: "emoji" });
        if ((permission && (permission.count > 0))) {
            if (permission) await client.models.perms.updateOne({
                user: entry.executor.id,
                type: "create",
                effect: "emoji"
            }, { $inc: { count: -1 } });
            client.handler.emit('Logger', 'Guard', entry.executor.id, "EMOJI_CREATE", `${emoji.name} isimli emojiyi oluşturdu. Kalan izin sayısı ${permission ? permission.count - 1 : "sınırsız"}`);
            return;
        }
        if (permission) await client.models.perms.deleteOne({ user: entry.executor.id, type: "create", effect: "emoji" });
        const exeMember = emoji.guild.members.cache.get(entry.executor.id);
        client.handler.emit('Jail', exeMember, client.user.id, "* Emoji Oluşturma", "Perma", 0);
        client.handler.emit('Logger', 'KDE', entry.executor.id, "EMOJI_CREATE", `${emoji.name} isimli emojiyi oluşturdu`);
        
    }
}

module.exports = EmojiCreate;