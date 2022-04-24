const { ClientEvent } = require("../../../base/utils");

class InviteDelete extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "inviteDelete",
            audit: "INVITE_DELETE"
        })
        this.client = client;
    }

    async run(invite) {
        if (invite.guild.id !== this.client.config.server) return;
        const entry = await invite.guild.fetchAuditLogs({ type: "INVITE_DELETE" }).then(logs => logs.entries.first());
        if (entry.createdTimestamp <= Date.now() - 1000) return;
        await invite.guild.fetchInvites().yhen(gInvites => { this.client.invites[invite.guild.id] = gInvites });
        if (data.other["root"].includes(entry.executor.id)) return;
        const exeMember = invite.guild.members.cache.get(entry.executor.id);
        if (exeMember.roles.cache.has(data.roles["root"])) return;
        client.handler.emit("jail", exeMember, this.client.user.id, "* Davet Silme", "Perma", 1);
        invite.guild.channels.cache.get(data.channels["guard"]).send(`${data.emojis["davet"]} ${exeMember} bir daveti sildi!`);

    }
}
module.exports = InviteDelete;