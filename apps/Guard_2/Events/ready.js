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
		const roles = client.guild.roles.cache.map(r => r);
		for (let index = 0; index < roles.length; index++) {
			const role = roles[index];
			const roleData = await client.models.roles.findOne({ meta: { $elemMatch: { _id: role.id } } });
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
			this.client.log(`${role.name} başarıyla yedeklendi`);
		}
	}
}

module.exports = Ready;
