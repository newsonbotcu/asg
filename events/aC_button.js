module.exports = class {
    constructor(client) {
        this.client = client;
    }
    async run(interaction) {
        const client = this.client;
        if (interaction.guild && (interaction.guild.id !== client.config.server)) return;
        let cmd = `button:${interaction.name}`;
        console.log(cmd);
        if (client.responders.has(cmd)) {
            cmd = client.responders.get(cmd);
        } else return;
        let uCooldown = client.cmdCoodown[interaction.user.id];
        if (!uCooldown) {
            client.cmdCoodown[interaction.user.id] = {};
            uCooldown = client.cmdCoodown[interaction.user.id];
        }
        let time = uCooldown[`button:${interaction.name}`] || 0;
        if (time && (time > Date.now())) return;
        try {
            cmd.run(client, interaction);
        } catch (e) {
            console.log(e);
        }


    }
}