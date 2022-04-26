const Command = require('../../../Base/Command');
const Discord = require('discord.js');
const low = require('lowdb');
const nameData = require('../../../../../MODELS/Datalake/Registered');
const { sayi } = require('../../../../../HELPERS/functions');
const { stripIndents } = require('common-tags');
class Erkek extends Command {
    constructor(client) {

        super(client, {
            name: "erkek",
            description: "Kayıtsız bir üyeyi erkek olarak kayıt eder",
            usage: "erkek @fero/ID İsim Yaş",
            examples: ["erkek @fero/ID İsim Yaş"],
            category: "Kayıt",
            aliases: ["e", "man"],
            cmdChannel: "exe-registry",
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "cmd-registry"],
            cooldown: 1000
        });
    };
    async run(client, message, args) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return await message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        if (!mentioned.roles.cache.has(data.roles["welcome"]) && (mentioned.roles.cache.size > 1)) return await message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        /*     if (data.other["taglıAlım"] && !mentioned.user.username.includes(client.config.tag)) {
                 if (!mentioned.roles.cache.has(data.roles["vip"]) && !mentioned.roles.cache.has(data.roles["booster"])) {
                     return message.reply(new Discord.MessageEmbed()
                         .setColor("#2f3136")
                         .setDescription(`Üzgünüm, ama henüz taglı alımdayız. ${mentioned} kullanıcısında vip veya booster rolü olmadığı koşulda onu içeri alamam..`)
                     );
                 }
             }*/
        if (mentioned.displayName.includes('|')) args = [mentioned.id].concat(mentioned.displayName.slice(2).replace('| ', '').split(' '));
        let rawName = args.slice(1);
        if (args.length < 3) return await message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        let age = Number(args[args.length - 1]);
        if (!age) return await message.react(data.emojis["error"].split(':')[2].replace('>', ''));
        let nameAge = rawName.map(i => i[0].toUpperCase() + i.slice(1).toLowerCase());
        nameAge = nameAge.join(' ').replace(` ${age}`, '');
        let point = '•';
        if (client.config.tags[0].some(tag => mentioned.user.username.includes(tag))) {
            point = client.config.tag[0];
        }
        await mentioned.setNickname(`${point} ${nameAge} | ${age}`);
        await mentioned.roles.add(data.roles["Male"].concat(data.roles["member"]));
        await mentioned.roles.remove(data.roles["welcome"]);
        if (client.config.tags[0].some(tag => mentioned.user.username.includes(tag))) {
            await mentioned.roles.add(data.roles["crew"]);
        }
        const registry = await nameData.findOne({ _id: mentioned.user.id });
        if (!registry) {
            const data = new nameData({
                _id: mentioned.user.id,
                executor: message.member.user.id,
                created: new Date(),
                name: nameAge,
                age: age,
                sex: "Male"
            });
            await data.save();
        }
        let aNumber = 0;
        const registryDatas = await nameData.find({ executor: message.member.user.id });
        if (registryDatas) aNumber = registryDatas.length;
        await message.react(data.emojis["ok"].split(':')[2].replace('>', ''));
        await message.reply(new Discord.MessageEmbed().setDescription(`${mentioned} adlı kullanıcı başarıyla kayıt oldu.`)).setColor("#7fc2ff");
        
        const aylar = [
            "Ocak",
            "Şubat",
            "Mart",
            "Nisan",
            "Mayıs",
            "Haziran",
            "Temmuz",
            "Ağustos",
            "Eylül",
            "Ekim",
            "Kasım",
            "Aralık"
        ];
        const tarih = new Date()
        await message.guild.channels.cache.get(data.channels["kayıt_log"]).send(new Discord.MessageEmbed().setDescription(stripIndents`
        **Kayıt eden:** ${message.member} (\`${message.member.user.id}\`)
        **Kayıt Edilen:** ${mentioned} (\`${mentioned.user.id}\`)
        **İsim/Yaş:** \`${nameAge} | ${age}\`
        **Cinsiyet:** \`Erkek\`
        **Tag:** ${client.config.tags[0].some(t => mentioned.user.username.includes(t)) ? "\`Var\`" : "\`Yok\`"}
        **Tarih:** \`${tarih.getDate()} ${aylar[tarih.getMonth()]} ${tarih.getFullYear()} ${tarih.getHours() + 3}:${tarih.getMinutes()}\`
        `).setColor("#7fc2ff").setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true })).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })));
    }
}
module.exports = Erkek;