const {
	MessageButton,
	MessageSelectMenu,
	ApplicationCommand,
	Collection
} = require('discord.js');
const {
	Schema,
	model,
	Types
} = require('mongoose');


class ClientEvent {
	constructor(client, {
		name = null,
		action = null,
		punish = "jail",
		privity = false
	}) {
		this.punish = punish;
		this.client = client;
		this.name = name;
		this.cooldown = new Collection();
		this.action = action;
		this.isAuthed = false;
		this.privity = privity;
	}

	exec(...args) {
		this.data = this.client.updateData();
		if (this.action) {
			this.client.guild.fetchAuditLogs({ type: this.action }).then((logs) => {
				this.audit = logs.entries.first();
			});
			this.client.models.member.findOne({ _id: this.audit.executor.id }).then((doc) => {
				const primity = doc.authorized.find(prm => prm.until.getTime > new Date().getTime() && prm.auditType === this.action);
				if (primity) {
					this.isAuthed = true;
					this.pass(primity, ...args);
				} else {
					this.axis(...args);
				}
			});
		} 
		try {
			this.run(...args);
		} catch (error) {
			this.client.log(error, this.name);
		}
	}

	async pass(peer, ...params) {
		await this.client.models.member.updateOne({ _id: this.audit.executor.id }, { $pull: { authorized: peer } });
		try {
			this.rebuild(...params);
		} catch (error) {
			this.client.log(error, this.name);
		}
	}

	axis(...params) {
		if (this.audit.createdTimestamp <= Date.now() - 5000) return;
		if (this.audit.executor.id === this.client.user.id) return;
		if (this.privity) this.client.emit('Danger', ["ADMINISTRATOR", "BAN_MEMBERS", "MANAGE_CHANNELS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_WEBHOOKS", "MANAGE_ROLES"]);
		this.client.emit(this.punish, this.audit.executor.id, this.client.user.id, this.action, "p", `auditId: ${this.audit.id}`);
		try {
			this.refix(...params);
		} catch (error) {
			this.client.log(error, this.name);
		}
	}

}

class SlashCommand extends ApplicationCommand {
	constructor(client, {
		name = null,
		description = null,
		customId = null,
		disabled = false,
		dirname = null,
		intChannel = null,
		cooldown = new Map(),
		enabled = true,
		time = 3000,
		options = [],
		permissions = [],
		ownerOnly = false
	}) {
		super(client, {
			id: customId,
			type: "CHAT_INPUT",
			application_id: client.application.id,
			guild_id: client.guild.id,
			name: name,
			description: description,
			default_permission: false,
			options: options
		});
		this.client = client;
		this.props = {
			name,
			dirname,
			intChannel,
			cooldown,
			enabled,
			time,
			ownerOnly
		};
		this.permissions = permissions;
		this.customId = customId;
		this.disabled = disabled;
		this.cooldown = new Collection();
	}

	async load() {
		const cmd = await this.client.guild.commands.create(this);
		this.id = cmd.id;
		this.client.log(`Komut etkileşimi yükleniyor: ${cmd.name} [${this.id}] 👌`, "load");
		this.client.responders.set(`slash:${this.props.name}`, this);
		const markedRoles = await this.client.models.roles.find({ commands: { $in: [`slash:${this.props.name}`] } });
		const marks = markedRoles.map((roleData) => roleData.meta.sort((a, b) => b.created.getTime() - a.created.getTime())[0].id);
		if (this.props.ownerOnly) {
			await client.guild.commands.permissions.set({
				command: cmd.id, permissions: [{
						id: this.client.owner.id, type: "USER", permission: true
				}]
			});
		} else if (marks.length !== 0) await client.guild.commands.permissions.set({
			command: cmd.id, permissions: marks.map(mark => {
				return {
					id: mark, type: "ROLE", permission: true
				}
			})
		});
		return false;
	}


}

class ButtonCommand extends MessageButton {
	constructor(client, {
		name = null,
		label = null,
		customId = null,
		style = "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK",
		emoji = null,
		url = null,
		disabled = false,
		isconst = false,
		dirname = null,
		intChannel = null,
		cooldown = 5000,
		enabled = true
	}) {
		super({
			label,
			customId,
			style,
			emoji,
			url,
			disabled
		});
		this.client = client;
		this.props = {
			name,
			type,
			dirname,
			intChannel,
			cooldown,
			enabled,
			isconst
		};
		this.info = {
			label,
			customId,
			style,
			emoji,
			url,
			disabled
		};
		this.perms = [];
	}

	loadPerms() {
		this.client.models.cmd_perms.findOne({
			cmd_type: "BUTTON",
			_id: this.customId
		})
			.then(doc => {
				this.props.perms = doc.permissions;
			});
		return this.perms;
	}

}

class MenuCommand extends MessageSelectMenu {
	constructor(client, {
		custom_id = null,
		options = [],
		placeholder = null,
		min_values = 0,
		max_values = 0,
		disabled = false,
	}) {
		super({
			custom_id,
			options,
			placeholder,
			min_values,
			max_values,
			disabled
		});
		this.client = client;

	}
}

class AppUserCommand extends ApplicationCommand {
	constructor(client, {
		name = null,
		description = null,
		customId = null,
		options = [],
		disabled = false,
		dirname = null,
		intChannel = null,
		cooldown = 5000,
		enabled = true
	}) {
		super(client, {
			id: customId,
			type: "USER",
			application_id: client.application.id,
			guild_id: client.guild.id,
			name: name,
			description: description,
			options: options,
			default_permission: false,
		}, client.guild, client.guild.id);
		this.client = client;
		this.props = {
			name,
			dirname,
			intChannel,
			cooldown,
			enabled,
			isconst
		};
		this.label = label;
		this.customId = customId;
		this.style = style;
		this.emoji = emoji;
		this.url = url;
		this.disabled = disabled;
		this.perms = [];
	}
	async load() {
		const cmd = await this.client.guild.commands.create(this);
		this.id = cmd.id;
		this.client.log(`Kullanıcı etkileşimi yükleniyor: ${cmd.name} [${this.id}] 👌`, "load");
		this.client.responders.set(`user:${this.props.name}`, this);
		const markedRoles = await this.client.models.roles.find({ commands: { $in: [`user:${this.props.name}`] } });
		const marks = markedRoles.map((roleData) => roleData.meta.sort((a, b) => b.created.getTime() - a.created.getTime())[0].id);
		if (this.props.ownerOnly) {
			await client.guild.commands.permissions.set({
				command: cmd.id, permissions: [{
						id: this.client.owner.id, type: "USER", permission: true
				}]
			});
		} else if (marks.length !== 0) await client.guild.commands.permissions.set({
			command: cmd.id, permissions: marks.map(mark => {
				return {
					id: mark, type: "ROLE", permission: true
				}
			})
		});
		return false;
	}
}

class AppMessageCommand extends ApplicationCommand {
	constructor(client, {
		name = null,
		description = null,
		customId = null,
		options = [],
		disabled = false,
		dirname = null,
		intChannel = null,
		cooldown = 5000,
		enabled = true,
		ownerOnly = false
	}) {
		super(client, {
			id: customId,
			type: "MESSAGE",
			application_id: client.application.id,
			guild_id: client.guild.id,
			name: name,
			description: description,
			options: options,
			default_permission: false,
		}, client.guild, client.guild.id);
		this.client = client;
		this.props = {
			name,
			dirname,
			intChannel,
			cooldown,
			enabled,
			isconst,
			ownerOnly
		};
		this.label = label;
		this.customId = customId;
		this.style = style;
		this.emoji = emoji;
		this.url = url;
		this.disabled = disabled;
		this.perms = [];
	}
	async load() {
		const cmd = await this.client.guild.commands.create(this);
		this.id = cmd.id;
		this.client.log(`Mesaj etkileşimi yükleniyor: ${cmd.name} [${this.id}] 👌`, "load");
		this.client.responders.set(`msg:${this.props.name}`, this);
		const markedRoles = await this.client.models.roles.find({ commands: { $in: [`msg:${this.props.name}`] } });
		const marks = markedRoles.map((roleData) => roleData.meta.sort((a, b) => b.created.getTime() - a.created.getTime())[0].id);
		if (this.props.ownerOnly) {
			await client.guild.commands.permissions.set({
				command: cmd.id, permissions: [{
						id: this.client.owner.id, type: "USER", permission: true
				}]
			});
		} else if (marks.length !== 0) await client.guild.commands.permissions.set({
			command: cmd.id, permissions: marks.map(mark => {
				return {
					id: mark, type: "ROLE", permission: true
				}
			})
		});
		return false;
	}
}

class DotCommand {
	constructor(client, {
		name = null,
		description = "Açıklama Belirtilmemiş",
		usage = "Kullanım Belirtilmemiş",
		examples = [],
		dirname = null,
		category = "Diğer",
		aliases = [],
		cmdChannel = null,
		accaptedPerms = [],
		cooldown = 5000,
		enabled = true,
		ownerOnly = false,
		rootOnly = false,
		onTest = false,
		adminOnly = false,
		dmCmd = false
	}) {
		this.client = client;
		this.config = {
			dirname,
			enabled,
			ownerOnly,
			rootOnly,
			onTest,
			adminOnly,
			dmCmd
		};
		this.info = {
			name,
			description,
			usage,
			examples,
			category,
			aliases,
			cmdChannel,
			accaptedPerms,
			cooldown
		};
		this.cooldown = new Collection()
	}

	load() {
		this.log(`Prefix komutu yükleniyor: ${this.info.name} 👌`, "load");
		this.client.responders.set(`dot:${this.name}`, this);
	}
}


function dateTimePad(value, digits) {
	let number = value;
	while (number.toString().length < digits) {
		number = "0" + number;
	}
	return number;
}

function format(tDate) {
	return (tDate.getFullYear() + "-" + dateTimePad((tDate.getMonth() + 1), 2) + "-" + dateTimePad(tDate.getDate(), 2) + " " + dateTimePad(tDate.getHours(), 2) + ":" + dateTimePad(tDate.getMinutes(), 2) + ":" + dateTimePad(tDate.getSeconds(), 2) + "." + dateTimePad(tDate.getMilliseconds(), 3));
}

const models = {
	member: model("meta_members", new Schema({
		_id: String,
		roles: [Types.ObjectId],
		afk_data: {
			note: String,
			created: Date,
			iskAfk: Boolean,
			inbox: [{
				content: String,
				from: String,
				created: Date
			}]
		},
		rewards: [{
			created: Date,
			topic: String,
			action: String
		}],
		names: [{
			username: String,
			discriminator: String,
			created: Date,
			claimer: String
		}],
		registries: [{
			name: String,
			age: Number,
			gender: String,
			created: Date,
			executor: String
		}],
		authorized: [{
			auditType: String,
			until: Date,
			created: Date,
			executor: String
		}],
		msgData: [{
			message: String,
			created: Date,
			channel: String,
			extras: [String]
		}]
	}, { _id: false })),
	penalties: model("data_penalty", new Schema({
		userId: String,
		executor: String,
		reason: String,
		typeOf: String,
		extras: Array,
		until: Date,
		created: Date
	})),
	roles: model("meta_roles", new Schema({
		keyConf: String,
		commands: [String],
		meta: [{
			_id: String,
			name: String,
			icon: String,
			color: String,
			hoist: Boolean,
			mentionable: Boolean,
			position: Number,
			bitfield: String,
			auditRef: String,
			created: Date,
			emoji: String
		}],
		overwrites: [{
			_id: String,
			typeOf: String,
			allow: [String],
			deny: [String]
		}],
		deleted: Boolean,
		emojis: [String],
		tags: [String]
	})),
	channels: model("meta_channels", new Schema({
		keyConf: String,
		kindOf: String,
		parent: String,
		meta: [{
			_id: String,
			name: String,
			userLimit: Number,
			position: Number,
			created: Date,
			bitrate: Number,
			nsfw: Boolean,
			rateLimit: Number
		}],
		overwrites: [{
			_id: String,
			typeOf: String,
			deny: [String],
			allow: [String]
		}],
		deleted: Boolean,
		extras: Array,
		tags: [String]
	})),
	invites: model("log_invite", new Schema({
		inviter: String,
		invited: String,
		created: Date,
		urlCode: String,
		left: Date
	})),
	voice: model("log_voice", new Schema({
		channelId: String,
		userId: String,
		self_mute: Boolean,
		self_deaf: Boolean,
		server_mute: Boolean,
		server_deaf: Boolean,
		streaming: Boolean,
		webcam: Boolean,
		playing: Boolean
	})),
	cmd: model("log_cmd", new Schema({
		_id: Types.ObjectId,
		cmd: String,
		executorId: String,
		args: String,
		resp: String
	})),
	action: model("log_audit", new Schema({
		executorId: String,
		auditId: String,
		target: String,
		targetId: String,
		targetType: String,
		action: String,
		actionType: String,
		extra: Object,
		reason: String,
		data: Object,
		changes: Array,
		created: Date
	})),
	forbidden: model("data_forbidden", new Schema({
		tag: String,
		type: String,
		reason: String
	}))
};

const functions = {
	comparedate(date) {
		let now = new Date();
		let diff = now.getTime() - date.getTime();
		let days = Math.floor(diff);
		return days;
	},
	checkSecs(date) {
		let now = new Date();
		let diff = now.getTime() - date.getTime();
		let days = Math.floor(diff / 1000);
		return days / 60;
	},
	checkMins(date) {
		let now = new Date();
		let diff = now.getTime() - date.getTime();
		let secs = Math.floor(diff / 60000);
		return secs;
	},
	sortByKey(array, key) {
		return array.sort(function (a, b) {
			let x = a[key];
			let y = b[key];
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		});
	},
	shuffle(pArray) {
		let array = [];
		pArray.forEach(element => array.push(element));
		let currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	},
	randomNum(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	},
	rain(client, sayi) {
		const emojis = low(client.adapters('emojis'))
			.get("numbers");
		var basamakbir = sayi.toString()
			.replace(/ /g, "     ");
		var basamakiki = basamakbir.match(/([0-9])/g);
		basamakbir = basamakbir.replace(/([a-zA-Z])/g, "bilinmiyor")
			.toLowerCase();
		if (basamakiki) {
			basamakbir = basamakbir.replace(/([0-9])/g, d => {
				return {
					"0": emojis.sfr,
					"1": emojis.bir,
					"2": emojis.iki,
					"3": emojis.uch,
					"4": emojis.drt,
					"5": emojis.bes,
					"6": emojis.alt,
					"7": emojis.ydi,
					"8": emojis.sks,
					"9": emojis.dkz
				}[d];
			});
		}
		return basamakbir;
	},
	sayi(number) {
		var reg = new RegExp("^\\d+$");
		var valid = reg.test(numbdate1er);
		return valid;
	},
	checkDays(date) {
		let now = new Date();
		let diff = now.getTime() - date.getTime();
		let days = Math.floor(diff / 86400000);
		return days;
	},
	checkHours(date) {
		let now = new Date();
		let diff = now.getTime() - date.getTime();
		let days = Math.floor(diff / 3600000);
		return days;
	},
	log(content, type = "log") {
		const date = `[${format(new Date(Date.now()))}]:`;
		console.log(`${date}[${type.toUpperCase()}] ~ :${content} `);
	}
};

module.exports = {
	ButtonCommand,
	DotCommand,
	SlashCommand,
	MenuCommand,
	AppUserCommand,
	AppMessageCommand,
	ClientEvent,
	functions,
	models
};
