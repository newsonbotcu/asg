const { ClientEvent } = require('../base/utils');

class EmitRunJail extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "jail"
        });
        this.client = client;
    };

    async run(member, executor, reason, duration, note) {
        const memberRoles = member.roles.cache.filter(role => role.id !== this.data.roles["booster"][0]).map(role => role.id);
        await member.roles.remove(memberRoles);
        await member.roles.add(this.data.roles["prisoner"]);
        if (duration === "p") duration = null;
        const docum = await this.client.models.penal.create({
            userId: member.user.id,
            executor: executor,
            reason: reason,
            extras: [],
            type: "JAIL",
            until: require('moment')(new Date()).add(duration || "0s"),
            created: new Date()
        });
        if (!duration) await this.client.models.penal.updateOne({ _id: docum._id }, {
            $push: {
                extras: [
                    {
                        subject: "perma",
                        data: true
                    }
                ]
            }
        });
        await memberRoles.forEach(async (roleId) => {
            await this.client.models.penal.updateOne({ _id: docum._id }, {
                $push: {
                    extras: [
                        {
                            subject: "role",
                            data: roleId
                        }
                    ]
                }
            });
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
