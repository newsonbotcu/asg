const low = require('lowdb');

class JailEvent {
    constructor(client) {
        this.client = client;
    };

    async run(member, executor, reason, type, duration, note) {
        const client = this.client;
        const roles = await low(client.adapters('roles'));
        const memberRoles = member.roles.cache.map(c => c).filter(r => r.id !== roles.get("booster").value());
        await member.roles.remove(memberRoles);
        await member.roles.add(roles.get("prisoner").value());
        let deletedRoles = await memberRoles.map(r => r.name);
        const Jail = await this.client.models.jail.findOne({ _id: member.user.id });
        if (!Jail) {
            this.client.models.jail.create({
                _id: member.user.id,
                executor: executor,
                reason: reason,
                roles: deletedRoles,
                type: type,
                duration: Number(duration) || 0,
                created: new Date(),
                note: note
            });
        } else {
            await this.client.models.jail.updateOne({ _id: member.user.id }, { $inc: { duration: Number(duration) || 0 } });
        }
        client.extention.emit('Record', member.user.id, executor, reason, "Jail", type, duration);
    }
}

module.exports = JailEvent;