const low = require('lowdb');

class PermaBanEvent {
    constructor(client) {
        this.client = client;
    };

    async run(member, executor, reason, duration) {
        const client = this.client;
        const roles = await low(client.adapters('roles'));
        await member.roles.add(roles.get("muted").value());
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
        client.extention.emit('Record', member.user.id, executor, reason, "C-Mute", "temp", duration);

    }
}
module.exports = PermaBanEvent;
