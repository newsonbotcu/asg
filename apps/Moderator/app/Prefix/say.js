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
        await message.reply(stripIndent`
        > <:146_1462:948713818484256808> Toplam üye: \`${message.guild.memberCount}\` (${message.guild.members.cache.filter((mem) => mem.presence && mem.presence.status !== 'offline').size} online)
        > <a:146_raid2:953634074981969961> Booster sayısı: \`${message.guild.members.cache.filter(m => m.roles.cache.has(client.data.roles["booster"])).size}\` (${message.guild.premiumTier.replace("TIER_", "")}. seviye)
        > <:146_asg:967874233810157618> Taglı sayısı: \`${message.guild.members.cache.filter(m => client.config.tags.some(tag => m.user.username.includes(tag)) || client.config.dis === m.user.discriminator).size}\` (${message.guild.members.cache.filter(m => m.roles.cache.has(client.data.roles["cmd-crew"])).size} yetkili)
        > <:146_1463:948715248477675560> Anlık ses: \`${message.guild.members.cache.filter(v => v.voice && v.voice.channel).size}\`
        `);
    }
}

module.exports = Say;