const Discord = require('discord.js');
const moment = require("moment");
moment.locale('tr');
const { stripIndents } = require('common-tags');
const { DotCommand } = require("../../../../base/utils");
class cunMute extends DotCommand {
    constructor(client) {
        super(client, {
            name: "cunmute",
            description: "Belirtilen kullanıcının varolan bir ses mute cezasını kaldırır.",
            usage: "cunmute etiket/id",
            examples: ["cunmute 674565119161794560"],
            category: "Moderasyon",
            aliases: ["cun", "unmute"],
            accaptedPerms: ["cmute", "yt"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return await message.react("🚫");// message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        if (message.guild.members.cache.get(vData.executor).roles.highest.rawPosition > message.member.roles.highest.rawPosition) return await message.react("🚫");// message.react(client.data.emojis["error"].split(':')[2].replace('>', ''));
        await client.models.penalties.updateOne({ userId: mentioned.user.id, typeOf: "CMUTE" }, { $set: { until: new Date() } });
        await mentioned.roles.remove(client.data.roles["muted"]);
        await message.react("👍");
        /*
        this.client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        const logChannel = message.guild.channels.cache.get(data.channels["cmd-mod"]);
        const embed = new Discord.MessageEmbed().setColor('BLACK').setDescription(`${data.emojis["cunmute"]} ${mentioned} kullanıcısı susturulması ${message.member} tarafından kaldırıldı!`);
        await logChannel.send(embed);
        */
        const embed = new Discord.MessageEmbed().setColor('YELLOW').setDescription(stripIndents`
        **${mentioned.user.tag}** (\`${mentioned.user.id}\`) adlı kullanıcının \`Metin kanallarındaki\` susturulması kaldırıldı.
        \` • \` Kaldıran Yetkili: ${message.member} (\`${message.author.id}\`)
        \` • \` Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\``);
        //await message.guild.channels.cache.get(data.channels["log_cmute"]).send(embed);
    }
}
module.exports = cunMute;