class Ready {

    constructor(client) {
        this.client = client;
    }

    async run(client) {
        client.log(`${client.user.tag}, ${client.users.cache.size} kişi için hizmet vermeye hazır!`, "ready");
        client.user.setPresence({ activities: client.config.status, status: "idle" });
    }
}
module.exports = Ready;
