const Discord = require('discord.js');
const { ClientEvent } = require('../../../../base/utils');
class OverwriteDelete extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "channelUpdates",
            privity: true,
            action: "CHANNEL_OVERWRITE_DELETE",
            punish: "jail"
        });
        this.client = client;
    }

    async rebuildx(oldc, curc) {
        const ovs = [];
        curc.permissionOverwrites.cache.forEach((o) => {
            const lol = {
                _id: o.id,
                typeOf: o.type,
                allow: o.allow.toArray(),
                deny: o.deny.toArray()
            };
            ovs.push(lol);
        });
        await client.models.channels.updateOne({ meta: { $elemMatch: { _id: oldc.id } } }, { $set: { overwrites: ovs } });
    }


    async refixx(oldc, curc) {

    }


    async runx(oldChannel, curChannel) {
        const client = this.client;
        const options = {};
        new Discord.Permissions(data.allow.bitfield).toArray().forEach(p => options[p] = true);
        new Discord.Permissions(data.deny.bitfield).toArray().forEach(p => options[p] = false);
        const exeMember = curChannel.guild.members.cache.get(entry.executor.id);
        client.handler.emit('Jail', exeMember, client.user.id, "* İzin Silme", "Perma", 0);
        client.handler.emit('Logger', 'KDE', entry.executor.id, "CHANNEL_OVERWRITE_DELETE", `${oldChannel.name} isimli kanalın izinleriyle oynadı`);
        await curChannel.updateOverwrite(entry.changes[0].old, options);
    }
}

module.exports = OverwriteDelete;