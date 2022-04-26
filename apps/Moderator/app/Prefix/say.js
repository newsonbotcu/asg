const Discord = require('discord.js');
const { DotCommand } = require("../../../../base/utils");
const { stripIndent } = require('common-tags');
class Say extends DotCommand {

    constructor(client) {
        super(client, {
            name: "say",
            description: "Sunucunun anlık bilgisini verir.",
            usage: "say",
            examples: ["say"],
            category: "Genel",
            accaptedPerms: ["cmd-registry", "cmd-double", "cmd-single", "cmd-ceo"],
            cooldown: 10000,
            enabled: true
        });
    }

    async run(client, message, args) {
        await message.reply(new Discord.MessageEmbed().setDescription(stripIndent`
        \`•\` Toplam üye: \`${message.guild.memberCount}\` (${message.guild.members.cache.filter(m => m.presence.status !== 'offline').size} online)
        \`•\` Booster sayısı: \`${message.guild.members.cache.filter(m => m.roles.cache.has(data.roles["booster"])).size}\` (${message.guild.premiumTier}. seviye)
        \`•\` Taglı sayısı: \`${message.guild.members.cache.filter(m => client.config.tags[0].some(tag => m.user.username.includes(tag))).size}\` (${message.guild.members.cache.filter(m => m.roles.cache.has(data.roles["cmd-crew"])).size} yetkili)
        \`•\` Anlık ses: \`${message.guild.voiceStates.cache.filter(v => v.channel).size}\`
        `).setColor('#7bf3e3'));
    }
}

module.exports = Say;