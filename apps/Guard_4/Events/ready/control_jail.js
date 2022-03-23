const { ClientEvent } = require('../../../../base/utils');
const { CronJob } = require('cron');

class ControlJail extends ClientEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }

    async run(client) {
        this.data = await this.init();
        const cmuteds = new Map();
        const mapcron = new CronJob('* */1 * * * *', async () => {
            const now = new Date();
            let asd = await this.client.models.mod_jail.find();
            asd.filter((ban) => ban.type === "temp" && now.getTime() - ban.created.getTime() >= (ban.duration - 1) * 3600000).forEach((ban) => {
                const date = require('moment')(ban.created).add(ban.duration, 'h').toDate();
                if (now.getTime() - ban.created.getTime() > date.getTime()) {
                    await this.client.models.mod_jail.deleteOne({ _id: ban._id });
                    await this.client.guild.members.cache.get(ban._id).roles.add(ban.roles.map(rname => this.client.guild.roles.cache.find(role => role.name === rname) || this.data["member"]));
                    await this.client.guild.members.cache.get(ban._id).roles.remove(this.data["prisoner"]);
                }
                if (!cmuteds.has(ban._id)) cmuteds.set(ban._id, {
                    id: ban._id,
                    ms: (d) => date.getTime() - d.getTime()
                });
            });
        });
        mapcron.start();
        const checkbans = new CronJob('*/30 * * * * *', () => {
            while (cmuteds.size !== 0) {
                cmuteds.forEach((ban) => {
                    setTimeout(async () => {
                        await this.client.models.mod_jail.deleteOne({ _id: ban._id });
                        await this.client.guild.members.cache.get(ban._id).roles.add(ban.roles.map(rname => this.client.guild.roles.cache.find(role => role.name === rname) || this.data["member"]));
                        await this.client.guild.members.cache.get(ban._id).roles.remove(this.data["prisoner"]);
                        cmuteds.delete(ban.id);
                    }, ban.ms(new Date()));
                });
            }
        });
        checkbans.start();

    }
}
module.exports = ControlJail;