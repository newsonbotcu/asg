const { ClientEvent } = require('../../../base/utils');
class ChannelUpdate extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "channelUpdate",
            action: "CHANNEL_UPDATE",
            punish: "ban"
        });
        this.client = client;
    }
    async rebuild(oldChannel, curChannel) {
        let olddata = await client.models.channels.findOne({ meta: { $elemMatch: { _id: oldChannel.id } } });
        if (!olddata) {
            const ovs = [];
            oldChannel.permissionOverwrites.cache.forEach((o) => {
                const lol = {
                    _id: o.id,
                    typeOf: o.type,
                    allow: o.allow.toArray(),
                    deny: o.deny.toArray()
                };
                ovs.push(lol);
            });
            await client.models.channels.create({
                kindOf: oldChannel.type,
                parent: oldChannel.parentId,
                meta: [{
                    _id: oldChannel.id,
                    name: oldChannel.name,
                    position: oldChannel.position,
                    nsfw: oldChannel.nsfw,
                    bitrate: oldChannel.bitrate,
                    rateLimit: oldChannel.rateLimit,
                    created: oldChannel.createdAt,
                    overwrites: ovs
                }]
            });
        }
        olddata = await client.models.channels.findOne({ meta: { $elemMatch: { _id: oldChannel.id } } });
        const ovs = [];
        curChannel.permissionOverwrites.cache.forEach((o) => {
            const lol = {
                _id: o.id,
                typeOf: o.type,
                allow: o.allow.toArray(),
                deny: o.deny.toArray()
            };
            ovs.push(lol);
        });
        await client.models.channels.updateOne({ _id: olddata._id }, {
            $push: {
                meta: {
                    _id: curChannel.id,
                    name: curChannel.name,
                    position: curChannel.position,
                    nsfw: curChannel.nsfw,
                    bitrate: curChannel.bitrate,
                    rateLimit: curChannel.rateLimit,
                    created: curChannel.createdAt,
                    userLimit: curChannel.userLimit,
                    overwrites: ovs
                }
            }
        });
    }
    async run(oldChannel, curChannel) {
        const client = this.client;
        const data = await client.models.channels.findOne({ meta: { $elemMatch: { _id: oldChannel.id } } });
        if ((curChannel.type === 'text') || (curChannel.type === 'news')) {
            await curChannel.edit({
                name: data.name,
                nsfw: data.nsfw,
                parentId: data.parentId,
                position: data.position,
                rateLimit: data.rateLimit
            });
        }
        if (curChannel.type === 'voice') {
            await curChannel.edit({
                name: data.name,
                bitrate: data.bitrate,
                parentId: data.parentId,
                position: data.position
            });
        }
        if (curChannel.type === 'category') {
            await curChannel.edit({
                name: data.name,
                position: data.position
            });
        }
    }
}
module.exports = ChannelUpdate;