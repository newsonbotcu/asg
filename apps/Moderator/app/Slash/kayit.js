const { MessageEmbed } = require('discord.js');
const { SlashCommand } = require('../../../../base/utils');

class SlashKayit extends SlashCommand {
    constructor(client) {
        super(client, {
            name: "kayıt",
            description: "Kullanıcıyı kayıt eder",
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
                    name: "cinsiyet",
                    description: "Kullanıcın cinsiyeti",
                    choices: [
                        {
                            name: "Erkek",
                            value: "Male"
                        },
                        {
                            name: "Kadın",
                            value: "Female"
                        }
                    ],
                    required: true,
                },
                {
                    type: "STRING",
                    name: "isim",
                    description: "Kullanıcının ismi",
                    required: true,
                }
            ]
        });
    }
    async run(client, interaction, data) {
        const target = interaction.guild.members.cache.get(interaction.options.get("kullanıcı").value);
        if (!target) return interaction.reply({ content: `Kullanıcı bulunamadı. Lütfen etiketleyerek işlem yapmayı deneyin.`, ephemeral: true, fetchReply: true });
        const docs = await client.models.member.findOne({ _id: target.id });
        const ceza = await client.models.penalties.findOne({ userId: target.id });
        /*
        if (docs) {
            if (ceza) return interaction.reply({ content: `Bu kullanıcı ${interaction.guild.members.cache.get(ceza.executor)} tarafından karantinaya atılmış.`, ephemeral: true, fetchReply: true });
            if (data.roles["Male"].concat(data.roles["Female"]).some(r => target.roles.cache.has(r.id))) return interaction.reply({ content: `Kayıtlı olan bir kullanıcıyı tekrar kayıt edemezsin.`, ephemeral: true, fetchReply: true });
            await target.edit({
                roles: data.roles[docs.gender],
                nick: `${pointed} ${docs.name}`
            });
            return;
        }
        */
        const pointed = (client.config.tags.some((t) => target.user.username.includes(t)) || client.config.dis === target.user.discriminator) ? client.config.point.tagged : client.config.point.default;
        await target.roles.add(data.roles[interaction.options.get("cinsiyet").value]);
        await target.roles.remove(data.roles["welcome"]);
        await target.setNickname(`${pointed} ${interaction.options.get("isim").value.split(' ').map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(' ')}`);
        await client.models.member.updateOne({ _id: target.id }, {
            registries: {
                $push: {
                    executor: interaction.user.id,
                    name: interaction.options.get("isim").value.split(' ').map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(' '),
                    age: 146,
                    sex: interaction.options.get("cinsiyet").value,
                    created: new Date()
                }
            }
        });
        const registryvaris = await client.models.member.find({ registries: { $elemMatch: { executor: interaction.user.id } } });
        const total = registryvaris.registries.length || 1;
        const myEmbed = new MessageEmbed().setDescription(`<@${target.user.id}> kişisinin kaydı <@${interaction.user.id}> tarafından gerçekleştirildi.\nBu kişinin kayıt sayısı: \`${total}\``);
        await interaction.reply({
            embeds: [myEmbed],
            ephemeral: false
        });

    }
}
module.exports = SlashKayit;