const { ClientEvent } = require('../base/utils');
class EmitRunMuteC extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "cmute"
        });
        this.client = client;
        this.data = this.loadMarks();
    }
    async run(targetId, executorId, reason, duration, note) {
        const member = this.client.guild.members.cache.get(targetId);
        await member.roles.add(this.data.roles["muted"]);
        await this.client.models.penal.create({
            userId: targetId,
            executor: executorId,
            reason,
            type: "chat mute",
            note,
            until: require('moment')().add(duration),
            created: new Date()
        });
    }
}
module.exports = EmitRunMuteC;
