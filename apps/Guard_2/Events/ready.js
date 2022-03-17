class Ready {

    constructor(client) {
        this.client = client;
    }

    async run(client) {
        client = this.client.handler.hello(this.client);
        client.log(`${client.user.tag}, ${client.users.cache.size} kişi için hizmet vermeye hazır!`, "ready");
        client.user.setPresence({ activity: client.config.status, status: "idle" });
        const roles = client.guild.roles.cache.map(r => r);
        for (let index = 0; index < roles.length; index++) {
            const role = roles[index];
            const roleData = await client.models.bc_role.findOne({ _id: role.id });
            if (!roleData) await client.models.bc_role.create({
                _id: role.id,
                name: role.name,
                color: role.hexColor,
                hoist: role.hoist,
                mentionable: role.mentionable,
                rawPosition: role.rawPosition,
                bitfield: role.permissions
            });
        }
    }
}
module.exports = Ready;