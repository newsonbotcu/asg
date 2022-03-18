const { CliEvent } = require('../../../../base/utils');
const { CronJob } = require('cron');

class ControlCmute extends CliEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }

    async run(client) {
        this.data = await this.init();
        const cmuteds = new Map();
        const mapcron = new CronJob('*/1 * * * * *', async () => {
            const now = new Date();
            let asd = await this.client.models.mod_cmute.find();
            asd.filter((ban) => ban.type === "temp" && now.getTime() - ban.created.getTime() >= (ban.duration - 1) * 3600000).forEach((ban) => {
                const date = require('moment')(ban.created).add(ban.duration, 'm').toDate();
                if (now.getTime() - ban.created.getTime() > date.getTime()) {
                    if (this.client.guild.members.cache.get(doc._id)) await this.client.guild.members.members.cache.get(doc._id).roles.remove(this.data.roles["muted"]);
                    await this.client.models.mod_cmute.deleteOne({ _id: doc._id });
                }
                if (!cmuteds.has(ban._id)) cmuteds.set(ban._id, {
                    id: ban._id,
                    ms: (d) => date.getTime() - d.getTime()
                });
            });
        });
        mapcron.start();
        const checkbans = new CronJob('* * * * * *', () => {
            while (cmuteds.size !== 0) {
                cmuteds.forEach((ban) => {
                    setTimeout(async () => {
                        if (this.client.guild.members.cache.get(doc._id)) await this.client.guild.members.members.cache.get(doc._id).roles.remove(this.data.roles["muted"]);
                        await this.client.models.mod_cmute.deleteOne({ _id: doc._id });
                        cmuteds.delete(ban.id);
                    }, ban.ms(new Date()));
                });
            }
        });
        checkbans.start();


    }
}
module.exports = ControlCmute;