module.exports = class {
    constructor(client) {
        this.client = client;
    }
    async run(interaction) {
        const client = this.client;
        if (interaction.guild && (interaction.guild.id !== client.config.server)) return;
        let cmd = `slash:${interaction.commandName}`;
        if (client.responders.has(cmd)) {
            cmd = client.responders.get(cmd);
        } else return;
        try {
            cmd.run(client, interaction);
        } catch (e) {
            console.log(e);
        }

    }
}