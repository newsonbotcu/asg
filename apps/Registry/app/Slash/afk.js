const { MessageEmbed, ApplicationCommand } = require('discord.js');
module.exports = class AFKCommand extends ApplicationCommand {
    constructor(client, data, guild, guildId) {
        super(client, data = {
            name: 'afk',
            description: 'afk ayarlamak için kullanılır.',
            options: [
                {
                    type: "STRING",
                    name: 'sebep',
                    description: 'sebep belirtiniz',
                    required: true
                }
            ],
            guildId: [guildId]
        }, guild, guildId);
        this.filePath = __filename;
    }

    async run(intg) {
        const system = await intg.client.models.afk.findOne({ _id: intg.user.id });
        if (!system) {
            await client.models.afk.create({
                _id: intg.user.id,
                reason: Object.values(intg.options)[0],
                created: new Date(),
                inbox: []
            });
            const embed = new MessageEmbed().setColor('#2f3136').setDescription(`Başarıyla Ayarlandı!`);
            await intg.reply({
                embeds: [embed]
            });
        } else return;
    }
}
