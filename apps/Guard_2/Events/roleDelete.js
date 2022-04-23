const children = require('child_process');
const pm2 = require('pm2');
const { ClientEvent } = require('../../../base/utils');
class RoleDelete extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "roleDelete",
            action: "ROLE_DELETE",
            punish: "ban",
            privity: true
        });
        this.client = client;
    }

    async rebuild(role) {
        let roleData = await client.models.roles.findOne({ meta: { $elemMatch: { _id: role.id } } });
        if (!roleData) await client.models.roles.create({
            meta: [
                {
                    _id: role.id,
                    name: role.name,
                    icon: role.icon,
                    color: role.hexColor,
                    hoist: role.hoist,
                    mentionable: role.mentionable,
                    position: role.rawPosition,
                    bitfield: role.permissions.bitfield.toString(),
                    created: role.createdAt,
                    emoji: role.unicodeEmoji
                }
            ]
        });
        roleData = await client.models.roles.findOne({ meta: { $elemMatch: { _id: role.id } } });
        await client.models.roles.updateOne({ _id: roleData._id }, {
            $set: {
                deleted: true
            }
        });
    }

    async refix(role) {
        const client = this.client;
        let roleData = await client.models.roles.findOne({ meta: { $elemMatch: { _id: role.id } } });
        if (!roleData) await client.models.roles.create({
            meta: [
                {
                    _id: newRole.id,
                    name: newRole.name,
                    icon: newRole.icon,
                    color: newRole.hexColor,
                    hoist: newRole.hoist,
                    mentionable: newRole.mentionable,
                    position: newRole.rawPosition,
                    bitfield: newRole.permissions.bitfield.toString(),
                    created: newRole.createdAt,
                    emoji: newRole.unicodeEmoji
                }
            ]
        });
        roleData = await client.models.roles.findOne({ meta: { $elemMatch: { _id: role.id } } });
        const metadata = roleData.meta.pop();
        const newRole = await role.guild.roles.create({
            data: {
                name: metadata.name,
                color: metadata.color,
                hoist: metadata.hoist,
                mentionable: metadata.mentionable,
                position: metadata.rawPosition,
                permissions: BigInt(metadata.bitfield)
            }
        });
        const chnlData = await client.models.channels.find({ overwrites: { $elemMatch: { _id: role.id } } });
        for (let datx = 0; datx < chnlData.length; datx++) {
            const vrt = chnlData[datx].overwrites.find(o => o._id === role.id);
            const channel = role.guild.channels.cache.get(chnlData[datx].meta.pop()._id);
            await channel.permissionOverwrites.add({
                id: newRole.id,
                allow: vrt.allow,
                deny: vrt.deny,
                type: 'role'
            });
            await client.models.channels.updateOne({ _id: chnlData[datx]._id }, { $pull: { overwrites: vrt } });
            await client.models.channels.updateOne({ _id: chnlData[datx]._id }, {
                $push: {
                    overwrites: {
                        _id: newRole.id,
                        type: 'role',
                        allow: vrt.allow,
                        deny: vrt.deny
                    }
                }
            });
            
        }
        let ohal = false;
        pm2.list((err, list) => {
            if (err) return;
            ohal = list.map(item => item.name).filter(item => item.startsWith("CD")).length > 0;
        });
        if (ohal) return;
        let cdDone = 0;
        for (let index = 1; index < client.config.vars.calm_down.length + 1; index++) {
            let ls = children.exec(`pm2 start /home/${process.env.patched}/INTERNAL/BASE/calm_down.js --name "CD${index}" -- ${index}; pm2 logs CD${index}`);
            ls.stdout.on('data', function (data) {
                console.log(data);
            });
            ls.stderr.on('data', function (data) {
                console.log(data);
            });
            ls.on('close', async (code) => {
                cdDone = cdDone + 1;
                if (code === 0) {
                    if (cdDone === client.config.vars.calm_down.length) {
                        cdDone = 0;
                        console.log('Done!');
                    }
                } else console.log(`CD${index} just started!`);
            });
        }
    }
}

module.exports = RoleDelete;
