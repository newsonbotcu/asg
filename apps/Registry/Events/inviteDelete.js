const low = require('lowdb');

class InviteDelete {
    constructor(client) {
        this.client = client;
    }

    async run(invite) {
        if (invite.guild.id !== this.client.config.server) return;
        const entry = await invite.guild.fetchAuditLogs({ type: "INVITE_DELETE" }).then(logs => logs.entries.first());
        const utils = await low(this.client.adapters('utils'));
        const roles = await low(this.client.adapters('roles'));
        const channels = await low(this.client.adapters('channels'));
        const emojis = await low(this.client.adapters('emojis'));
        if (entry.createdTimestamp <= Date.now() - 1000) return;
        await invite.guild.fetchInvites().yhen(gInvites => { this.client.invites[invite.guild.id] = gInvites });
        if (utils.get("root").value().includes(entry.executor.id)) return;
        const exeMember = invite.guild.members.cache.get(entry.executor.id);
        if (exeMember.roles.cache.has(roles.get("root").value())) return;
        client.extention.emit("Jail", exeMember, this.client.user.id, "KDE - Davet Silme", "Perma", 1);
        invite.guild.channels.cache.get(channels.get("guard").value()).send(`${emojis.get("davet")} ${exeMember} bir daveti sildi!`);

    }
}
module.exports = InviteDelete;