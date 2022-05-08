const { ClientEvent } = require("../../../base/utils");

class Ready extends ClientEvent {
	
	constructor(client) {
		super(client, {
			name: "_ready"
		});
		this.client = client;
	}

	async run(client) {
		client = this.client;
		this.client.invites = await client.guild.invites.fetch();
		if (this.client.guild.vanityURLCode) {
			await client.guild.fetchVanityData()
			.then((res) => {
				this.client.vanityUses = res.uses;
			})
			.catch(console.error);
		}
		await client.guild.members.cache.forEach(async (member) => {
			let rolex = [];
			member.roles.cache.map((r) => r.id).forEach((r) => {
				client.models.roles.findOne({ meta: { $elemMatch: { _id: r } } }).then((doc) => {
					rolex.push(doc._id);
				});
			});
			const doc = await this.client.models.member.findOne({ _id: member.user.id });
			if (!doc) {
				await this.client.models.member.create({
					_id: member.user.id,
					roles: rolex,
				});
			} else {
				await this.client.models.member.updateOne({ _id: member.user.id }, {
					$set: {
						roles: rolex
					}
				});
			}
			return "zort";
		});
		this.client.log(`[KAYITLAR TAMAMLANDI] `, "mongo");
	}
}

module.exports = Ready;
