const { ClientEvent } = require('../../../base/utils');
class GuildBanAdd extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "guildBanAdd",
            action: "MEMBER_BAN_ADD",
            punish: "ban"
        });
        this.client = client;
    }
    async refix(guild, user) {
        await guild.members.unban(user.id, `${this.audit.executor.username} (${this.audit.executor.id}) tarafından "Sağ Tık Ban" işlemi uygulandı. (ref: ${this.audit.id})`);

    }
    async rebuild(guild, user) {
        const client = this.client;
        await client.models.penalties.create({
            reason: this.audit.reason ? this.audit.reason : "Belirtilmemiş",
            executor: this.audit.executor.id,
            user: user.id,
            type: "ban",
            created: new Date()
        });
    }
}

module.exports = GuildBanAdd;