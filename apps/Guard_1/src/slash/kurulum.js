const { ApplicationCommand, MessageEmbed, BaseMessageComponent } = require('discord.js');

module.exports = class SlashSet extends ApplicationCommand {
    constructor(client, data, guild, guildId) {
        super(client, data = {
            name: "kurulum",
            description: "Data işlemleri",
            guildId: [guildId]
        }, guild, guildId);
        this.permissions = client.config.staff.slice(0).map(o => {
            return {
                id: o,
                type: "ROLE",
                permission: true
            }
        });
    }
    async run(client, intg) {
        const embed = new MessageEmbed().setDescription('deneme');
        await intg.deferReply({ ephemeral: true })
        await intg.editReply({
            embeds: [embed],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Rol",
                            style: 1,
                            custom_id: "kurulum_rol",
                        },
                        {
                            type: 2,
                            label: "Kanal",
                            style: 1,
                            custom_id: "kurulum_kanal",
                        }
                    ]

                }
            ],
            ephemeral: true
        });
        const defer = await intg.fetchReply();
        const filter = (interaction) => interaction.customId === 'kurulum_rol' && interaction.user.id === intg.user.id;
        const collector = await defer.createMessageComponentCollector({ filter, time: 15_000 });
        collector.on("collect", () => {
            intg.editReply("asfds")
        })

    }
}