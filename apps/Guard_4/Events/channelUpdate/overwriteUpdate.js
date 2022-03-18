const Discord = require('discord.js');
const { CliEvent } = require('../../../../base/utils');
class OverwriteUpdate extends CliEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }

    async run(oldChannel, curChannel) {
        const client = this.client;
        if (curChannel.guild.id !== client.config.server) return;
        const entry = await curChannel.guild.fetchAuditLogs({ type: "CHANNEL_OVERWRITE_UPDATE" }).then(logs => logs.entries.first());
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        if (entry.target.id !== curChannel.id) return;
        const permission = await client.models.perms.findOne({ user: entry.executor.id, type: "overwrite", effect: "channel" });
        if ((permission && (permission.count > 0))) {
            if (permission) await client.models.perms.updateOne({
                user: entry.executor.id,
                type: "overwrite",
                effect: "channel"
            }, { $inc: { count: -1 } });
            const document = await client.models.bc_ovrts.findOne({ _id: curChannel.id });
            if (!document) {
                await client.models.bc_ovrts.create({ _id: curChannel.id, overwrites: [] });
            } else {
                await client.models.bc_ovrts.updateOne({ _id: curChannel.id }, { $pullAll: { overwrites: document.overwrites } });
            }
            await client.models.bc_ovrts.updateOne({ _id: curChannel.id }, { overwrites: curChannel.permissionOverwrites.array() });
            client.extention.emit('Logger', 'Guard', entry.executor.id, "CHANNEL_OVERWRITE_UPDATE", `${curChannel.name} isimli kanalda izin yeniledi. Kalan izin sayısı ${permission.count - 1}`);
            return;
        }
        await client.models.perms.deleteOne({ user: entry.executor.id, type: "overwrite", effect: "channel" });
        client.extention.emit("Danger", ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        const overwrits = await client.models.bc_ovrts.findOne({ _id: curChannel.id });
        const options = [];
        await overwrits.overwrites.forEach(data => {
            options.push({
                id: data.id,
                allow: new Discord.Permissions(data.allow.bitfield).toArray(),
                deny: new Discord.Permissions(data.deny.bitfield).toArray()
            });
        });
        console.log(options);
        const exeMember = curChannel.guild.members.cache.get(entry.executor.id);
        client.extention.emit('Jail', exeMember, client.user.id, "KDE - İzin Yenileme", "Perma", 0);
        client.extention.emit('Logger', 'KDE', entry.executor.id, "CHANNEL_OVERWRITE_UPDATE", `${entry.executor.username} ${oldChannel.name} isimli kanalın izinleriyle oynadı`);
        await curChannel.overwritePermissions(options);
    }
}

module.exports = OverwriteUpdate;