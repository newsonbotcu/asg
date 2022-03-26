const { MessageEmbed } = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const { rain } = require("../../../../../HELPERS/functions");
class ekipsay extends Command {

    constructor(client) {
        super(client, {
            name: "ekip",
            description: "Ekiptekileri sayar.",
            usage: "ekip",
            examples: ["ekip"],
            category: "Yetkili",
            aliases: ["ekip"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single"],

        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let embed = new MessageEmbed().setColor("#000000").setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setFooter(`Stark 🌹 ❤ † INFEЯИO`, `${message.author.avatarURL({ dynamic: true }) || message.guild.iconURL({ dynamic: true })}`)
        let ekipbir = message.guild.roles.cache.get("870076552610717706")
        let ekipiki = message.guild.roles.cache.get("871446895665491978")

        embed.setDescription(stripIndent`
        __Aşşağıda sunucuda ekiplerin bilgileri verilmiştir. (Bilgiler değişiklik gösterebilir.)__
        
        <a:inferno_tac1:871751562043736064> • **Toplam ekip sayısı:** \`2 Ekip\`
        <:stark_toplamuye:871770253431037992> **Toplam ekip üyesi:** \`${ekipbir.members.size + ekipiki.members.size} kişi\`
        <:inferno_cervimici:866719561944662016> **Toplam ekip çevrimiçi üye:** \`${ekipbir.members.filter(a => a.presence.status !== 'offline').size + ekipiki.members.filter(a => a.presence.status !== 'offline').size} kişi\`
        <:inferno_cevrimdisi:866719610303414292> **Toplam ekip Çevrimdışı üye:** \`${ekipbir.members.filter(a => a.presence.status !== 'offline').size + ekipiki.members.filter(a => a.presence.status == 'offline').size} kişi\`
        <:stark_sestekiler:871770248825696296> **Toplam ekip sesteki üye:** \`${ekipbir.members.filter(a => a.voice.channel).size + ekipiki.members.filter(a => a.voice.channel).size} kişi\`
        <:stark_sesteyok:871771305408626739> **Toplam ekip seste olmayan üye:** \`${ekipbir.members.filter(a => a.presence.status !== 'offline' && !a.voice.channel).size + ekipiki.members.filter(a => a.presence.status !== 'offline' && !a.voice.channel).size} kişi\`

        ─────────────────────

        <@&870076552610717706> **Ekibinin Bilgileri**;
        
        <a:inferno_supriz:860952232907505714> **Ekip Sahibi:** <@!347486448121020423>

        <:stark_toplamuye:871770253431037992> **Toplam üye:** \`${ekipbir.members.size} kişi\`
        <:inferno_cervimici:866719561944662016> **Çevrimiçi üye:** \`${ekipbir.members.filter(a => a.presence.status !== 'offline').size} kişi\`
        <:inferno_cevrimdisi:866719610303414292> **Çevrimdışı üye:** \`${ekipbir.members.filter(a => a.presence.status == 'offline').size} kişi\`
        <:stark_sestekiler:871770248825696296> **Sesteki üye:** \`${ekipbir.members.filter(a => a.voice.channel).size} kişi\`
        <:stark_sesteyok:871771305408626739> **Seste olmayan üye:** \`${ekipbir.members.filter(a => a.presence.status !== 'offline' && !a.voice.channel).size} kişi\`
         
        ─────────────────────

        <@&871446895665491978> **Ekibinin Bilgileri**;

        <a:inferno_supriz:860952232907505714> **Ekip Sahibi:** <@!760162970793410580>

        <:stark_toplamuye:871770253431037992> **Toplam üye:** \`${ekipiki.members.size} kişi\`
        <:inferno_cervimici:866719561944662016> **Çevrimiçi üye:** \`${ekipiki.members.filter(a => a.presence.status !== 'offline').size} kişi\`
        <:inferno_cevrimdisi:866719610303414292> **Çevrimdışı üye:** \`${ekipiki.members.filter(a => a.presence.status == 'offline').size} kişi\`
        <:stark_sestekiler:871770248825696296> **Sesteki üye:** \`${ekipiki.members.filter(a => a.voice.channel).size} kişi\`
        <:stark_sesteyok:871771305408626739> **Seste olmayan üye:** \`${ekipiki.members.filter(a => a.presence.status !== 'offline' && !a.voice.channel).size} kişi\``)

        message.inlineReply(embed)
    }
}
module.exports = ekipsay;