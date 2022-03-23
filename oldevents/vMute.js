const { ClientEvent } = require('../base/utils');
class PermaBanEvent extends ClientEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }
    async run(member, executor, reason, duration) {
        const client = this.client;
        const voice = member.voice;
        if (voice && voice.channel) await voice.setMute(true, reason);
        const Ban = await this.client.models.vmute.findOne({ _id: member.user.id });
        if (!Ban) {
            await this.client.models.vmute.create({
                _id: member.user.id,
                executor: executor,
                reason: reason,
                duration: Number(duration) || 0,
                created: new Date()
            });
        }
        client.handler.emit('Record', executor, member.user.id, reason, "V-Mute", "temp", duration);
    }
}
module.exports = PermaBanEvent;
