const { ApplicationCommand, MessageEmbed } = require('discord.js');
const low = require('lowdb');

module.exports = class SlashKayit extends ApplicationCommand {
    constructor(client, data, guild, guildId) {
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
    async run(client, intg) {
        const roles = await low(client.adapters('roles'));
        const target = intg.guild.members.cache.get(intg.options.get("kullanıcı").value);
        if (!target) return intg.reply({ content: `Kullanıcı bulunamadı. Lütfen etiketleyerek işlem yapmayı deneyin.`, ephemeral: true, fetchReply: true });
        const data = await client.models.members.findOne({ _id: target.id });
        const ceza = await client.models.jail.findOne({ _id: target.id });
        const pointed = client.config.tag.some(t => target.user.username.includes(t)) ? client.config.tag[0] : client.config.extag;
        if (data) {
            if (ceza) return intg.reply({ content: `Bu kullanıcı ${intg.guild.members.cache.get(ceza.executor)} tarafından karantinaya atılmış.`, ephemeral: true, fetchReply: true });
            if (roles.get("Male").value().concat(roles.get("Female").value()).some(r => target.roles.cache.has(r.id))) return intg.reply({ content: `Kayıtlı olan bir kullanıcıyı tekrar kayıt edemezsin.`, ephemeral: true, fetchReply: true });
            await target.roles.add(roles.value()[data.sex]);
            await target.roles.remove(roles.get("welcome").value());
            await target.setNickname(`${pointed} ${data.name} | ${data.age}`);
            return;
        }
        await target.roles.add(roles.get(intg.options.get("cinsiyet").value).value());
        await target.roles.remove(roles.get("welcome").value());
        await target.setNickname(`${pointed} ${intg.options.get("isim").value.split(' ').map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(' ')} | ${intg.options.get("yaş").value}`);
        await client.models.members.create({
            _id: target.id,
            executor: intg.user.id,
            name: intg.options.get("isim").value.split(' ').map(s => s[0].toUpperCase() + s.slice(1).toLowerCase()).join(' '),
            age: intg.options.get("yaş").value,
            sex: intg.options.get("cinsiyet").value,
            created: new Date()
        });
        const registryDatas = await client.models.members.find({ executor: intg.user.id });
        const total = registryDatas.length || 1;
        const myEmbed = new MessageEmbed().setDescription(`${target} kişisinin kaydı <@${intg.user.id}> tarafından gerçekleştirildi.\nBu kişinin kayıt sayısı: \`${total}\``);
        await intg.reply({
            embeds: [myEmbed]
        });

    }
}