const Discord = require('discord.js');
const { ButtonCommand } = require("../../../../base/utils");

class RolCekilis extends ButtonCommand {
    constructor(client) {
        super(client, {
            name: "rol_cekilis",
            cooldown: 10000
        });
        this.client = client;
    }

    async run(client, interaction, data) {
        const mentioned = client.guild.members.cache.get(interaction.user.id);
        if (interaction.values.includes("hunt_clear") && interaction.values.length === 1) {
            return await mentioned.roles.remove(Object.keys(data.roles).filter(key => key.startsWith("hunt_")).map(key => data.roles[key]));
        } else if (interaction.values.includes("hunt_clear")) {
            return await interaction.reply({
                content: "Sadece temizle seçeneğini kullan ya da hiç kullanma.",
                ephemeral: true
            });
        }
        const roleIDs = interaction.values.map(v => data.roles[v]);
        const rolArray = roleIDs.map(rID => client.guild.roles.cache.get(rID));
        await mentioned.roles.remove(Object.keys(data.roles).filter(key => key.startsWith("hunt_")).map(key => data.roles[key]));
        await mentioned.roles.add(roleIDs);
        const responseEmbed = new Discord.MessageEmbed().setDescription(`Sana;\n ${rolArray.join('\n')}\nrollerini verdim.`);
        return await interaction.reply({
            embeds: [responseEmbed],
            ephemeral: true
        });

    }
}

module.exports = RolCekilis;