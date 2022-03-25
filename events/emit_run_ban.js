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
        const docum = await this.client.models.penal.create({
            userId: userId,
            executor: executorId,
            reason: reason,
            type: duration ? "BAN" : "PERMABAN",
            extras: [],
            until: require('moment')(new Date()).add(duration),
            created: new Date()
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