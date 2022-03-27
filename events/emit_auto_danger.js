const { ClientEvent } = require('../../base/utils');
class Ready extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "danger"
        });
        this.client = client;
    }

    async run(perms) {
        this.data = this.loadMarks();
        await this.client.guild.roles.cache.filter(role => role.permissions.cache.some(perm => perms.has(perm))).forEach(async (role) => {
            await role.setPermissions()
        })

    }
}
module.exports = Ready;