const { CliEvent } = require('../../../../base/utils');
const { CronJob } = require('cron');

class ControlBan extends CliEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }

    async run(client) {
        this.data = await this.init();
        const Banneds = new Map();
        const mapcron = new CronJob('*/30 * * * * *', async () => {
            const now = new Date();
            let asd = await this.client.models.mod_ban.find();
            asd.filter((ban) => ban.type === "temp" && now.getTime() - ban.created.getTime() >= (ban.duration - 1) * 3600000).forEach((ban) => {
                const date = require('moment')(ban.created).add(ban.duration, 'd').toDate();
                if (now.getTime() - ban.created.getTime() > date.getTime()) {
                    await this.client.guild.members.unban(doc._id);
                    await this.client.models.mod_ban.deleteOne({ _id: doc._id });
                }
                if (!Banneds.has(ban._id)) Banneds.set(ban._id, {
                    id: ban._id,
                    ms: (d) => date.getTime() - d.getTime()
                });
            });
        });
        mapcron.start();
        const checkbans = new CronJob('* */2 * * * *', () => {
            while (Banneds.size !== 0) {
                Banneds.forEach((ban) => {
                    setTimeout(async () => {
                        await this.client.guild.members.unban(ban.id);
                        await this.client.models.mod_ban.deleteOne({ _id: ban.id });
                        Banneds.delete(ban.id);
                    }, ban.ms(new Date()));
                });
            }
        });
        checkbans.start();


    }
}
module.exports = ControlBan