const { MessageEmbed } = require('discord.js');
const { SlashCommand } = require('../../../../base/utils');

class SlashKayit extends SlashCommand {
    constructor(client) {
        super(client, data = {
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
                },
                {
                    type: "NUMBER",
                    name: "yaş",
                    description: "Kullanıcının Yaşı",
                    required: true,
                }
            ],
            guildId: [guildId]
        }, guild, guildId);
        this.permissions = client.config.staff.slice(5);
    }
    async run(client, interaction, data) {
        const target = interaction.guild.members.cache.get(interaction.options.get("kullanıcı").value);
        if (!target) return interaction.reply({ content: `Kullanıcı bulunamadı. Lütfen etiketleyerek işlem yapmayı deneyin.`, ephemeral: true, fetchReply: true });
        const docs = await client.models.registry.findOne({ user: target.id });
        const ceza = await client.models.penal.findOne({ userId: target.id });
        const pointed = client.config.tags.some(t => target.user.username.includes(t)) ? client.config.tag[0] : client.config.extag;
        if (docs) {
            if (ceza) return interaction.reply({ content: `Bu kullanıcı ${interaction.guild.members.cache.get(ceza.executor)} tarafından karantinaya atılmış.`, ephemeral: true, fetchReply: true });
            if (data.roles["Male"].concat(data.roles["Female"]).some(r => target.roles.cache.has(r.id))) return interaction.reply({ content: `Kayıtlı olan bir kullanıcıyı tekrar kayıt edemezsin.`, ephemeral: true, fetchReply: true });
            await target.edit({
                roles: data.roles[docs.gender],
                nick: `${pointed} ${docs.name} | ${docs.age}`
            });
            return;
        }
        await target.roles.add(data.roles[interaction.options.get("cinsiyet").value]);
        await target.roles.remove(data.roles["welcome"]);
        await target.setNickname(`${pointed} ${interaction.options.get("isim").value.split(' ').map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(' ')} | ${interaction.options.get("yaş").value}`);
        await client.models.members.create({
            _id: target.id,
            executor: interaction.user.id,
            name: interaction.options.get("isim").value.split(' ').map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(' '),
            age: interaction.options.get("yaş").value,
            sex: interaction.options.get("cinsiyet").value,
            created: new Date()
        });
        const registryvaris = await client.models.members.find({ executor: interaction.user.id });
        const total = registryvaris.length || 1;
        const myEmbed = new MessageEmbed().setDescription(`${target} kişisinin kaydı <@${interaction.user.id}> tarafından gerçekleştirildi.\nBu kişinin kayıt sayısı: \`${total}\``);
        await interaction.reply({
            embeds: [myEmbed]
        });

    }
}
module.exports = SlashKayit;