const { ClientEvent } = require('../base/utils');
class Record extends ClientEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }
    async run(user, executor, reason, punish, type, duration) {
        const peer = {
            reason: reason,
            executor: executor,
            punish: punish,
            type: type || "temp",
            duration: duration || 0,
            created: new Date()
        };
        const records = await this.client.models.crimeData.findOne({ _id: user });
        if (!records) {
            await this.client.models.crimeData.create({ _id: user, records: [] });
        }
        await this.client.models.crimeData.updateOne({ _id: user }, { $push: { records: peer } });
    }
}

module.exports = Record;