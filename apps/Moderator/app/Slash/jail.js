const { ApplicationCommand } = require('discord.js');

module.exports = class SlashJail extends ApplicationCommand {
    constructor(client, data, guild, guildId) {
        super(client, data = {
            name: "jail",
            description: "Kullanıcıyı cezalıya atar",
            default_permission: false,
            options: [
                {
                    type: "USER",
                    name: "kullanıcı",
                    description: "Banlanacak kullanıcı/id",
                    required: true,
                },
                {
                    type: "STRING",
                    name: "sebep",
                    description: "Jail sebebi",
                    required: true,
                },
                {
                    type: "NUMBER",
                    name: "süre",
                    description: "Saat sayısı",
                    required: false,
                },
                {
                    type: "STRING",
                    name: "not",
                    description: "Ceza notu",
                    required: false,
                }
            ],
            guildId: [guildId]
        }, guild, guildId);
        this.permissions = client.config.staff.slice(5);
    }
    async run(intg) {
        const target = intg.guild.members.cache.get(intg.options["kullanıcı"]);
        if (!target) return intg.reply({ content: `Kullanıcı bulunamadı. Lütfen etiketleyerek işlem yapmayı deneyin.`, ephemeral: true, fetchReply: true });

        if (intg.member.roles.highest.rawPosition <= target.roles.highest.rawPosition) return await intg.reply(`${emojis.get("missingPerms").value()} Bunu yapmak için yeterli yetkiye sahip değilsin`, {
            ephemeral: true
        });
        if (!target.bannable) return await intg.reply(`Bu kişiyi banlamak için yeterli yetkiye sahip değilim`, {
            ephemeral: true
        });
        let typo = "perma";
        if (intg.options["süre"]) typo = "temp";
        await client.extention.emit('Jail', target, intg.user.id, intg.options["sebep"], typo, intg.options["süre"], intg.options["not"]);
    }
}