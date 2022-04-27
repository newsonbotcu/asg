const { MessageEmbed } = require('discord.js');
const { SlashCommand } = require('../../../../base/utils');

class SlashMute extends SlashCommand {
    constructor(client) {
        super(client, {
            name: "mute",
            description: "Kullanıcıya mute atar",
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
                            value: "cmute"
                        },
                        {
                            name: "voice",
                            value: "vmute"
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
            ]
        });
    }
    async run(intg) {
        const target = intg.guild.members.cache.get(intg.options["kullanıcı"]);
        if (!target) return intg.reply({ content: `Kullanıcı bulunamadı. Lütfen etiketleyerek işlem yapmayı deneyin.`, ephemeral: true, fetchReply: true });

        if (intg.member.roles.highest.rawPosition <= target.roles.highest.rawPosition) return await intg.reply(`Bunu yapmak için yeterli yetkiye sahip değilsin`, {
            ephemeral: true
        });
        if (!intg.member.roles.cache.has(this.client.data.roles[intg.options["tür"]])) return await intg.reply({
            content: `Bunu yapmak için belirlenmiş yetkiye sahip değilsin`,
            ephemeral: true
        });
        await client.handler.emit(intg.options["tür"], target.user.id, intg.user.id, intg.options["sebep"], intg.options["süre"]);
        await intg.reply({
            content: `<@${targer.user.id}> başarıyla susturuldu`,
            ephemeral: true
        });

    }
}
module.exports = SlashMute;