const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const { rain, checkDays } = require('../../../../../HELPERS/functions');
const vericik = require('../../../../../MODELS/Datalake/Registered');
const moment = require("moment")
moment.locale('tr');

class Anonim extends Command {

    constructor(client) {
        super(client, {
            name: "profil",
            description: "Kişinin kullanıcı bilgilerini gösterir",
            usage: "profil @etiket/id",
            examples: ["profil 674565119161794560"],
            category: "Genel",
            aliases: ["info", "bilgi", "i"],
            cooldown: 300000
        });
    }

    async run(client, message, args) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const embed = new Discord.MessageEmbed().setColor('#2f3136');

        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));

        let TestVoice = mentioned.voice.channel ? `${mentioned.voice.channel} kanalında.` : "**Herhangi bir ses kanalında değil.**";

        let profstatus = mentioned.presence.status
            .replace('online', 'Çevrim İçi <:inferno_cervimici:883792952156102666>')
            .replace('idle', 'Boşta <:inferno_bosta:883792952042872952>')
            .replace('dnd', 'Rahatsız Etmeyin <:inferno_rahatsizetmeyin:883792951807991820>')
            .replace('offline', 'Çevrim Dışı <:inferno_cevrimdisi:883792952202231868>');

        const profildata = await vericik.findOne({ _id: mentioned.user.id });

        const embedd = new Discord.MessageEmbed().setDescription(stripIndent`
        **❯ Kullanıcı bilgisi:**
         ${TestVoice}
         ID: \`${mentioned.id}\`
         Profil: ${mentioned}
         Durum: ${profstatus}
         Oluşturma Tarihi: \`${moment(mentioned.user.createdAt).format("LLL")}\`
         (\`${checkDays(mentioned.user.createdAt)} Gün Önce\`)

         **❯ Üyelik Bilgisi**
         Sunucu takma adı: \`${mentioned.displayName}\`
         Sunucuya Katılma Tarihi: \`${moment(mentioned.joinedAt).format("LLL")}\`
         (\`${checkDays(mentioned.joinedAt)} Gün Önce\`)
         Ayırıcı Rolü: ${mentioned.roles.cache.array().filter(r => r.hoist).sort((a, b) => b.rawPosition - a.rawPosition)[0] || "Yok"}

         **❯ Kayıt Bilgisi**
         Kayıt eden kullanıcı: ${profildata ? message.guild.members.cache.get(profildata.executor) : "Bulunamadı"}
         Kayıt olma tarihi: ${profildata ? checkDays(profildata.created) + " gün önce" : "Bilinmiyor"}
         Kayıt olma bilgileri: ${profildata ? `${profildata.name} ${profildata.age} - ${profildata.sex}` : "Bulunamadı"}
        `).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.roles.cache.array().filter(r => r.hoist).sort((a, b) => b.rawPosition - a.rawPosition)[0] ? mentioned.roles.cache.array().filter(r => r.hoist).sort((a, b) => b.rawPosition - a.rawPosition)[0].hexColor : "#ffffff").setTitle("† Dante's INFEЯИO");
        await message.inlineReply(embedd);
    }
}

module.exports = Anonim;