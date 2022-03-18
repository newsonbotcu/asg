const request = require('request');
const { CliEvent } = require('../../../base/utils');
class GuildUpdate extends CliEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }

    async run(oldGuild, curGuild) {
        this.data = await this.init();
        const client = this.client;
        if (curGuild.id !== client.config.server) return;
        const entry = await client.fetchEntry("GUILD_UPDATE");
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        let reasonn;
        const exeMember = curguild.members.cache.get(entry.executor.id);
        client.extention.emit('Jail', exeMember, client.user.id, "KDE - Sunucu Güncelleme", "Perma", 0);
        if (oldGuild.banner !== curGuild.banner) {
            await curGuild.setBanner(oldGuild.bannerURL({size: 4096}));
            reasonn = "Afiş Değiştirme";
        }
        if (oldGuild.icon !== curGuild.icon) {
            await curGuild.setIcon(oldGuild.iconURL({type: 'gif', size: 4096}));
            reasonn = "Ikon Değiştirme";
        }
        if (oldGuild.region !== curGuild.region) {
            client.extention.emit("Danger", ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
            reasonn = "Bölge Değiştirme";
        }
        if (curGuild.vanityURLCode && (curGuild.vanityURLCode !== this.data.other["vanityURL"])) {
            client.extention.emit("Danger", ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
            reasonn = "URL DEĞİŞTİRME";
            request({
                method: "PATCH",
                url: `https://discord.com/api/guilds/${newGuild.id}/vanity-url`,
                headers: {
                    "Authorization": `Bot ${client.token}`
                },
                json: {
                    "code":  this.data.other["vanityURL"]
                }
            });
        }
    }
}

module.exports = GuildUpdate;