const { ClientEvent } = require('../base/utils');
class Ready extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "ready"
        });
        this.client = client;
    }

    async run() {
        const client = this.client;
        client.guild = await client.guilds.fetch({
            guild: client.config.server,
            withCounts: true
        });
        client.owner = client.users.cache.get(client.config.owner);
        client.log(`${client.user.tag}, ${client.users.cache.size} kişi için hizmet vermeye hazır!`, "ready");
        await client.user.setPresence({ activities: client.config.status, status: "idle" });
        if (this.data.channels["lastCrush"]) {
            await client.channels.cache.get(this.data.channels["lastCrush"]).send("**TEKRAR ONLINE!**");
        }
        this.client.handler.hello(client);
    }
}
module.exports = Ready;
