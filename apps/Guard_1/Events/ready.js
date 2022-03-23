const { ClientEvent } = require('../../../base/utils');
class Ready extends ClientEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }

    async run(client) {
        client = this.client.handler.hello(this.client);
        /*
        const channels = client.guild.channels.cache.map(c => c);
        for (let index = 0; index < channels.length; index++) {
            const channel = channels[index];
            const olddata = await client.models.bc_ovrts.findOne({ _id: channel.id });
            if (!olddata) await client.models.bc_ovrts.create({ _id: channel.id, overwrites: channel.permissionOverwrites.array() });
            if ((channel.type === 'text') || (channel.type === 'news')) {
                const channelData = await client.models.bc_text.findOne({ _id: channel.id });
                if (!channelData) {
                    await client.models.bc_text.create({
                        _id: channel.id,
                        name: channel.name,
                        nsfw: channel.nsfw,
                        parentID: channel.parentID,
                        position: channel.position,
                        rateLimit: channel.rateLimit
                    });
                }
            }
            if (channel.type === 'voice') {
                const channelData = await client.models.bc_voice.findOne({ _id: channel.id });
                if (!channelData) {
                    await client.models.bc_voice.create({
                        _id: channel.id,
                        name: channel.name,
                        bitrate: channel.bitrate,
                        parentID: channel.parentID,
                        position: channel.position
                    });
                }
            }
            if (channel.type === 'category') {
                const channelData = await client.models.bc_cat.findOne({ _id: channel.id });
                if (!channelData) {
                    await client.models.bc_cat.create({
                        _id: channel.id,
                        name: channel.name,
                        position: channel.position
                    });
                }
            }

        }
            */
    }
}
module.exports = Ready;