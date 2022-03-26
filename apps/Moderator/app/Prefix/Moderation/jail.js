const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const { sayi } = require("../../../../../HELPERS/functions");
class Jail extends Command {
    constructor(client) {
        super(client, {
            name: "jail",
            description: "Belirtilen kullanıcıyı hapise atar",
            usage: "jail etiket/id sebep",
            examples: ["jail 674565119161794560 10 gün botları kötü yapıyor"],
            category: "Moderasyon",
            aliases: ["hapis", "zindan"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "cmd-jail"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        client = this.client;
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        let sebep = args.slice(1).join(" ");
        if (!sebep) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (!mentioned.bannable) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        client.handler.emit('Jail', mentioned, message.author.id, sebep, "perma", 0);
        if (mentioned.voice.channel) await mentioned.voice.kick();
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        //const logChannel = message.guild.channels.cache.get(channels.get("jaillog").value());
        //const embed = new Discord.MessageEmbed().setColor('BLACK').setDescription(`${emojis.get("ok").value()} ${mentioned} kullanıcısı ${message.member} tarafından ${sebep} sebebiyle ${args[1] === 0 ? "perma" : args[1]} günlüğüne zindana şutlandı!`);
        // await logChannel.send(embed);
    }
}
module.exports = Jail;