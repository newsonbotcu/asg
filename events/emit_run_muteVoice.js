const { ClientEvent } = require('../base/utils');
class EmitRunMuteV extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "vmute"
        });
        this.client = client;
    }
    async run(targetId, executorId, reason, duration, note) {
        const member = this.client.guild.members.cache.get(targetId);
        const voice = member.voice;
        if (voice && voice.channel) await voice.setMute(true, reason);
        const docum = await this.client.models.penalties.create({
            userId: targetId,
            executor: executorId,
            reason: reason,
            extras: [],
            typeOf: "VMUTE",
            until: require('moment')().add(`${duration}m`).toDate(),
            created: new Date()
        });
        if (note) await this.client.models.penalties.updateOne({ _id: docum._id }, {
            $push: {
                extras: [
                    {
                        subject: "note",
                        data: note
                    }
                ]
            }
        });
    }
}
module.exports = EmitRunMuteV;
