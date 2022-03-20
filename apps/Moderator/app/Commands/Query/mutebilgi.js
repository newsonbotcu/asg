const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');
const VMS = require('../../../../../MODELS/Moderation/VoiceMuted');
const CMS = require('../../../../../MODELS/Moderation/ChatMuted');
const { stripIndent } = require('common-tags');
class MuteSorgu extends Command {
    constructor(client) {
        super(client, {
            name: "mutebilgi",
            description: "Belirtilen kullanıcının mutesini sorgular",
            usage: "mutebilgi etiket/id",
            examples: ["mutebilgi 674565119161794560"],
            category: "Sorgu",
            aliases: ["mbilgi"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "cmd-mute"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const emojis = await low(client.adapters('emojis'));
        let mentionedID = message.mentions.members.first() ? message.mentions.members.first().user.id : args[0];
        if (!mentionedID) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        const vmData = await VMS.findOne({ _id: mentionedID });
        const cmData = await CMS.findOne({ _id: mentionedID });
        if (!vmData && !cmData) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        const embed = new Discord.MessageEmbed().setTitle("Mute Bilgisi").setDescription(stripIndent`
        ${emojis.get("user").value()} **Kullanıcı:** ${message.guild.members.cache.get(mentionedID) || `Sunucuda değil (${mentionedID})`}
        ${emojis.get("reason").value()} **Mute sebebi:** ${vmData && cmData ? stripIndent`
        V-Mute: \`${vmData ? vmData.reason : 'yok'}\`
        C-Mute: \`${cmData ? cmData.reason : 'yok'}\`
        ` : ((cmData || vmData).reason)}
        ${emojis.get("id").value()} **Kullanıcı ID'si:** ${mentionedID}
        \`Komutu Kullanan:\` ${vmData && cmData ? stripIndent`
        V-Mute: ${message.guild.members.cache.get(vmData) || `Sunucuda Değil (${vmData.executor})`}
        C-Mute: ${message.guild.members.cache.get(cmData.executor) || `Sunucuda Değil (${cmData.executor})`}
        ` : (message.guild.members.cache.get((cmData || vmData).executor) ? message.guild.members.cache.get((cmData || vmData).executor) : `Sunucuda değil (${cmData.executor || vmData.executor})`)}
        \`Mute türü:\` ${cmData && vmData ? "FULL MUTE" : (cmData ? "CHAT MUTE" : "VOICE MUTE")}
        \`Süresi:\` ${cmData && vmData ? stripIndent`
        V-Mute: ${vmData.duration || 'yok'}
        C-Mute: ${cmData.duration || 'yok'}
        `: (vmData || cmData).duration}
        `).setColor('#2f3136').setFooter("İnferno Forever <3");
        await message.inlineReply(embed);
    }
}
module.exports = MuteSorgu;