const Discord = require('discord.js');
const { ButtonCMD } = require("../../../../base/utils");

class RolSeçim extends Discord.BaseMessageComponent {
    constructor(client, data, guild, guildId) {
        super(client, data = {
            name: "kurulum_rol",
            accaptedPerms: [],
            cooldown: 10000,
            enabled: true,
            ownerOnly: false,
            rootOnly: false,
            onTest: false,
            adminOnly: false,
            guildId: [guildId]
        }, guild, guildId);
    }

    async run(client, int) {
        int.message.edit("tm")
    }
}

module.exports = RolSeçim;