const low = require('lowdb');
class Ready {

    constructor(client) {
        this.client = client;
    }

    /**
     *
     * @param {Tantoony} client
     * @returns {Promise<void>}
     */
    async run(client) {
        client.logger.log(`${client.user.tag}, ${client.users.cache.size} kişi için hizmet vermeye hazır!`, "ready");
        client.user.setPresence({ activity: client.config.status, status: "idle" });
        //client = this.client.handler.hello(client);
        const utiller = await low(this.client.adapters('utils'));
        client.invites = await client.guild.invites.fetch();
        if (client.guild.vanityURLCode) {
            await client.guild.fetchVanityData().then(async (res) => {
                utiller.update("vanityUses", n => res.uses).write();
                console.log(res.uses);
            }).catch(console.error);
        }

        await client.guild.members.cache.forEach(async (mem) => {
            let system = await client.models.members.findOne({ _id: mem.user.id });
            if (!system) {
                try {
                    await client.models.members.create({ _id: mem.user.id, roles: mem.roles.cache.map(r => r.name).array() });
                    this.client.logger.log(` [KİTAPLIĞA EKLENDİ] : ${mem.user.username}`, "mngdb");
                } catch (error) {
                    throw error;
                }
            }
        });
        await this.client.logger.log(` [KAYITLAR TAMAMLANDI] `, "mngdb");
    }
}
module.exports = Ready;
