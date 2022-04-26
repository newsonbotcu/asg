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
        const embed = new Discord.MessageEmbed().setDescription(stripIndent`
        \`•\` Toplam üye: \`${message.guild.memberCount}\` (${message.guild.members.cache.filter((mem) => mem.presence && mem.presence.status !== 'offline').size} online)
        \`•\` Booster sayısı: \`${message.guild.members.cache.filter(m => m.roles.cache.has(client.data.roles["booster"])).size}\` (${message.guild.premiumTier.replace("TIER_", "")}. seviye)
        \`•\` Taglı sayısı: \`${message.guild.members.cache.filter(m => client.config.tags.some(tag => m.user.username.includes(tag)) || client.config.dis === m.user.discriminator).size}\` (${message.guild.members.cache.filter(m => m.roles.cache.has(client.data.roles["cmd-crew"])).size} yetkili)
        \`•\` Anlık ses: \`${message.guild.voiceStates.cache.filter(v => v.channel).size}\`
        `).setColor('#7bf3e3');
        await message.reply({
            embeds: [embed]
        });
    }
}

module.exports = Say;