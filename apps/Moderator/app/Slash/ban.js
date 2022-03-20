const { ApplicationCommand, Permissions } = require('discord.js');

module.exports = class SlashBan extends ApplicationCommand {
    constructor(client, data, guild, guildId) {
        super(client, data = {
            name: "ban",
            description: "Kullanıcıyı sunucudan süreli veya süresiz banlar",
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
                    description: "Banlanma sebebi",
                    required: true,
                },
                {
                    type: "NUMBER",
                    name: "süre",
                    description: "Gün sayısı",
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
        if (!intg.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS) && !intg.member.roles.cache.has(client.config.staff.slice(5).map(o => o))) return;

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
        await client.handler.emit('Ban', intg.guild, target.id, intg.user.id, intg.options["sebep"], typo, intg.options["süre"], intg.options["not"]);

    }
}