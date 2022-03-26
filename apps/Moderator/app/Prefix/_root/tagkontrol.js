const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const izin = require('../../../../../MODELS/Temprorary/Permissions');
const keyz = require('shortid');
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "tagkontrol",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: [],
            acceptedRoles: [],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: false,
            rootOnly: true,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        message.guild.members.cache.filter(m => m.roles.cache.has(roles.get("crew").value()) && !client.config.tag.some(t => m.user.username.includes(t)) && !m.user.bot).forEach(m => {
            m.roles.remove(roles.get("crew").value());
            m.setNickname(m.displayName.replace(`•`, client.config.tag[0]));
        });
        message.guild.members.cache.filter(m => !m.roles.cache.has(roles.get("crew").value()) && client.config.tag.some(t => m.user.username.includes(t)) && !m.user.bot).forEach(m => {
            m.roles.add(roles.get("crew").value());
            m.setNickname(m.displayName.replace(client.config.tag[0], '•'));
        });
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));

    }

}

module.exports = Kur;