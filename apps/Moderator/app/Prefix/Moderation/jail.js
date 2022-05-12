const Command = require('../../../Base/Command');
class Jail extends Command {
    constructor(client) {
        super(client, {
            name: "jail",
            description: "Belirtilen kullanıcıyı hapise atar",
            usage: "jail etiket/id sebep",
            examples: ["jail 674565119161794560 10 gün botları kötü yapıyor"],
            category: "Moderasyon",
            aliases: ["j"],
            accaptedPerms: ["jailor"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        client = this.client;
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react("🚫");
        let sebep = args.slice(1).join(" ");
        if (!sebep) return message.react("🚫");
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) return message.react("🚫");
        if (!mentioned.bannable) return message.react("🚫");
        client.handler.emit('jail', mentioned.user.id, message.author.id, sebep, "perma", 0);
        if (mentioned.voice.channel) await mentioned.voice.kick();
        await message.react("👍");
        //const logChannel = message.guild.channels.cache.get(data.channels["jaillog"]);
        //const embed = new Discord.MessageEmbed().setColor('BLACK').setDescription(`${data.emojis["ok"]} ${mentioned} kullanıcısı ${message.member} tarafından ${sebep} sebebiyle ${args[1] === 0 ? "perma" : args[1]} günlüğüne zindana şutlandı!`);
        // await logChannel.send(embed);
    }
}
module.exports = Jail;