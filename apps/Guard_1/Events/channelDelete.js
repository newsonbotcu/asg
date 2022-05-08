const { ClientEvent } = require('../../../base/utils');
class ChannelDelete extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "channelDelete",
            privity: true,
            action: "CHANNEL_DELETE",
            punish: "ban"
        });
        this.client = client;
    }

    async rebuild(channel) {
        let olddata = await client.models.channels.findOne({ meta: { $elemMatch: { _id: channel.id } } });
        if (!olddata) {
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
        olddata = await client.models.channels.findOne({ meta: { $elemMatch: { _id: channel.id } } });
        await client.models.channels.updateOne({ _id: olddata._id }, {
            $set: {
                deleted: true
            }
        });
    }

    async refix(channel) {
        const client = this.client;
        let newChannel;
        if ((channel.type === 'text') || (channel.type === 'news')) {
            newChannel = await channel.guild.channels.create(channel.name, {
                type: channel.type,
                topic: channel.topic,
                nsfw: channel.nsfw,
                parent: channel.parent,
                position: channel.position + 1,
                rateLimitPerUser: channel.rateLimitPerUser
            });
        }
        if (channel.type === 'voice') {
            newChannel = await channel.guild.channels.create(channel.name, {
                type: channel.type,
                bitrate: channel.bitrate,
                userLimit: channel.userLimit,
                parent: channel.parent,
                position: channel.position + 1
            });
        }
        if (channel.type === 'category') {
            newChannel = await channel.guild.channels.create(channel.name, {
                type: channel.type,
                position: channel.position + 1
            });
            const subChannels = await client.models.channels.find({ parent: channel.id });
            await subChannels.forEach(async (chn) => {
                const subChnl = channel.guild.channels.cache.get(chn.meta.pop()._id);
                if (subChnl) {
                    await subChnl.setParent(newChannel.id, { lockPermissions: false });
                    await subChnl.permissionOverwrites.set(chn.overwrites.map(o => {
                        return {
                            id: o.id,
                            type: o.typeOf,
                            allow: o.allow,
                            deny: o.deny
                        }
                    }));
                }
            });
            await client.models.channels.updateMany({ parent: channel.id }, {
                $set: {
                    parent: newChannel.id
                }
            });
        }
        const olddata = await client.models.channels.findOne({ meta: { $elemMatch: { _id: channel.id } } });
        if (!olddata) {
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
        } else {
            const metaData = olddata.meta.pop();
            await newChannel.permissionOverwrites.set(metaData.overwrites.map(o => {
                return {
                    id: o.id,
                    type: o.typeOf,
                    allow: o.allow,
                    deny: o.deny
                }
            }));
            await client.models.channels.updateOne({ _id: olddata._id }, {
                $push: {
                    meta: {
                        _id: newChannel.id,
                        name: newChannel.name,
                        position: newChannel.position,
                        nsfw: newChannel.nsfw,
                        bitrate: newChannel.bitrate,
                        rateLimit: newChannel.rateLimit,
                        created: newChannel.createdAt,
                        userLimit: newChannel.userLimit
                    }
                }
            });
        }

    }
}
module.exports = ChannelDelete;