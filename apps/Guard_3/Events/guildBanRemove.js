const { ClientEvent } = require('../../../base/utils');
class GuildBanRemove extends ClientEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }

    async run(guild, user) {
        const client = this.client;
        if (guild.id !== client.config.server) return;
        const entry = await client.fetchEntry("MEMBER_BAN_REMOVE");
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        if (entry.executor.bot) return;
        const permission = await client.models.crimeData.findOne({ user: entry.executor.id, type: "unban", effect: "member" });
        if ((permission && (permission.count > 0))) {
            if (permission) await client.models.perms.updateOne({
                user: entry.executor.id,
                type: "unban",
                effect: "member"
            }, { $inc: { count: -1 } });
            const peer = {
                reason: entry.reeason ? entry.reason : "Belirtilmemiş",
                executor: entry.executor.id,
                type: "UnBan",
                created: new Date()
            };
            const records = await client.models.crimeData.findOne({ _id: user.id });
            if (!records) {
                const record = new client.models.crimeData({ _id: user.id, records: [] });
                await record.save();
            }
            await client.models.crimeData.updateOne({ _id: user.id }, { $push: { records: peer } });
            client.handler.emit('Logger', 'Guard', entry.executor.id, "MEMBER_BAN_REMOVE", `${user.username} isimli kullanıcının banını kaldırdı. Kalan izin sayısı ${permission ? permission.count - 1 : "sınırsız"}`);
            return;
        }
        if (permission) await client.models.perms.deleteOne({ user: entry.executor.id, type: "unban", effect: "member" });
        await guild.members.ban(user.id, { reason: "Sağ Tık UnBan" });
        const exeMember = guild.members.cache.get(entry.executor.id);
        client.handler.emit('Jail', exeMember, client.user.id, "* Sağ Tık UnBan", "Perma", 0);
        client.handler.emit('Logger', 'KDE', entry.executor.id, "MEMBER_BAN_REMOVE", `${user.username} isimli kullanıcının banını kaldırdı`);

    }
}

module.exports = GuildBanRemove;