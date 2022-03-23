const { ClientEvent } = require('../../base/utils');
class InteractionCreate extends ClientEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }
    async run(interaction) {
        this.data = this.loadMarks();
        const client = this.client;
        if (interaction.guild && (interaction.guild.id !== client.config.server)) return;
        let respond;
        switch (interaction.type) {
            case "APPLICATION_COMMAND":
                if (interaction.isContextMenu()) {
                    switch (interaction.targetType) {
                        case "USER":
                            respond = 'aC_clickUser';
                            break;
                        case "MESSAGE":
                            respond = 'aC_clickMsg';
                            break;
                        default:
                            respond = 'aC_slash';
                            break;
                    }
                } else {
                    respond = 'aC_slash';
                }
                break;
            case "MESSAGE_COMPONENT":
                respond = 'aC_button';
                break;
            default:
                break;
        }
        client.handler.emit(respond, interaction, data);
        return;
    }
}

module.exports = InteractionCreate;