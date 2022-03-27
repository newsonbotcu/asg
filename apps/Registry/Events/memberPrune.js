const { ClientEvent } = require("../../../base/utils");

class GuildMemberKick extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "guildMemberRemove",
            audit: "MEMBER_PRUNE"
        })
        this.client = client;
    }

    async run(member) {
        this.data = this.loadMarks();
        if (member.guild.id !== this.client.config.server) return;
        if (this.audit && this.audit.createdTimestamp >= Date.now() - 10000) {
            const removed = this.audit.extra.removed;
            const days = this.audit.extra.days;
            this.client.handler.emit("ban", this.audit.executor.id, this.client.user.id, "* Üye Çıkarma", "p", `${days} günde ${removed} kadar aktif olmayan üyeyi sunucudan ${this.audit.reason || "bilinmeyen"} sebeple çıkardı.`);
            return;
        }
    }
}
module.exports = GuildMemberKick;