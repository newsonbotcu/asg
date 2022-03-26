const Command = require('../../../Base/Command');
const low = require('lowdb');
const { stripIndents } = require('common-tags');
const Jails = require('../../../../../MODELS/Moderation/Jails');
const { MessageEmbed } = require('discord.js');
const moment = require("moment");
moment.locale('tr');
class unJail extends Command {
    constructor(client) {
        super(client, {
            name: "unreklam",
            description: "Belirtilen kullanıcının reklam cezasını kaldırır",
            usage: "unreklam etiket/id",
            examples: ["unreklam 674565119161794560"],
            category: "Moderasyon",
            aliases: [],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "cmd-jail"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        // if(mentioned) return message.reply(`${message.author.id}, ${mentioned.id}`)

        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        const Data = await Jails.findOne({ _id: mentioned.user.id });
        if (!Data) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        await mentioned.roles.add(Data.roles.map(rname => message.guild.roles.cache.find(role => role.name === rname)));
        await mentioned.roles.remove(roles.get("reklamcı").value());
        await Jails.deleteOne({ _id: mentioned.user.id });
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        // client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        await messsage.guild.channels.cache.get(channels.get("log_reklam").value()).send(new MessageEmbed().setDescription(stripIndents`
        **${member.user.tag}** (\`${member.user.id}\`) adlı kullanıcının \`reklamcı\` olmadığı ortaya çıktı!
        \` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`)
        \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
        `).setColor("YELLOW"));
        
    }
}
module.exports = unJail;