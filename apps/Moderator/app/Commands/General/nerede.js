const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndent } = require('common-tags');
const Entries = require('../../../../../MODELS/StatUses/voice_entires');
const Records = require('../../../../../MODELS/StatUses/VoiceRecords');
class Nerede extends Command {

    constructor(client) {
        super(client, {
            name: "nerede",
            description: "etiketlenen kişinin nerede olduğunu gösterir.",
            usage: "nerede @Tantoony/ID",
            examples: ["nerede @Tantoony/ID"],
            aliases: ["bul", "n", "nerde"],
            category: "Genel",
            cmdChannel: "bot-komut",
            cooldown: 300000
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (!mentioned.voice.channelID) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        /*
        let whereinfo = `• Mikrofonu: ${mentioned.voice.mute ? `Kapalı` : `Açık`} \n• Kulaklığı: ${mentioned.voice.deaf ? `Kapalı` : `Açık`}`
        let wherechannel = `${mentioned.voice.channel} (\`${mentioned.voice.channel.members.size}/${mentioned.voice.channel.userLimit}\`)`;
        
        const embed = new Discord.MessageEmbed().setColor(mentioned.displayHexColor).setTimestamp().setFooter(`• Tantoony sizi seviyor 🌟`).setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }));
        const neredembed = embed.setDescription(`
        ${mentioned} kişisi ${wherechannel} kanalında.
         ** • Ses Biglileri:**
        \`\`\`${whereinfo}\`\`\`
        **• Kanala gitmek için ${mentioned.voice.channel} kanalına tıklaya bilirsin.**`)
        await message.inlineReply(neredembed).then(msg => msg.delete({ timeout: 10000 }));
        */
        function msToTime(duration) {
            var milliseconds = Math.floor((duration % 1000) / 100),
                seconds = Math.floor((duration / 1000) % 60),
                minutes = Math.floor((duration / (1000 * 60)) % 60),
                hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
            /*
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;sasasasalim
            */
            return `${hours ? hours + " Saat, " : ""} ${minutes ? minutes + " Dakika, " : ""} ${seconds ? seconds + " Saniye" : ""}`;
        }
        const birim = [
            "Saat",
            "Dakika",
            "Saniye"
        ];
        // değişiklik
        const embed = new Discord.MessageEmbed().setColor("#000000");
        const entry = await Entries.findOne({ _id: mentioned.id });
        const record = await Records.findOne({ _id: mentioned.id });
        const lastRecords = record.records.sort((a, b) => b.enter.getTime() - a.enter.getTime());
        const durRecords = lastRecords.filter(r => r.channelID === mentioned.voice.channel.id);
        let duration = new Date().getTime() - entry.created.getTime();
        let p = 0;
        if (durRecords[1] && (lastRecords[0].channelID === mentioned.voice.channel.id) && (new Date().getTime() - duration > durRecords[0].exit.getTime())) durRecords.forEach((r, i) => {
            if (p < i) return;
            if (r.enter.getTime() - durRecords[i + 1].exit.getTime() > 500) return;
            duration = duration + r.duration;
            p = p + 1;
        });
        let sorgu;
        if (!entry) sorgu = `${mentioned}, ${mentioned.voice.channel} kanalında. \n \` • \` Mikrofon **:** ${mentioned.voice.mute ? `${emojis.get("offmic").value()}` : `${emojis.get("onmic").value()}`} \n \` • \` Kulaklık **:** ${mentioned.voice.deaf ? `:mute:` : `:loud_sound:`}`
        if (entry) sorgu = `${mentioned} kullanıcısı **${msToTime(new Date(duration))}** öncesinden beridir ${mentioned.voice.channel} kanalında. \n \` • \` Mikrofon **:** ${mentioned.voice.mute ? `${emojis.get("offmic").value()}` : `${emojis.get("onmic").value()}`} \n \` • \` Kulaklık **:** ${mentioned.voice.deaf ? `:mute:` : `:loud_sound:`}`
        let kembed = embed.setDescription(sorgu)
        message.inlineReply({ embed: kembed, allowedMentions: { repliedUser: false } });
    }
}

module.exports = Nerede;