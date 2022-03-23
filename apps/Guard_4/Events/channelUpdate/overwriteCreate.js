const { ClientEvent } = require('../../../../base/utils');
class OverwriteCreate extends ClientEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }

    async run(oldChannel, curChannel) {
        const client = this.client;
        if (curChannel.guild.id !== client.config.server) return;
        const entry = await curChannel.guild.fetchAuditLogs({ type: "CHANNEL_OVERWRITE_CREATE" }).then(logs => logs.entries.first());
        if (entry.createdTimestamp <= Date.now() - 1000) return;
        if (entry.executor.id === client.user.id) return;
        if (entry.target.id !== curChannel.id) return;
        const permission = await client.models.perms.findOne({ user: entry.executor.id, type: "overwrite", effect: "channel" });
        if ((permission && (permission.count > 0))) {
            if (permission) await client.models.perms.updateOne({
                user: entry.executor.id,
                type: "overwrite",
                effect: "channel"
            }, { $inc: { count: -1 } });
            const newPerm = curChannel.permissionOverwrites.get(entry.extra.id);
            const document = await client.models.bc_ovrts.findOne({ _id: curChannel.id });
            if (!document) await client.models.bc_ovrts.create({ _id: curChannel.id, overwrites: [] });
            await client.models.bc_ovrts.updateOne({ _id: curChannel.id }, { $push: { overwrites: newPerm } });
            client.handler.emit('Logger', 'Guard', entry.executor.id, "CHANNEL_OVERWRITE_CREATE", `${curChannel.name} isimli kanalda izin oluşturdu. Kalan izin sayısı ${permission.count - 1}`);
            return;
        }
        await client.models.perms.deleteOne({ user: entry.executor.id, type: "overwrite", effect: "channel" });
        client.handler.emit("Danger", ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        const overwrits = await client.models.bc_ovrts.findOne({ _id: curChannel.id });
        const exeMember = curChannel.guild.members.cache.get(entry.executor.id);
        client.handler.emit('Jail', exeMember, client.user.id, "KDE - İzin Oluşturma", "Perma", 0);
        client.handler.emit('Logger', 'KDE', entry.executor.id, "CHANNEL_OVERWRITE_CREATE", `${oldChannel.name} isimli kanalın izinleriyle oynadı`);
        await curChannel.overwritePermissions(overwrits.overwrites);
    }
}

module.exports = OverwriteCreate;