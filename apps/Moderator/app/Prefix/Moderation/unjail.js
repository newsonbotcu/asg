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
            name: "unjail",
            description: "Belirtilen kullanıcının varolan jail cezasını kaldırır",
            usage: "unjail etiket/id",
            examples: ["unjail 674565119161794560"],
            category: "Moderasyon",
            aliases: ["unj"],
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

        if (!mentioned) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        const Data = await Jails.findOne({ _id: mentioned.user.id });
        if (!Data) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        await mentioned.roles.add(Data.roles.map(rname => message.guild.roles.cache.find(role => role.name === rname)));
        await mentioned.roles.remove(data.roles["prisoner"]);
        await Jails.deleteOne({ _id: mentioned.user.id });
        await message.react(data.emojis["ok"].split(':')[2].replace('>', ''));
        // client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        const embed = new MessageEmbed().setColor('YELLOW').setDescription(stripIndents`
        **${mentioned.user.tag}** (\`${mentioned.user.id}\`) adlı kullanıcının \`${Data.type.toLowerCase() === "temp" ? "süreli" : "kalıcı"}\` cezası kaldırıldı.
        \` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`)
        \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\``);
        await message.guild.channels.cache.get(data.channels["log_jail"]).send(embed);
    }
}
module.exports = unJail;