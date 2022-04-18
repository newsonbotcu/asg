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
        const docum = await this.client.models.penal.create({
            userId: targetId,
            executor: executorId,
            reason: reason,
            extras: [],
            type: "VMUTE",
            until: require('moment')().add(duration),
            created: new Date()
        });
        if (note) await this.client.models.penal.updateOne({ _id: docum._id }, {
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
