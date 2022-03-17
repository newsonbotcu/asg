const low = require('lowdb');
class ChannelDelete {
    constructor(client) {
        this.client = client;
    };
    async run(channel) {
        const client = this.client;
        if (channel.guild.id !== client.config.server) return;
        const utils = await low(client.adapters('utils'));
        const entry = await client.fetchEntry("CHANNEL_DELETE");
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await client.models.perms.findOne({ user: entry.executor.id, type: "delete", effect: "channel" });
        if ((permission && (permission.count > 0)) || utils.get("root").value().includes(entry.executor.id)) {
            if (permission) await client.models.perms.updateOne({ user: entry.executor.id, type: "delete", effect: "channel" }, { $inc: { count: -1 } });
            if ((channel.type === 'text') || (channel.type === 'news')) await client.models.bc_text.deleteOne({ _id: channel.id });
            if (channel.type === 'voice') await client.models.bc_voice.deleteOne({ _id: channel.id });
            if (channel.type === 'category') await client.models.bc_cat.deleteOne({ _id: channel.id });
            await client.models.overwrites.deleteOne({ _id: channel.id });
            client.extention.emit('Logger', 'Guard', entry.executor.id, "CHANNEL_DELETE", `${entry.executor.username} ${channel.name} isimli kanalı sildi. Kalan izin sayısı ${permission ? permission.count - 1 : "sınırsız"}`);
            return;
        }
        if (permission) await client.models.perms.deleteOne({ user: entry.executor.id, type: "delete", effect: "channel" });
        client.extention.emit('Danger', ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        let newChannel;
        if ((channel.type === 'text') || (channel.type === 'news')) {
            await client.models.bc_text.deleteOne({ _id: channel.id });
            newChannel = await channel.guild.channels.create(channel.name, {
                type: channel.type,
                topic: channel.topic,
                nsfw: channel.nsfw,
                parent: channel.parent,
                position: channel.position + 1,
                rateLimitPerUser: channel.rateLimitPerUser
            });
            await client.models.bc_text.create({
                _id: newChannel.id,
                name: newChannel.name,
                nsfw: newChannel.nsfw,
                parentID: newChannel.parentID,
                position: newChannel.position,
                rateLimit: newChannel.rateLimitPerUser
            });
        }
        if (channel.type === 'voice') {
            await client.models.bc_voice.deleteOne({ _id: channel.id });
            newChannel = await channel.guild.channels.create(channel.name, {
                type: channel.type,
                bitrate: channel.bitrate,
                userLimit: channel.userLimit,
                parent: channel.parent,
                position: channel.position + 1
            });
            await client.models.bc_voice.create({
                _id: newChannel.id,
                name: newChannel.name,
                bitrate: newChannel.bitrate,
                parentID: newChannel.parentID,
                position: newChannel.position
            });
        }
        if (channel.type === 'category') {
            await client.models.bc_cat.deleteOne({ _id: channel.id });
            newChannel = await channel.guild.channels.create(channel.name, {
                type: channel.type,
                position: channel.position + 1
            });
            const textChannels = await client.models.bc_text.find({ parentID: channel.id });
            await  client.models.bc_text.updateMany({ parentID: channel.id }, { parentID: newChannel.id });
            textChannels.forEach(c => {
                const textChannel = channel.guild.channels.cache.get(c._id);
                if (textChannel) textChannel.setParent(newChannel, { lockPermissions: false });
            });
            const voiceChannels = await client.models.bc_voice.find({ parentID: channel.id });
            await client.models.bc_voice.updateMany({ parentID: channel.id }, { parentID: newChannel.id });
            voiceChannels.forEach(c => {
                const voiceChannel = channel.guild.channels.cache.get(c._id);
                if (voiceChannel) voiceChannel.setParent(newChannel, { lockPermissions: false });
            });
            await client.models.bc_cat.create({
                _id: newChannel.id,
                name: newChannel.name,
                position: newChannel.position
            });
        }
        const overwritesData = await client.models.bc_ovrts.findOne({ _id: channel.id });
        await newChannel.permissionOverwrites.set(overwritesData.overwrites);
        await client.models.bc_ovrts.deleteOne({ _id: channel.id });
        await client.models.bc_ovrts.create({ _id: newChannel.id, overwrites: overwritesData.overwrites });
        const exeMember = channel.guild.members.cache.get(entry.executor.id);
        client.extention.emit('Jail', exeMember, client.user.id, "KDE - Kanal Silme", "Perma", 0);
        client.extention.emit('Logger', 'KDE', entry.executor.id, "CHANNEL_DELETE", `${channel.name} isimli kanalı sildi`);
    }
}
module.exports = ChannelDelete;