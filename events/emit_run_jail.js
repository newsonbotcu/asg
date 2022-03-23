const { Model, model } = require('mongoose');
const { ClientEvent } = require('../base/utils');

class EmitedJail extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "jail"
        });
        this.client = client;
        this.data = this.loadMarks();
    };

    async run(member, executor, reason, type, duration, note) {
        const client = this.client;
        this.data = await this.init();
        const memberRoles = member.roles.cache.map(c => c).filter(r => r.id !== this.data.roles["booster"]);
        await member.roles.remove(memberRoles);
        await member.roles.add(this.data.roles["prisoner"]);
        let deletedRoles = await memberRoles.map(r => r.name);
        const Jail = await this.client.models.jail.findOne({ _id: member.user.id });
        const docum = await this.client.models.penal.create({
            executor: executor,
            reason: reason,
            roles: deletedRoles,
            extras: [],
            type: "JAIL",
            duration: Number(duration) || 0,
            created: new Date(),
            note: note
        });
        //find lemiyorsunki ama create de veiryi alırmı
        // video izliyoz gelicem geri
        await this.client.models.penal.updateOne({ _id: docum._id }, {
                $set: {
                    extras: [
                        {
                            subject: "roles"
                        }
                    ]
                }
            })
    }
}

module.exports = EmitedJail;