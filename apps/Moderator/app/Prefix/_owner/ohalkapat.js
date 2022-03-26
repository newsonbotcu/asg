const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const { stripIndents } = require("common-tags");
const chp = require("child_process");
const VoiceChannels = require("../../../../../MODELS/Datalake/VoiceChannels");
class Eval extends Command {

    constructor(client) {
        super(client, {
            name: "ohalkapat",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: ["ok"],
            accaptedPerms: [],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: true,
            onTest: false,
            rootOnly: false,
            dmCmd: false
        });
    }

    async run(client, message, args) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
    
        await utils.set('ohal', false).write();


    }

}

module.exports = Eval;