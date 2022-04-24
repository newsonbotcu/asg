const { ClientEvent } = require('../../../base/utils');

class Ready extends ClientEvent {
	constructor(client) {
		super(client, {
			name: "_ready"
		});
		this.client = client;
	}
	
	async run(client) {
		client = this.client;
		const channels = client.guild.channels.cache.map((c) => c);
		for (let index = 0; index < channels.length; index++) {
			const channel = channels[index];
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
						userLimit: channel.userLimit,
						created: channel.createdAt
					}],
					overwrites: ovs
				});
			}
		}
		
	}
	
}

module.exports = Ready;
