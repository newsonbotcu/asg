const { ClientEvent } = require("../../../base/utils");

class Ready extends ClientEvent {

    constructor(client) {
        super(client, {
            name: "_ready"
        });
        this.client = client;
    }

    async run() {
        this.client.invites = await this.client.guild.invites.fetch();
        if (this.client.guild.vanityURLCode) {
            await this.client.guild.fetchVanityData()
                .then(async (res) => {
                    this.client.vanityUses = res.uses;
                })
                .catch(console.error);
        }
        this.client.guild.members.cache.forEach(async (member) => {
            let roles = [];
            await member.roles.cache.forEach(async (rl) => {
                const doc = await this.client.models.roles.findOne({ roleId: rl.id });
                roles.push(doc._id);
            });
            const doc = await this.client.models.membership.findOne({ _id: member.user.id });
            if (!doc) {
                await this.client.models.membership.create({
                    _id: member.user.id, roles: roles,
                });
            } else {
                await this.client.models.membership.updateOne({ _id: member.user.id }, {
                    $set: {
                        roles: roles
                    }
                });
            }
        });
        this.client.log(`[KAYITLAR TAMAMLANDI] `, "mongo");
    }
}

module.exports = Ready;
