const { CliEvent } = require('../base/utils');
class BanEvt extends CliEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }
    async run(guild, user, executor, reason, type, duration, note) {
        const client = this.client;
        await guild.members.ban(user, { reason: reason })
        const Ban = await this.client.models.ban.findOne({ _id: user });
        if (!Ban) {
            await this.client.models.ban.create({
                _id: user,
                executor: executor,
                reason: reason,
                type: type,
                duration: Number(duration) || 0,
                created: new Date(),
                note: note
            });
        }
        client.extention.emit('Record', user, executor, reason, "Ban", type, duration);

    }
}
module.exports = BanEvt;
