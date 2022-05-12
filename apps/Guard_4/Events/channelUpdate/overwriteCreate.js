const { ClientEvent } = require('../../../../base/utils');
class OverwriteCreate extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "channelUpdatex",
            privity: true,
            action: "CHANNEL_OVERWRITE_CREATE",
            punish: "jail"
        });
        this.client = client;
    }

    async rebuild(oldChannel, curChannel) {
        const client = this.client;
        const olddata = await client.models.channels.findOne({ meta: { $elemMatch: { _id: channel.id } } });
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
        if (!olddata) {
            await client.models.channels.create({
                kindOf: curChannel.type,
                parent: curChannel.parentId,
                meta: [{
                    _id: curChannel.id,
                    name: curChannel.name,
                    position: curChannel.position,
                    nsfw: curChannel.nsfw,
                    bitrate: curChannel.bitrate,
                    rateLimit: curChannel.rateLimit,
                    created: curChannel.createdAt
                }],
                overwrites: ovs
            });
        } else {
            olddata = await client.models.channels.findOne({ meta: { $elemMatch: { _id: curChannel.id } } });
            await client.models.channels.updateOne({ _id: olddata._id }, {
                $set: {
                    overwrites: lol
                }
            });
        }
    }

    async refix(oldChannel, curChannel) {
        const olddata = await this.client.models.channels.findOne({ meta: { $elemMatch: { _id: oldChannel.id } } });
        const metaData = olddata.meta.pop();
        await curChannel.permissionOverwrites.set(metaData.overwrites.map(o => {
            return {
                id: o._id,
                type: o.typeOf,
                allow: o.allow,
                deny: o.deny
            }
        }));

    }
}

module.exports = OverwriteCreate;