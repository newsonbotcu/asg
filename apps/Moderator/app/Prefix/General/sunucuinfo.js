const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndents } = require('common-tags');
const { checkDays, rain } = require('../../../../../HELPERS/functions');
class Call extends Command {

    constructor(client) {
        super(client, {
            name: "sunucuinfo",
            description: "Botun durumunu gösterir",
            usage: "sunucuinfo",
            examples: ["sunucuinfo"],
            category: "Genel",
            aliases: ["sunucu"],
            cmdChannel: "bot-komut",
            cooldown: 300000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const embed = new Discord.MessageEmbed().setDescription(stripIndents`
        ${data.emojis["pandomeme"]} Açılma Tarihi: ${rain(client, checkDays(message.guild.createdAt))} **gün önce**
        ${data.emojis["pandomeme"]} Taç sahibi: **${message.guild.owner.user.username}**
        ●▬▬▬▬▬▬▬▬▬●
        ${data.emojis["lock"]} Kanal sayısı: ${rain(client, message.guild.channels.cache.size)}
        ${data.emojis["lock"]} Rol sayısı: ${rain(client, message.guild.roles.cache.size)}
        ${data.emojis["lock"]} Emoji sayısı: ${rain(client, message.guild.emojis.cache.size)}
        ●▬▬▬▬▬▬▬▬▬●
        ${data.emojis["maviskull"]} Toplam üye: ${rain(client, message.guild.memberCount)}
        ${data.emojis["maviskull"]} Çevrimiçi üye: ${rain(client, message.guild.members.cache.filter(m => m.presence.status !== 'offline').size)}
        ${data.emojis["maviskull"]} Yetkili üye: ${rain(client, message.guild.members.cache.filter(m => m.roles.cache.has(data.roles["crew"])).size)}
        ${data.emojis["maviskull"]} Zindandaki üye: ${rain(client, message.guild.members.cache.filter(m => m.roles.cache.has(data.roles["prisoner"])).size)}
        ${data.emojis["maviskull"]} Kayıtsız üye: ${rain(client, message.guild.members.cache.filter(m => m.roles.cache.has(data.roles["welcome"])).size)}
        ${data.emojis["maviskull"]} Booster üye: ${rain(client, message.guild.members.cache.filter(m => m.roles.cache.has(data.roles["booster"])).size)}
        ●▬▬▬▬▬▬▬▬▬●

        `);
        await message.reply(embed.setColor('#2f3136').setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }), "https://tantoony.net/"));
    }
}

module.exports = Call;