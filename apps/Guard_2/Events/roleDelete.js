const low = require('lowdb');
const children = require('child_process');

class RoleCreate {
    constructor(client) {
        this.client = client;
    };

    async run(role) {
        const client = this.client;
        if (role.guild.id !== client.config.server) return;
        const entry = await client.fetchEntry("ROLE_DELETE");
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        if (entry.executor.id === client.user.id) return;
        const permission = await client.models.perms.findOne({ user: entry.executor.id, type: "delete", effect: "role" });
        if ((permission && (permission.count > 0)) || utils.get("root").value().includes(entry.executor.id)) {
            if (permission) await client.models.perms.updateOne({ user: entry.executor.id, type: "delete", effect: "role" }, { $inc: { count: -1 } });
            await client.models.bc_role.deleteOne({ _id: role.id });
            client.extention.emit('Logger', 'Guard', entry.executor.id, "ROLE_DELETE", `${role.name} isimli rolü sildi. Kalan izin sayısı ${permission ? permission.count - 1 : "sınırsız"}`);
            return;
        }
        if (permission) await client.models.perms.deleteOne({ user: entry.executor.id, type: "delete", effect: "role" });
        client.extention.emit('Danger', ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
        const exeMember = role.guild.members.cache.get(entry.executor.id);
        client.extention.emit('Jail', exeMember, client.user.id, "KDE - Rol Silme", "Perma", 0);
        const roleData = await client.models.bc_role.findOne({ _id: role.id });
        const newRole = await role.guild.roles.create({
            data: {
                name: roleData.name,
                color: roleData.color,
                hoist: roleData.hoist,
                mentionable: roleData.mentionable,
                position: roleData.rawPosition,
                permissions: roleData.bitfield
            }
        });
        const rolePath = await client.getPath(roles.value(), role.id);
        if (rolePath) roles.set(rolePath, newRole.id).write();
        await client.models.bc_role.deleteOne({ _id: role.id });
        await client.models.bc_role.create({
            _id: newRole.id,
            name: newRole.name,
            color: newRole.hexColor,
            hoist: newRole.hoist,
            mentionable: newRole.mentionable,
            rawPosition: newRole.rawPosition,
            bitfield: newRole.permissions
        });
        const overwrits = await client.models.bc_ovrts.find();
        const roleFiltered = overwrits.filter(doc => doc.overwrites.some(o => o.id === role.id));
        for (let index = 0; index < roleFiltered.length; index++) {
            const document = roleFiltered[index];
            let docover = document.overwrites.find(o => o.id === role.id);
            const channel = role.guild.channels.cache.get(document._id);
            await channel.permissionOverwrites.add({
                id: role.id,
                allow: docover.allow,
                deny: docover.deny,
                type: 'role'
            });
            await client.models.bc_ovrts.updateOne({ _id: document._id }, { $pull: { overwrites: docover } });
            await client.models.bc_ovrts.updateOne({ _id: document._id }, {
                $push: {
                    overwrites: {
                        id: newRole.id,
                        type: 'role',
                        allow: docover.allow,
                        deny: docover.deny
                    }
                }
            });
        }
        if (utils.get("ohal").value()) return;
        client.extention.emit('Logger', 'KDE', entry.executor.id, "ROLE_DELETE", `${role.name} isimli rolü sildi`);
        await utils.set("ohal", true).write();
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
                        await utils.set("ohal", false).write();
                    }
                } else console.log(`CD${index} just started!`);
            });
        }
    }
}

module.exports = RoleCreate;
