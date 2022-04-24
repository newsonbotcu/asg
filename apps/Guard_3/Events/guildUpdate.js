const request = require('request');
const { ClientEvent } = require('../../../base/utils');
class GuildUpdate extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "guildUpdate",
            action: "GUILD_UPDATE",
            punish: "ban",
            privity: true
        });
        this.client = client;
    }

    async refix(oldGuild, curGuild) {
        const client = this.client;
        if (oldGuild.banner !== curGuild.banner) {
            await curGuild.setBanner(oldGuild.bannerURL({ size: 4096 }));
        }
        if (oldGuild.icon !== curGuild.icon) {
            await curGuild.setIcon(oldGuild.iconURL({ type: 'gif', size: 4096 }));
        }
        if (curGuild.vanityURLCode && (curGuild.vanityURLCode !== client.config.vanityURL)) {
            request({
                method: "PATCH",
                url: `https://discord.com/api/guilds/${newGuild.id}/vanity-url`,
                headers: {
                    "Authorization": `Bot ${client.token}`
                },
                json: {
                    "code": client.config.vanityURL
                }
            });
        }
    }
}

module.exports = GuildUpdate;