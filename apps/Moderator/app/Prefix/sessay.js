const { DotCommand } = require("../../../../base/utils");
class CountByRole extends DotCommand {

    constructor(client) {
        super(client, {
            name: "sessay",
            description: "belirtilen rolün rengini yollar",
            usage: "sessay rolid",
            examples: ["sessay 718265023750996028"],
        //  cooldown: 3600000,
            category: "Yetkili",
            accaptedPerms: ["yt"],
        });
    }

    async run(client, message, args) {

        const mentionedRole = message.guild.roles.cache.get(args[0]) || message.mentions.roles.first()
        if(!mentionedRole) return message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        let sessay = mentionedRole.members.filter(a => a.presence.status == "online" && !a.voice.channel).map(a => `${a.displayName} [${a.user.tag} (${a.user.id})]`).join("\n")
        let sessaysize = mentionedRole.members.filter(a => a.presence.status == "online" && !a.voice.channel).size

        let amsay = mentionedRole.members.filter(a => a.presence.status !== "online").size
        message.reply(`\`\`\`${mentionedRole.name} Rolünün istatistikleri. \n\n• Aktif olmayann üyeler: ${amsay} \n\n• Aktif olup seste olmayanlar (${sessaysize}) \n${sessay}\`\`\``)
    }

}

module.exports = CountByRole;