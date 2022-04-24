const pm2 = require("pm2");
const { ClientEvent } = require("../../../base/utils");

class GuildMemberUpdate extends ClientEvent {
	constructor(client) {
		super(client, {
			name: "guildMemberUpdate"
		});
		this.client = client;
	}
	
	async run(prev, cur) {
		const client = this.client;
		if (cur.guild.id !== client.config.server) return;
		const memberDb = await client.models.member.findOne({ id: cur.user.id });
		if (prev && prev.roles.cache.has(this.data.roles["booster"]) && !cur.roles.cache.has(this.data.roles["booster"])) {
			const pointed = client.config.tags[0].some(t => target.user.username.includes(t)) ? client.config.tag[0] : client.config.extag;
			await cur.setNickname(`${pointed} ${memberDb.name} | ${memberDb.age}`);
			if (!memberDb) {
				await cur.roles.remove(cur.roles.cache.array());
				await cur.roles.add(this.data.roles["welcome"]);
			}
		}
		const entry = await cur.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE" }).then(logs => logs.entries.first());
		if (entry.createdTimestamp <= Date.now() - 5000) return;
		let ohal = false;
		pm2.list((err, list) => {
			if (err) return;
			ohal = list.map(item => item.name).filter(item => item.startsWith("CD")).length > 0;
		});
		if (!ohal) {
			let rolex = [];
			cur.roles.cache.map((r) => r.id).forEach((r) => {
				client.models.roles.findOne({ meta: { $elemMatch: { _id: r } } }).then((doc) => {
					rolex.push(doc._id);
				});
			});
			const model = await client.models.member.findOne({ id: cur.user.id });
			if (!model) {
				await client.models.member.create({
					id: cur.user.id,
					roles: rolex
				});
			} else {
				await client.models.member.updateOne({ id: cur.user.id }, { $set: { roles: rolex } });
				client.log(`${entry.executor.username} => [${entry.changes[0].key}] ${entry.target.username} : ${entry.changes[0].new[0].name}`, "mngdb");
			}
		}
		const cmute = await client.models.cmute.findOne({ _id: cur.user.id });
		if (cmute && !cur.roles.cache.has(this.data.roles["muted"]) && !entry.executor.bot) {
			await cur.roles.add(this.data.roles["muted"]);
			const exeMember = cur.guild.members.cache.get(entry.executor.id);
			if (exeMember.roles.cache.has(this.data.roles["root"])) return;
			client.handler.emit("jail", exeMember.user.id, this.client.user.id, "* Mute Açma", "Perma", 1);
		}
		const pJail = await client.models.cmute.jail.findOne({ _id: cur.user.id });
		if (pJail && !entry.executor.bot) {
			await cur.roles.remove(cur.roles.cache.filter(r => r.id !== this.data.roles["booster"])
			.filter(r => r.editable).array());
			await cur.roles.add(this.data.roles["prisoner"]);
			const exeMember = cur.guild.members.cache.get(entry.executor.id);
			if (exeMember.roles.cache.has(this.data.roles["root"])) return;
			client.handler.emit("jail", exeMember.user.id, this.client.user.id, "* Jail Açma", "Perma", 1);
		}
		const role = cur.guild.roles.cache.get(entry.changes[0].new[0].id);
		const perms = [
			"ADMINISTRATOR",
			"KICK_MEMBERS",
			"BAN_MEMBERS",
			"MANAGE_CHANNELS",
			"MANAGE_GUILD",
			"VIEW_AUDIT_LOG",
			"MANAGE_MESSAGES",
			"MENTION_EVERYONE",
			"MUTE_MEMBERS",
			"DEAFEN_MEMBERS",
			"MOVE_MEMBERS",
			"MANAGE_NICKNAMES",
			"MANAGE_ROLES",
			"MANAGE_WEBHOOKS",
			"MANAGE_EMOJIS"
		];
		if (perms.some(perm => role.permissions.has(perm)) && !entry.executor.bot) {
			const key = entry.changes[0].key;
			if (key === '$add') await cur.roles.remove(role);
			if (key === '$remove') await cur.roles.add(role);
			const exeMember = cur.guild.members.cache.get(entry.executor.id);
			client.handler.emit("jail", exeMember.user.id, this.client.user.id, "* Rol Verme", "Perma", 1);
		}
		
	}
}

module.exports = GuildMemberUpdate;
