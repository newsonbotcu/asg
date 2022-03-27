const { ClientEvent } = require("../../../base/utils");

class GuildMemberKick extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "guildMemberRemove",
            audit: "MEMBER_KICK"
        })
        this.client = client;
    }

    async run(member) {
        this.data = this.loadMarks();
        const client = this.client;
        if (member.guild.id !== client.config.server) return;
        const model = await client.models.membership.findOne({ _id: cur.user.id });
        if (model) await client.models.membership.delete({ _id: member.user.id });
        const entry = await member.guild.fetchAuditLogs({ type: "MEMBER_KICK" }).then(logs => logs.entries.first());
        if ((this.audit.target.id === member.user.id) && entry.createdTimestamp >= Date.now() - 1000) {
            const exeMember = member.guild.members.cache.get(entry.executor.id);
            client.handler.emit("Jail", exeMember, this.client.user.id, "* Üye Atma", "Perma", 1);
            return;
        }
    }
}
module.exports = GuildMemberKick;