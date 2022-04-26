const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const Os = require('os');
const low = require('lowdb');
const { stripIndents } = require('common-tags');
const { checkHours } = require('../../../../../HELPERS/functions');
class Call extends Command {

    constructor(client) {
        super(client, {
            name: "sisteminfo",
            description: "Botun durumunu gösterir",
            usage: "sisteminfo",
            examples: ["sisteminfo"],
            category: "Genel",
            aliases: ["syi"],
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
        ${data.emojis["platform"]} İşletim Sistemi: \`${Os.platform()} ${Os.arch()}\`
        ${data.emojis["platform"]} Sahibi: **${client.owner.username}**
        ●▬▬▬▬▬▬▬▬▬●
        ${data.emojis["version"]} Version: \`${Os.version().split(' ')[0]}\`
        ${data.emojis["version"]} Sürüm: \`${Os.release()}\`
        ${data.emojis["version"]} Tip: \`${Os.type()}\`
        ●▬▬▬▬▬▬▬▬▬●
        ${data.emojis["uptime"]} Boş Hafıza: \`${(Os.freemem() / 1024 / 1024).toFixed(2)} MB\`
        ${data.emojis["uptime"]} Toplam Hafıza: \`${(Os.totalmem() / 1024 / 1024).toFixed(2)} MB\`
        ${data.emojis["uptime"]} Çalışma Süresi: \`${Math.floor(Os.uptime() / 3600)} Saat\`
        ●▬▬▬▬▬▬▬▬▬●
        ${data.emojis["type"]} Gecikme: \`${client.ws.ping} ms\`
        ${data.emojis["type"]} Süre: \`${Math.floor(process.uptime() / 3600)} Saat\`
        `);
        await message.reply(embed.setColor('#2f3136').setAuthor("VDS için tıklayınız", client.owner.displayAvatarURL({ dynamic: true }), "https://www.odeaweb.com/r/210"));
    }
}

module.exports = Call;