const Discord = require('discord.js');
const moment = require("moment");
moment.locale('tr');
const { DotCommand } = require("../../../../base/utils");
class vMute extends DotCommand {

    constructor(client) {
        super(client, {
            name: "vmute",
            description: "Belirtilen kullanıcıyı geçici olarak ses kanallarından susturur",
            usage: "vmute etiket/id dakika sebep",
            examples: ["vmute 674565119161794560 10 botları kötü yapıyor"],
            category: "Moderasyon",
            aliases: ["sus", "vm"],
            accaptedPerms: ["vmute", "yt"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return messasayige.reply({
            embeds: [
                new Discord.MessageEmbed().setDescription(`Kullanıcı bulunamadı!`).setColor('#2f3136')
            ]
        }).then(msg => msg.delete({ timeout: 10_000 }))
        const sebep = args.slice(2).join(" ");
        if (!mentioned) {
            await message.react("🚫");
            return message.reply({
                embeds: [
                    new Discord.MessageEmbed().setDescription(`Kullanıcı bulunamadı!`).setColor('#2f3136')
                ]
            }).then(msg => msg.delete({ timeout: 10_000 }))
        }
        if (!sebep) {
            await message.react("🚫");
            return message.reply({
                embeds: [
                    new Discord.MessageEmbed().setColor('#2f3136').setDescription(`Bir sebep girmelisin`)
                ]
            }).then(msg => msg.delete({ timeout: 10_000 }))
        }
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) {
            await message.react("🚫");
            return message.reply({
                embeds: [
                    new Discord.MessageEmbed().setColor('#2f3136').setDescription(`Bunu yapmak için yeterli yetkiye sahip değilsin`)
                ]
            }).then(msg => msg.delete({ timeout: 10_000 }))
        }
        if (!client.func.sayi(args[1])) {
            await message.react("🚫");
            return message.reply({
                embeds: [
                    new Discord.MessageEmbed().setColor('#2f3136').setDescription(`Geçerli bir dakika girmelisin`)
                ]
            }).then(msg => msg.delete({ timeout: 10_000 }))
        }
        client.emit('vmute', mentioned.user.id, message.author.id, sebep, args[1]);
        await message.react("👍");
        //this.client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        const logChannel = message.guild.channels.cache.get(data.channels["cmd-mod"]);
        //const embed = new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${mentioned} kullanıcısı ${message.member} tarafından susturuldu!`);
        //await logChannel.send(embed);

    }
}
module.exports = vMute;