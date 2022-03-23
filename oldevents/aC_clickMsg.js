const { ClientEvent } = require('../base/utils');
class MsgCmdHandler extends ClientEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }
    async run(interaction) {
        const client = this.client;
        this.data = await this.init();
        if (interaction.guild && (interaction.guild.id !== client.config.server)) return;
        let cmd = `Message:${interaction.name}`;
        console.log(cmd);
        if (client.responders.has(cmd)) {
            cmd = client.responders.get(cmd);
        } else return;
        let uCooldown = client.cmdCoodown[interaction.user.id];
        if (!uCooldown) {
            client.cmdCoodown[interaction.user.id] = {};
            uCooldown = client.cmdCoodown[interaction.user.id];
        }
        let time = uCooldown[`Message:${interaction.name}`] || 0;
        if (time && (time > Date.now())) return;
        try {
            cmd.run(client, interaction, this.data);
        } catch (e) {
            console.log(e);
        }


    }
}

module.exports = MsgCmdHandler;