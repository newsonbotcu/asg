const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const { checkDays, rain } = require('../../../../../HELPERS/functions');
const Data = require('../../../../../MODELS/Datalake/Registered');
const { stripIndent } = require('common-tags');
class Invites extends Command {
    constructor(client) {
        super(client, {
            name: "registries",
            description: "Belirtilen kullanıcının kayıtlarını gösterir",
            usage: "registries etiket/id",
            examples: ["registries 674565119161794560"],
            category: "Stats",
            aliases: ["kayıtlar", "kayıtlarım"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const datam = await Data.find({ executor: mentioned.user.id });
        if (!datam) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));

        
        const embedregistries = new Discord.MessageEmbed().setColor().setColor(mentioned.displayHexColor).setTitle("† Dante's INFEЯИO").setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true }));
        const embed = embedregistries.setDescription(stripIndent`
        • Kullanıcı: **${mentioned.user.username}**
        • Toplam Kayıt sayısı: ${rain(client, datam.length)}
        • Bugünkü kayıt sayısı: ${rain(client, datam.filter(data => checkDays(data.created) <= 1).length)} 
        • Haftalık kayıt sayısı: ${rain(client, datam.filter(data => checkDays(data.created) <= 7).length)} 
        `)

        await message.inlineReply(embed);
    }
}
module.exports = Invites;
