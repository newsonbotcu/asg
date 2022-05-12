const { ClientEvent } = require('../../../../base/utils');
const { CronJob } = require('cron');

class ControlBan extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "_ready"
        });
        this.client = client;
    }

    async run(client) {
        this.data = await this.init();
        const Banneds = new Map();
        const mapcron = new CronJob('*/1 * * * * *', async () => {
            const now = new Date();
            let asd = await this.client.models.penalties.find();
            asd.filter((ban) => ban.duration !== "p" && now.getTime() - ban.created.getTime() >= (ban.duration - 1) * 3600000).forEach(async (ban) => {
                if (now.getTime() - ban.created.getTime() > ban.until.getTime()) {
                    switch (ban.typeOf) {
                        case "BAN":
                            await this.client.guild.members.unban(ban.userId);
                            break;

                        case "CMUTE":
                            if (this.client.guild.members.cache.get(ban.userId)) await this.client.guild.members.members.cache.get(ban.userId).roles.remove(this.data.roles["muted"]);
                            break;

                        case "JAIL":
                            await this.client.guild.members.cache.get(ban.userId).roles.add(ban.roles.map(rname => this.client.guild.roles.cache.find(role => role.name === rname) || this.data["member"]));
                            await this.client.guild.members.cache.get(ban.userId).roles.remove(this.data["prisoner"]);

                            break;

                        case "VMUTE":
                            if (this.client.guild.members.cache.get(doc.userId) && this.client.guild.members.cache.get(doc.userId).voice.channel) await this.client.guild.members.cache.get(doc.userId).voice.setMute(false);
                            break;

                        default:
                            break;
                    }
                }
                if (!Banneds.has(ban._id)) Banneds.set(ban._id, {
                    id: ban._id,
                    ms: (d) => ban.until.getTime() - d.getTime()
                });
            });
        });
        mapcron.start();
        const checkbans = new CronJob('* * * * * *', () => {
            while (Banneds.size !== 0) {
                Banneds.forEach((ban) => {
                    setTimeout(async () => {
                        switch (ban.typeOf) {
                            case "BAN":
                                await this.client.guild.members.unban(ban.userId);
                                break;
    
                            case "CMUTE":
                                if (this.client.guild.members.cache.get(ban.userId)) await this.client.guild.members.members.cache.get(ban.userId).roles.remove(this.data.roles["muted"]);
                                break;
    
                            case "JAIL":
                                await this.client.guild.members.cache.get(ban.userId).roles.add(ban.roles.map(rname => this.client.guild.roles.cache.find(role => role.name === rname) || this.data["member"]));
                                await this.client.guild.members.cache.get(ban.userId).roles.remove(this.data["prisoner"]);
    
                                break;
    
                            case "VMUTE":
                                if (this.client.guild.members.cache.get(doc.userId) && this.client.guild.members.cache.get(doc.userId).voice.channel) await this.client.guild.members.cache.get(doc.userId).voice.setMute(false);
                                break;
    
                            default:
                                break;
                        }
                        Banneds.delete(ban.id);
                    }, ban.ms(new Date()));
                });
            }
        });
        checkbans.start();


    }
}
module.exports = ControlBan