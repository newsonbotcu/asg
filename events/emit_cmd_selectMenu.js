const { ClientEvent } = require('../base/utils');
class MenuCommandCreate extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "interactionCreate"
        });
        this.client = client;
    }
    async run(interaction) {
        this.data = this.loadMarks();
        if (interaction.guild && (interaction.guild.id !== this.client.config.server)) return;
        if (!interaction.isMessageComponent()) return;
        if (!interaction.isButton()) return;
        if (interaction.isContextMenu()) return;
        if (interaction.targetType !== "USER") return;
        if (client.responders.has(`menu:${interaction.commandName}`)) {
            cmd = client.responders.get(`menu:${interaction.commandName}`);
        } else return;
        if (!cmd.props.enabled) return await interaction.reply(`Bu komut şuan için **devredışı**`, {
            ephemeral: true
        });
        if (cmd.props.dmCmd && (interaction.channel.type !== 'dm')) return await interaction.reply(`Bu komut bir **DM** komutudur.`);
        if (interaction.guild && cmd.props.intChannel) {
            const recnl = interaction.guild.channels.cache.get(this.data.channels[cmd.props.cmdChannel]);
            if (recnl && recnl.id !== interaction.channel.id) return await interaction.reply(`Bu komutu ${recnl} kanalında kullanmayı dene!`, {
                ephemeral: true
            });
        }
        if (uCooldown && (uCooldown > Date.now())) return await interaction.reply(`Komutu tekrar kullanabilmek için lütfen **${Math.ceil((time - Date.now()) / 1000)}** saniye bekle!`, {
            ephemeral: true
        });
        try {
            const res = await cmd.run(client, interaction, this.data);
            client.log(`[(${interaction.user.id})] ${interaction.user.username} ran command [${cmd.props.name}]`, "slash");
            if (!res) cmd.cooldown.set(interaction.user.id, Date.now());
        } catch (e) {
            client.log(e, "error");
        }
    }
}

module.exports = MenuCommandCreate;