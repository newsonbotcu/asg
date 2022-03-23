const { ClientEvent } = require('../../../base/utils');
class GuildBanAdd extends ClientEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }

    async run(guild, user) {
        const client = this.client;
        if (guild.id !== client.config.server) return;
        const entry = await client.fetchEntry("MEMBER_BAN_ADD");
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        if (entry.executor.bot) return;
        
        const banlogs = await this.client.models.find();
        const banlog = banlogs.filter(log => log.records.some(record => (record.type === "Perma") && (record.executor === entry.executor.id) && (record.punish === "Ban") && (this.client.functions.checkDays(record.created) <= 1)));
        const permission = await client.models.crimeData.findOne({ user: entry.executor.id, type: "ban", effect: "member" });
        if ((permission && (permission.count > 0))) {
            if (permission) await client.models.perms.updateOne({ user: entry.executor.id, type: "ban", effect: "member" }, { $inc: { count: -1 } });
            const peer = {
                reason: entry.reeason ? entry.reason : "Belirtilmemiş",
                executor: entry.executor.id,
                punish: "Ban",
                type: "Perma",
                duration: 0,
                created: new Date()
            };
            const records = await client.models.crimeData.findOne({ _id: user.id });
            if (!records) await client.models.crimeData.create({ _id: user.id, records: [] });
            await client.models.crimeData.updateOne({ _id: user.id }, { $push: { records: peer } });
            client.handler.emit('Logger', 'Guard', entry.executor.id, "MEMBER_BAN_ADD", `${user.username} kulllanıcısını banladı. Kalan izin sayısı ${permission ? permission.count - 1 : "sınırsız"}`);
            return;
        }
        if (permission) await client.models.perms.deleteOne({ user: entry.executor.id, type: "ban", effect: "member" });
        await guild.members.unban(user.id, "Sağ Tık Ban");
        const exeMember = guild.members.cache.get(entry.executor.id);
        client.handler.emit('Jail', exeMember, client.user.id, "KDE - Sağ Tık Ban", "Perma", 0);
        client.handler.emit('Logger', 'KDE', entry.executor.id, "MEMBER_BAN_ADD", `${user.username} isimli kullanıcıyı banladı`);

    }
}

module.exports = GuildBanAdd;