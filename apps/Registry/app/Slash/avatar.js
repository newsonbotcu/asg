const { MessageEmbed, ApplicationCommand } = require('discord.js');
module.exports = class AFKCommand extends ApplicationCommand {
    constructor(client, data, guild, guildId) {
        super(client, data = {
            name: 'avatar',
            description: 'Kişinin avatarını gösterir',
            options: [
                {
                    type: "USER",
                    name: 'kullanıcı',
                    description: 'Kullanıcıyı belirtiniz',
                    required: false
                }
            ],
            guildId: [guildId]
        }, guild, guildId);

        this.filePath = __filename;
    }

    async run(intg) {
        const client = intg.creator.client;
        const userID = Object.values(intg.options)[0] || intg.member.user.id;
        const mentioned = client.guilds.cache.get(intg.guildID).members.cache.get(userID);
        const errEmbed = new MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('#2f3136')
        if (!mentioned) return intg.send({
            embeds: [errEmbed]
        });
        const embed = new MessageEmbed().setColor('#2f3136').setImage(mentioned.user.displayAvatarURL({ dynamic: true, size: 4096 }))
        await intg.send({
            embeds: [embed]
        });
    }
}
