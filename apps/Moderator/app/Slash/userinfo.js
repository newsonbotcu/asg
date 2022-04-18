const { stripIndents } = require('common-tags/lib');
const { MessageEmbed } = require('discord.js');
const { SlashCommand } = require('../../../../base/utils');

class SlashKayit extends SlashCommand {
    constructor(client) {
        super(client, data = {
            name: "userinfo",
            description: "Kullanıcı bilgilerini görüntüler",
            default_permission: false,
            options: [
                {
                    type: "USER",
                    name: "kullanıcı",
                    description: "Görüntülenecek kullanıcı/id",
                    required: true,
                },
                {
                    type: "STRING",
                    name: "görünüm",
                    description: "mesaj görünürlüğü",
                    choices: [
                        {
                            name: "görünür",
                            value: "on"
                        },
                        {
                            name: "gizli",
                            value: "off"
                        }
                    ],
                    required: false
                }
            ],
            guildId: [guildId]
        }, guild, guildId);
        this.permissions = client.config.staff.slice(5);
    }
    async run(client, interaction, data) {
        const target = interaction.guild.members.cache.get(interaction.options.get("kullanıcı").value);
        if (!target) return interaction.reply({ content: `Kullanıcı bulunamadı. Lütfen etiketleyerek işlem yapmayı deneyin.`, ephemeral: true, fetchReply: true });
        const embed = new MessageEmbed().setDescription(stripIndents`
        ID: \`${target.user.id}\`
        Kullanıcı: <@!${target.user.id}>
        Ayırıcı Rolü: <@&${target.roles.color.id}>
        Sunucuya Katılma Tarihi: <t:${target.joinedTimestamp}:R>
        `).setAuthor({
            iconURL: target.displayAvatarURL(),
            name: `${target.displayName} isimli üyenin bilgileri`
        });
        const reply = await interaction.reply({
            embeds: [embed],
            components: [
                {
                  type: 1,
                  components: [
                    {
                      style: "PRIMARY",
                      custom_id: `userinfo_home`,
                      disabled: false,
                      emoji: {
                        id: null,
                        name: `🏠`
                      },
                      type: 2
                    },
                    {
                      style: "SUCCESS",
                      custom_id: `userinfo_stat`,
                      disabled: false,
                      label: "Stat",
                      type: 2
                    },
                    {
                      style: "DANGER",
                      custom_id: `userinfo_penal`,
                      disabled: false,
                      label: "Sicil",
                      type: 2
                    },
                    {
                      custom_id: `userinfo_menu`,
                      placeholder: `Loglar`,
                      options: [
                        {
                          label: `Kayıt Bilgileri`,
                          description: `En son kayıt ettiği kişiler`,
                          default: false
                        },
                        {
                          label: `Mesaj Logları`,
                          description: `En son silinen/düzenlenen mesajları`,
                          default: false
                        },
                        {
                          label: `Davet Geçmişi`,
                          description: `En son davet ettiği kullanıcılar`,
                          default: false
                        },
                        {
                          label: `Taglı Logları`,
                          description: `En son tag aldırdığı kullanıcılar`,
                          default: false
                        },
                        {
                          label: `Komut Geçmişi`,
                          description: `En son uyguladığı ceza işlemleri`,
                          default: false
                        },
                        {
                          label: `Sağ Tık Geçmişi`,
                          description: `Yetkisini kulladığı son hareket`,
                          default: false
                        },
                        {
                          label: `Ses Logları`,
                          description: `Detaylı ses hareketleri`,
                          default: false
                        }
                      ],
                      min_values: 1,
                      max_values: 1,
                      type: 3
                    }
                  ]
                }
              ]
        });
        const filtered = (intr)=> intr.user.id === interaction.user.id;
        const collector = reply.createMessageComponentCollector({
            filter: filtered,
            idle: 20_000
        });
        collector.on("collect", async (intr) => {
            switch (intr.id) {
                case "userinfo_home":
                    await reply.edit({
                        embeds: [embed]
                    });
                    break;
                case "userinfo_stat":
                    await reply.edit({
                        embeds: [embed]
                    });
                    break;
                case "userinfo_penal":
                    await reply.edit({
                        embeds: [embed]
                    });
                    break;
                case "userinfo_menu":
                    switch (intr.value) {

                    }
                    break;
                default:break;
            }
        })



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
