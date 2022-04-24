const { ClientEvent } = require('../../../base/utils');
class GuildBanRemove extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "guildBanRemove"
        });
        this.client = client;
    }

    async run(guild, user) {
        const client = this.client;
        await client.models.penalties.updateOne({
            user: user.id,
            type: "ban",
            until: {
                $or: [
                    { $gt: new Date() },
                    { $exists: false }
                ]
            }
        }, { $set: { until: new Date() } });
        await guild.members.ban(user.id, { reason: "Sağ Tık UnBan" });
    }
}

module.exports = GuildBanRemove;