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
        const olddata = await client.models.channels.findOne({ meta: { $elemMatch: { _id: channel.id } } });
        if (!olddata) {
            const ovs = [];
            channel.permissionOverwrites.cache.forEach((o) => {
                const lol = {
                    id: o.id,
                    typeOf: o.type,
                    allow: o.allow.toArray(),
                    deny: o.deny.toArray()
                };
                ovs.push(lol);
            });
            await client.models.channels.create({
                kindOf: channel.type,
                meta: {
                    _id: channel.id,
                    name: channel.name,
                    parent: channel.parentID,
                    position: channel.position,
                    nsfw: channel.nsfw,
                    bitrate: channel.bitrate,
                    rateLimit: channel.rateLimit,
                    created: channel.createdAt,
                    overwrites: ovs
                }
            });
        }
        const ovs = [];
        channel.permissionOverwrites.cache.forEach((o) => {
            const lol = {
                id: o.id,
                typeOf: o.type,
                allow: o.allow.toArray(),
                deny: o.deny.toArray()
            };
            ovs.push(lol);
        });
        await client.models.channels.updateOne({ _id: olddata._id }, {
            $push: {
                meta: {
                    _id: null,
                    name: channel.name,
                    parent: channel.parentID,
                    position: channel.position,
                    nsfw: channel.nsfw,
                    bitrate: channel.bitrate,
                    rateLimit: channel.rateLimit,
                    created: channel.createdAt,
                    overwrites: ovs
                }
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
            const subChannels = await client.models.channels.find({ meta: { $last: { parent: channel.id } } });
            await subChannels.forEach(async (chn) => {
                const subChnl = channel.guild.channels.cache.get(chn.meta.pop()._id);
                const ovs = [];
                subChnl.permissionOverwrites.cache.forEach((o) => {
                    const lol = {
                        id: o.id,
                        typeOf: o.type,
                        allow: o.allow.toArray(),
                        deny: o.deny.toArray()
                    };
                    ovs.push(lol);
                });
                if (subChnl) await subChnl.setParent(newChannel.id, { lockPermissions: false });
                await client.models.channels.updateOne({ _id: chn.meta.pop()._id }, {
                    $push: {
                        _id: subChnl.id,
                        name: subChnl.name,
                        parent: newChannel.id,
                        position: subChnl.position,
                        nsfw: subChnl.nsfw,
                        bitrate: subChnl.bitrate,
                        rateLimit: subChnl.rateLimit,
                        created: subChnl.createdAt,
                        overwrites: ovs
                    }
                });
            });
        }
        const olddata = await client.models.channels.findOne({ meta: { $elemMatch: { _id: channel.id } } });
        const ovs = [];
        newChannel.permissionOverwrites.cache.forEach((o) => {
            const lol = {
                id: o.id,
                typeOf: o.type,
                allow: o.allow.toArray(),
                deny: o.deny.toArray()
            };
            ovs.push(lol);
        });
        await client.models.channels.updateOne({ _id: olddata._id }, {
            $push: {
                meta: {
                    _id: newChannel.id,
                    name: newChannel.name,
                    parent: newChannel.parent.id,
                    position: newChannel.position,
                    nsfw: newChannel.nsfw,
                    bitrate: newChannel.bitrate,
                    rateLimit: newChannel.rateLimit,
                    created: newChannel.createdAt,
                    overwrites: ovs
                }
            }
        });
        const overwritesData = await client.models.bc_ovrts.findOne({ _id: channel.id });
        await newChannel.permissionOverwrites.set(overwritesData.overwrites);

    }
}
module.exports = ChannelDelete;