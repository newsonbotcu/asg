const Command = require('../../../Base/Command');
const low = require('lowdb');
const Mute = require('../../../../../MODELS/Moderation/ChatMuted');
const Discord = require('discord.js');
const moment = require("moment");
moment.locale('tr');
const { stripIndents } = require('common-tags');
class cunMute extends Command {
    constructor(client) {
        super(client, {
            name: "cunmute",
            description: "Belirtilen kullanıcının varolan bir ses mute cezasını kaldırır.",
            usage: "cunmute etiket/id",
            examples: ["cunmute 674565119161794560"],
            category: "Moderasyon",
            aliases: ["cun","unmute"],
            accaptedPerms: ["root", "owner", "cmd-ceo","cmd-double","cmd-single", "cmd-mute"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        const vData = await Mute.findOne({ _id: mentioned.user.id });
        if (!vData) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (message.guild.members.cache.get(vData.executor).roles.highest.rawPosition > message.member.roles.highest.rawPosition) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        await Mute.deleteOne({ _id: mentioned.user.id });
        await mentioned.roles.remove(roles.get("muted").value());
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
        /*
        this.client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        const logChannel = message.guild.channels.cache.get(channels.get("cmd-mod").value());
        const embed = new Discord.MessageEmbed().setColor('BLACK').setDescription(`${emojis.get("cunmute").value()} ${mentioned} kullanıcısı susturulması ${message.member} tarafından kaldırıldı!`);
        await logChannel.send(embed);
        */
        const embed = new Discord.MessageEmbed().setColor('YELLOW').setDescription(stripIndents`
        **${mentioned.user.tag}** (\`${mentioned.user.id}\`) adlı kullanıcının \`Metin kanallarındaki\` susturulması kaldırıldı.
        \` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`)
        \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\``);
        await message.guild.channels.cache.get(channels.get("log_cmute").value()).send(embed);
    }
}
module.exports = cunMute;