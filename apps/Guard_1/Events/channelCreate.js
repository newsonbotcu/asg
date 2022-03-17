class ChannnelCreate {
    constructor(client) {
        this.client = client;
    }
    async run(channel) {
        const client = this.client;
        if (channel.guild.id !== client.config.server) return;
        const entry = await client.fetchEntry("CHANNEL_CREATE");
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await client.models.perms.findOne({ user: entry.executor.id, type: "create", effect: "channel" });
        if ((permission && (permission.count > 0))) {
            if (permission) await client.models.perms.updateOne({ user: entry.executor.id, type: "create", effect: "channel" }, { $inc: { count: -1 } });
            if ((channel.type === 'text') && (channel.type === 'news')) {
                await client.models.bc_text.create({
                    _id: channel.id,
                    name: channel.name,
                    nsfw: channel.nsfw,
                    parentID: channel.parentID,
                    position: channel.position,
                    rateLimit: channel.rateLimitPerUser
                });
            }
            if (channel.type === 'voice') {
                await client.models.bc_voice.create({
                    _id: channel.id,
                    name: channel.name,
                    bitrate: channel.bitrate,
                    parentID: channel.parentID,
                    position: channel.position
                });
            }
            if (channel.type === 'category') {
                await client.models.bc_cat.create({
                    _id: channel.id,
                    name: channel.name,
                    position: channel.position
                });
            }
            client.extention.emit('Logger', 'Guard', entry.executor.id, "CHANNEL_CREATE", `${channel.name} isimli kanalı açtı. Kalan izin sayısı ${permission ? permission.count - 1 : "sınırsız"}`);
            return;
        }
        if (permission) await client.models.perms.deleteOne({ user: entry.executor.id, type: "create", effect: "channel" });
        client.extention.emit('Danger', ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        await channel.delete(`${entry.executor.username} Tarafından oluşturulmaya çalışıldı`);
        const exeMember = channel.guild.members.cache.get(entry.executor.id);
        client.extention.emit('Jail', exeMember, client.user.id, "KDE - Kanal Oluşturma", "Perma", 0);
        client.extention.emit('Logger', 'KDE', entry.executor.id, "CHANNEL_CREATE", `${channel.name} isimli kanalı sildi`);
    }
}
module.exports = ChannnelCreate;
