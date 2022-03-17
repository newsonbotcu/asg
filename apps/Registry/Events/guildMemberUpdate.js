const pm2 = require("pm2");
class GuildMemberUpdate {
    constructor(client) {
        this.client = client;
    };

    async run(prev, cur) {
        const client = this.client;
        if (cur.guild.id !== client.config.server) return;
        const rolesData = await client.models.marked_ids.find({ type: "ROLE" });
        let roles = {}
        for (let index = 0; index < rolesData.length; index++) {
            const data = rolesData[index];
            roles[data._id] = data.value;
        }
        const memberDb = await client.models.members.findOne({ _id: cur.user.id });
        if (prev && prev.roles.cache.has(roles["booster"]) && !cur.roles.cache.has(roles["booster"])) {
            const pointed = client.config.tag.some(t => target.user.username.includes(t)) ? client.config.tag[0] : client.config.extag;
            await cur.setNickname(`${pointed} ${memberDb.name} | ${memberDb.age}`);
            if (!memberDb) {
                await cur.roles.remove(cur.roles.cache.array());
                await cur.roles.add(roles["welcome"]);
            }
        }
        const entry = await cur.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE" }).then(logs => logs.entries.first());
        if (entry.createdTimestamp <= Date.now() - 5000) return;
        let roleNames = await cur.roles.cache.map(role => role.name);
        let ohal = false;
        pm2.list((err, list) => {
            if (err) return;
            ohal = list.map(item => item.name).filter(item => item.startsWith("CD")).length > 0;
        });
        if (!ohal) {
            const model = await client.models.mem_roles.findOne({ _id: cur.user.id });
            if (!model) {
                await client.models.mem_roles.create({ _id: cur.user.id, roles: roleNames });
            } else {
                await client.models.mem_roles.updateOne({ _id: cur.user.id }, { $set: { roles: roleNames } });
                client.log(`${entry.executor.username} => [${entry.changes[0].key}] ${entry.target.username} : ${entry.changes[0].new[0].name}`, "mngdb");
            }
        }
        const cmute = await client.models.cmute.findOne({ _id: cur.user.id });
        if (cmute && !cur.roles.cache.has(roles["muted"]) && !entry.executor.bot) {
            await cur.roles.add(roles["muted"]);
            const exeMember = cur.guild.members.cache.get(entry.executor.id);
            if (exeMember.roles.cache.has(roles["root"])) return;
            client.extention.emit("Jail", exeMember, this.client.user.id, "KDE - Mute Açma", "Perma", 1);
        };
        const pJail = await client.models.cmute.jail.findOne({ _id: cur.user.id });
        if (pJail && !entry.executor.bot) {
            await cur.roles.remove(cur.roles.cache.filter(r => r.id !== roles["booster"]).filter(r => r.editable).array());
            await cur.roles.add(roles["prisoner"]);
            const exeMember = cur.guild.members.cache.get(entry.executor.id);
            if (exeMember.roles.cache.has(roles["root"])) return;
            client.extention.emit("Jail", exeMember, this.client.user.id, "KDE - Jail Açma", "Perma", 1);
        };
        const role = cur.guild.roles.cache.get(entry.changes[0].new[0].id);
        const perms = ["ADMINISTRATOR", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG", "MANAGE_MESSAGES", "MENTION_EVERYONE", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
        if (perms.some(perm => role.permissions.has(perm)) && !entry.executor.bot) {
            const key = entry.changes[0].key;
            if (key === '$add') await cur.roles.remove(role);
            if (key === '$remove') await cur.roles.add(role);
            const exeMember = cur.guild.members.cache.get(entry.executor.id);
            client.extention.emit("Jail", exeMember, this.client.user.id, "KDE - Rol Verme", "Perma", 1);
        }

    }
}
module.exports = GuildMemberUpdate;