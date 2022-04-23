const { ClientEvent } = require('../../../base/utils');
class ChannnelCreate extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "channelCreate",
            action: "CHANNEL_CREATE"
        });
        this.client = client;
    }

    async rebuild(channel) {
        const ovs = [];
        channel.permissionOverwrites.cache.forEach((o) => {
            const lol = {
                _id: o.id,
                typeOf: o.type,
                allow: o.allow.toArray(),
                deny: o.deny.toArray()
            };
            ovs.push(lol);
        });
        await client.models.channels.create({
            kindOf: channel.type,
            parent: channel.parentId,
            meta: [{
                _id: channel.id,
                name: channel.name,
                position: channel.position,
                nsfw: channel.nsfw,
                bitrate: channel.bitrate,
                rateLimit: channel.rateLimit,
                created: channel.createdAt
            }],
            overwrites: ovs
        });
    }

    async refix(channel) {
        await channel.delete(`${entry.executor.username} Tarafından oluşturulmaya çalışıldı`);
    }
}
module.exports = ChannnelCreate;
