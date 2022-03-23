const { ClientEvent } = require('../base/utils');
class CMute extends ClientEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }

    async run(member, executor, reason, duration) {
        this.data = await this.init();
        const client = this.client;
        await member.roles.add(this.data.roles["muted"]);
        const mute = await client.models.cmute.findOne({ _id: member.user.id });
        if (!mute) {
            await client.models.cmute.create({
                _id: member.user.id,
                executor: executor,
                reason: reason,
                duration: Number(duration) || 0,
                created: new Date()
            });
        }
        client.handler.emit('Record', member.user.id, executor, reason, "C-Mute", "temp", duration);

    }
}
module.exports = CMute;
