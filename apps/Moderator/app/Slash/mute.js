const { ApplicationCommand } = require('discord.js');

module.exports = class SlashMute extends ApplicationCommand {
    constructor(client, data, guild, guildId) {
        super(client, data = {
            name: "mute",
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
                    name: "tür",
                    description: "mute türü",
                    choices: [
                        {
                            name: "chat",
                            value: "cMute"
                        },
                        {
                            name: "voice",
                            value: "vMute"
                        }
                    ],
                    required: true,
                },
                {
                    type: "NUMBER",
                    name: "süre",
                    description: "dakika sayısı",
                    required: true,
                },
                {
                    type: "STRING",
                    name: "sebep",
                    description: "Ceza sebebi",
                    required: true,
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
        await client.handler.emit(intg.options["tür"], target, intg.user.id, intg.options["sebep"], intg.options["süre"]);


    }
}