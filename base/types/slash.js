const { ApplicationCommand } = require('discord.js');

class SlashCommand extends ApplicationCommand {
    constructor(client, {
        name = null,
        description = null,
        customId = null,
        options = [],
        disabled = false,
        dirname = null,
        IntChannel = null,
        cooldown = 5000,
        enabled = true
    }) {
        super(client, {
            id: customId,
            type: 1,
            application_id: client.application.id,
            guild_id: client.guild.id,
            name: name,
            description: description,
            options: options,
            default_permission: false,
        }, client.guild, client.guild.id);
        this.client = client;
        this.props = {
            name,
            dirname,
            IntChannel,
            cooldown,
            enabled,
            isconst
        };
        this.label = label;
        this.customId = customId;
        this.style = style;
        this.emoji = emoji;
        this.url = url;
        this.disabled = disabled;
        this.perms = [];
        this.data = {};
    }

    loadMarks(type) {
        this.client.models.marked_ids.find(type ? { type } : {}).then(docs => {
            docs.forEach(doc => {
                switch (doc.type) {
                    case "ROLE":
                        this.data.roles[doc._id] = doc.value;
                        break;
                    case "CHANNEL":
                        this.data.channels[doc._id] = doc.value;
                        break;
                    case "EMOJI":
                        this.data.emojis[doc._id] = doc.value;
                        break;
                    case "OTHER":
                        this.data.other[doc._id] = doc.value;
                        break;
                    default: break;
                }
            });
        });
        return this.data;
    }

    loadPerms() {
        this.client.models.cmd_perms.findOne({cmd_type: "BUTTON", _id: this.customId}).then(doc => {
            this.props.perms = doc.permissions;
        });
        return this.perms;
    }

}

module.exports = SlashCommand;