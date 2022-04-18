const { ClientEvent } = require('../../../base/utils');

class Ready extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "_ready"
        });
        this.client = client;
    }

    async run() {
        const roles = this.client.guild.roles.cache.map(r => r);
        for (let index = 0; index < roles.length; index++) {
            const role = roles[index];
            const roleData = await this.client.models.roles.findOne({ roleId: role.id });
            if (!roleData) await this.client.models.roles.create({
                roleId: role.id,
                name: role.name,
                color: role.hexColor,
                hoist: role.hoist,
                mentionable: role.mentionable,
                rawPosition: role.rawPosition,
                bitfield: role.permissions.bitfield.toString()
            });
            this.client.log(`${role.name} başarıyla yedeklendi`);
        }
    }
}

module.exports = Ready;
