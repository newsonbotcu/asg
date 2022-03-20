const Discord = require('discord.js');
const { CliEvent } = require('../../../base/utils');
class RoleUpdate extends CliEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }
    async run(oldRole, curRole) {
        const client = this.client;
        if (curRole.guild.id !== client.config.server) return;
        const entry = await curRole.guild.fetchAuditLogs({ type: 'ROLE_UPDATE' }).then(logs => logs.entries.first());
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await client.models.perms.findOne({ user: entry.executor.id, type: "update", effect: "role" });
        if ((permission && (permission.count > 0))) {
            if (permission) await client.models.perms.updateOne({ user: entry.executor.id, type: "update", effect: "role" }, { $inc: { count: -1 } });
            await client.models.bc_roles.updateOne({ _id: curRole.id }, {
                name: curRole.name,
                color: curRole.hexColor,
                hoist: curRole.hoist,
                mentionable: curRole.mentionable,
                rawPosition: curRole.rawPosition,
                bitfield: curRole.permissions.bitfield
            });
            if (oldRole.name !== curRole.name) {
                await client.models.members.updateMany({ roles: oldRole.name }, { $push: { roles: curRole.name } });
                await client.models.members.updateMany({ roles: oldRole.name }, { $pull: { roles: oldRole.name } });
            }
            client.handler.emit('Logger', 'Guard', entry.executor.id, "ROLE_UPDATE", `${oldRole.name} isimli rolü güncelledi. Kalan izin sayısı ${permission ? permission.count - 1 : "sınırsız"}`);
            return;
        }
        client.handler.emit("Danger", ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        const exeMember = curRole.guild.members.cache.get(entry.executor.id);
        client.handler.emit('Jail', exeMember, client.user.id, "KDE - Rol Güncelleme", "Perma", 0);
        await client.models.perms.deleteOne({ user: entry.executor.id, type: "update", effect: "role" });
        const data = await client.models.bc_roles.findOne({ _id: curRole.id });
        await curRole.edit({
            name: data.name,
            color: data.hexColor,
            hoist: data.hoist,
            mentionable: data.mentionable,
            position: data.rawPosition,
            permissions: new Discord.Permissions(data.bitfield)
        });
        client.handler.emit('Logger', 'KDE', entry.executor.id, "ROLE_UPDATE", `${oldRole.name} isimli rolü yeniledi`);

    }
}
module.exports = RoleUpdate;