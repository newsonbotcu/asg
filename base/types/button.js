const { MessageButton } = require('discord.js');

class ButtonCommand extends MessageButton {
    constructor(client, {
        name = null,
        label = null,
        customId = null,
        style = "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK",
        emoji = null,
        url = null,
        disabled = false,
        dirname = null,
        IntChannel = null,
        cooldown = 5000,
        enabled = true
    }) {
        super();
        this.client = client;
        this.props = {
            name,
            dirname,
            IntChannel,
            cooldown,
            enabled
        };
        this.label = label;
        this.customId = customId;
        this.style = style;
        this.emoji = emoji;
        this.url = url;
        this.disabled = disabled;
        this.perms = [];
        this.data = {
            emojis: {},
            channels: {},
            roles: {},
            other: {}
        };
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

module.exports = ButtonCommand;