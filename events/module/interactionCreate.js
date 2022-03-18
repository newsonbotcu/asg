const { CliEvent } = require('../../base/utils');
class InteractionCreate extends CliEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }
    async run(interaction) {
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
        client.extention.emit(respond, interaction);
        return;
    }
}

module.exports = InteractionCreate;