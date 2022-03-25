const { ClientEvent } = require('../base/utils');

class EmitRunJail extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "jail"
        });
        this.client = client;
        this.data = this.loadMarks();
    };

    async run(member, executor, reason, duration, note) {
        const memberRoles = member.roles.cache.map(c => c).filter(r => r.id !== this.data.roles["booster"]);
        await member.roles.remove(memberRoles);
        await member.roles.add(this.data.roles["prisoner"]);
        let deletedRoles = memberRoles.map(r => r.name);
        const docum = await this.client.models.penal.create({
            userId: member.user.id,
            executor: executor,
            reason: reason,
            extras: [],
            type: duration ? "JAIL" : "PERMAJAIL",
            until: require('moment')(new Date()).add(duration),
            created: new Date()
        });
        await this.client.models.penal.updateOne({ _id: docum._id }, {
            $push: {
                extras: [
                    {
                        subject: "roles",
                        data: deletedRoles
                    }
                ]
            }
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

module.exports = EmitRunJail;