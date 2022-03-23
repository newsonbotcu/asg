const { ClientEvent } = require('../base/utils');
class UsrCmdHandler extends ClientEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }
    async run(interaction) {
        const client = this.client;
        this.data = await this.init();
        if (interaction.guild && (interaction.guild.id !== client.config.server)) return;
        let cmd = `User:${interaction.commandName}`;
        if (client.responders.has(cmd)) {
            cmd = client.responders.get(cmd);
        } else return;
        try {
            cmd.run(client, interaction, this.data);
        } catch (e) {
            console.log(e);
        }


    }
}
module.exports = UsrCmdHandler;