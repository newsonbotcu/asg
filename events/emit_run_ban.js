const { ClientEvent } = require("../base/utils");

class EmitRunBan extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "ban"
        });
        this.client = client;
        this.data = this.loadMarks();
    }

    async run(userId, executorId, reason, duration, note, clear) {
        const member = await this.client.guild.members.fetch(userId);
        const executor = await this.client.guild.members.fetch(executorId);
        if (executor.roles.highest < member.roles.highest) return;
        await this.client.guild.members.ban(userId, {
            reason: reason,
            days: clear || 0
        });
        if (duration === "p") duration = null;
        const docum = await this.client.models.penal.create({
            userId: member.user.id,
            executor: executor,
            reason: reason,
            extras: [],
            type: "BAN",
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
        if (note) await this.client.models.penal.updateOne({ _id: docum._id }, {
            $push: {
                extras: {
                    subject: "note",
                    data: note
                }
            }
        })
    }

}

module.exports = EmitRunBan;