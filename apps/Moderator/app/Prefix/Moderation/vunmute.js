const Command = require('../../../Base/Command');
const low = require('lowdb');
const Mute = require('../../../../../MODELS/Moderation/VoiceMuted');
const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const moment = require("moment");
moment.locale('tr');
class vunMute extends Command {
    constructor(client) {
        super(client, {
            name: "vunmute",
            description: "Belirtilen kullanıcının varolan bir metin mute cezasını kaldırır.",
            usage: "cunmute etiket/id",
            examples: ["vunmute 674565119161794560"],
            category: "Moderasyon",
            aliases: ["vun"],
            accaptedPerms: ["root", "owner", "cmd-ceo","cmd-double","cmd-single", "cmd-mute"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        const vData = await Mute.findOne({ _id: mentioned.user.id });
        if (!vData) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (message.guild.members.cache.get(vData.executor).roles.highest.rawPosition > message.member.roles.highest.rawPosition) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        await Mute.deleteOne({ _id: mentioned.user.id });
        if (mentioned.voice && mentioned.voice.channel) await mentioned.voice.setMute(false);
        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
      //  this.client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        const logChannel = message.guild.channels.cache.get(channels.get("cmd-mod").value());
        //const embed = new Discord.MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("vunmute").value()} ${mentioned} kullanıcısı susturulması ${message.member} tarafından kaldırıldı!`);
        //await logChannel.send(embed);
        const embed = new Discord.MessageEmbed().setColor('YELLOW').setDescription(stripIndents`
        **${mentioned.user.tag}** (\`${mentioned.user.id}\`) adlı kullanıcının \`Ses kanallarındaki\` susturulması kaldırıldı.
        \` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`)
        \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\``);
        await message.guild.channels.cache.get(channels.get("log_vmute").value()).send(embed);
    }
}
module.exports = vunMute;