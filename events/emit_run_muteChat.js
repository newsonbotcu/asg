const { ClientEvent } = require('../base/utils');
class EmitRunMuteC extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "cmute"
        });
        this.client = client;
    }
    async run(targetId, executorId, reason, duration, note) {
        const member = this.client.guild.members.cache.get(targetId);
        await member.roles.add(this.data.roles["muted"]);
        const docum = await this.client.models.penal.create({
            userId: targetId,
            executor: executorId,
            reason: reason,
            extras: [],
            typeOf: "CMUTE",
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
module.exports = EmitRunMuteC;
