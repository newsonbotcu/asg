const { ClientEvent } = require('../base/utils');
class Ready extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "ready"
        });
        this.client = client;
    }

    async run() {
        this.data = this.loadMarks();
        const client = this.client;
        client.guild = client.guilds.cache.get(client.config.server);
        client.owner = client.users.cache.get(client.config.owner);
        client.log(`${client.user.tag}, ${client.users.cache.size} kişi için hizmet vermeye hazır!`, "ready");
        await client.user.setPresence({ activity: client.config.status, status: "idle" });
        if (this.data.channels["lastCrush"]) {
            await client.channels.cache.get(this.data.channels["lastCrush"]).send("**TEKRAR ONLINE!**");
        }
    }
}
module.exports = Ready;