const { ClientEvent } = require("../../../base/utils");

class Ready extends ClientEvent {

    constructor(client) {
        super(client, {
            name: "ready"
        });
        this.client = client;
        this.data = this.loadMarks();
    }

    /**
     *
     * @param {Tantoony} client
     * @returns {Promise<void>}
     */
    async run() {
        this.client.invites = await this.client.guild.invites.fetch();
        if (client.guild.vanityURLCode) {
            await this.client.guild.fetchVanityData().then(async (res) => {
                this.client.vanityUses = res.uses;
            }).catch(console.error);
        }
        await this.client.guild.members.cache.forEach(async (member) => {
            let doc = await this.client.models.membership.findOne({ _id: member.user.id });
            if (!doc) {
                await this.client.models.membership.create({
                    _id: member.user.id,
                    roles: member.roles.cache.map(role => role.name)
                });
            } else {
                await this.client.models.membership.updateOne({ _id: member.user.id }, {
                    $set: {
                        roles: member.roles.cache.map(role => role.name)
                    }
                });
            }
            this.client.log(` [KİTAPLIĞA EKLENDİ] : ${member.user.username}`, "mongo");
        });
        await this.client.log(` [KAYITLAR TAMAMLANDI] `, "mongo");
    }
}
module.exports = Ready;
