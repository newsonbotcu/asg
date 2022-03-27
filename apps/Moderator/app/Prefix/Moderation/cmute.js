const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { sayi } = require('../../../../../HELPERS/functions');
class CMute extends Command {
    constructor(client) {
        super(client, {
            name: "cmute",
            description: "Belirtilen kullanıcıyı geçici olarak metin kanallarından susturur.",
            usage: "cmute etiket/id dakika sebep",
            examples: ["cmute 674565119161794560 10 botları kötü yapıyor"],
            category: "Moderasyon",
            aliases: ["cm", "chatmute","mute"],
            accaptedPerms: ["root", "owner", "cmd-ceo","cmd-double","cmd-single", "cmd-mute"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) {
            await message.react(data.emojis["error"].split(':')[2].replace('>', ''));
            return message.inlineReply(new Discord.MessageEmbed().setDescription(`${data.emojis["kullaniciyok"]} Kullanıcı bulunamadı!`).setColor('BLACK')).then(msg => msg.delete({ timeout: 1000 }));
        }
        const sebep = args.slice(2).join(" ");
        if (!sebep) {
            await message.react(data.emojis["error"].split(':')[2].replace('>', ''));
            return message.inlineReply(new Discord.MessageEmbed().setColor('BLACK').setDescription(`${data.emojis["soru"]} Bir sebep girmelisin`)).then(msg => msg.delete({ timeout: 1000 }));
        }
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) {
            await message.react(data.emojis["error"].split(':')[2].replace('>', ''));
            return message.inlineReply(new Discord.MessageEmbed().setColor('BLACK').setDescription(`${data.emojis["missingPerms"]} Bunu yapmak için yeterli yetkiye sahip değilsin`)).then(msg => msg.delete({ timeout: 1000 }));
        }
        if (!mentioned.bannable) {
            await message.react(data.emojis["error"].split(':')[2].replace('>', ''));
            return message.inlineReply(new Discord.MessageEmbed().setColor('BLACK').setDescription(`${data.emojis["miisingBotPerms"]} Bu kişiyi mutelemek için yeterli yetkiye sahip değilim`)).then(msg => msg.delete({ timeout: 1000 }));
        }
        if (!sayi(args[1])) {
            await message.react(data.emojis["error"].split(':')[2].replace('>', ''));
            return message.inlineReply(new Discord.MessageEmbed().setColor('BLACK').setDescription(`${data.emojis["sayifalan"]} Geçerli bir dakika girmelisin`)).then(msg => msg.delete({ timeout: 1000 }));
        }
        client.handler.emit('cMute', mentioned, message.author.id, sebep, args[1]);
        await message.react(data.emojis["ok"].split(':')[2].replace('>', ''));
        /*
        this.client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        const logChannel = message.guild.channels.cache.get(data.channels["cmd-mod"]);
        const embed = new Discord.MessageEmbed().setColor('BLACK').setDescription(`${data.emojis["cmute"]} ${mentioned} kullanıcısı ${message.member} tarafından susturuldu!`);
        await logChannel.send(embed);
        */
    }
}
module.exports = CMute;