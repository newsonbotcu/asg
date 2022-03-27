const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { sayi } = require("../../../../../HELPERS/functions");
class Jail extends Command {
    constructor(client) {
        super(client, {
            name: "tempjail",
            description: "Belirtilen kullanıcıyı hapise atar",
            usage: "tempjail etiket/id sayı gün/saat sebep",
            examples: ["tempjail 674565119161794560 10 gün botları kötü yapıyor"],
            category: "Moderasyon",
            aliases: ["tjail", "tj"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "cmd-jail"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        client = this.client;
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        let sebep = args.slice(3).join(" ");
        if (!sebep) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        if (!mentioned.bannable) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        if (!sayi(args[1])) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        if ((args[2] !== 'gün') && (args[2] !== 'saat')) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        if (args[2] === 'saat') args[1] = args[1] / 24;
        client.handler.emit('Jail', mentioned, message.author.id, sebep, "temp", args[1]);
        if (mentioned.voice.channel) await mentioned.voice.kick();
        await message.react(data.emojis["ok"].split(':')[2].replace('>', ''));
        //const logChannel = message.guild.channels.cache.get(data.channels["jaillog"]);
        //const embed = new Discord.MessageEmbed().setColor('BLACK').setDescription(`${data.emojis["ok"]} ${mentioned} kullanıcısı ${message.member} tarafından ${sebep} sebebiyle ${args[1] === 0 ? "perma" : args[1]} günlüğüne zindana şutlandı!`);
        // await logChannel.send(embed);
    }
}
module.exports = Jail;