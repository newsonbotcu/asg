const { ClientEvent } = require('../../../base/utils');
class EmojiUpdate extends ClientEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }

    async run(oldEmoji, curEmoji) {
        const client = this.client;
        if (curEmoji.guild.id !== client.config.server) return;
        const entry = await client.fetchEntry("EMOJI_UPDATE");
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await client.models.perms.findOne({ user: entry.executor.id, type: "update", effect: "emoji" });
        if ((permission && (permission.count > 0))) {
            if (permission) await client.models.perms.updateOne({
                user: entry.executor.id,
                type: "update",
                effect: "emoji"
            }, { $inc: { count: -1 } });
            client.handler.emit('Logger', 'Guard', entry.executor.id, "EMOJI_UPDATE", `${oldEmoji.name} isimli emojiyi yeniledi. Kalan izin sayısı ${permission ? permission.count - 1 : "sınırsız"}`);
            return;
        }
        if (permission) await client.models.perms.deleteOne({ user: entry.executor.id, type: "update", effect: "emoji" });
        const emoji = await curEmoji.edit({
            name: oldEmoji.name,
            roles: oldEmoji.roles
        }, `${entry.executor.username} Tarafından değiştirilmeye çalışıldı`);
        const exeMember = curEmoji.guild.members.cache.get(entry.executor.id);
        client.handler.emit('Jail', exeMember, client.user.id, "* Emoji Yenileme", "Perma", 0);
        client.handler.emit('Logger', 'KDE', entry.executor.id, "EMOJI_UPDATE", `${oldEmoji.name} isimli emojiyi yeniledi`);

    }
}

module.exports = EmojiUpdate;