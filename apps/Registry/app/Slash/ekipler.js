const { ApplicationCommand, MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');
const gangs = require('../../../../../MODELS/Datalake/gang');
const IDS = require('../../../../../BASE/personels.json');

module.exports = class AFKCommand extends ApplicationCommand {
    constructor(client, data, guild, guildId) {
        super(client, data = {
            name: 'ekipler',
            description: 'Sunucunun ekip bilgilerini verir',
            defaultPermission: false,
            guildId: [guildId],
            permissions: [
                "booster"
            ]
        }, guild, guildId);
        this.filePath = __filename;
    }

    async run(ctx) {
        const client = ctx.creator.client;
        const guild = client.guilds.cache.get(ctx.guildID);
        const ekipler = await gangs.find();
        const ekipDatas = ekipler.map(ekip => stripIndent`
        İsim: **${ekip._id} #${ekip.discriminator}** [${guild.roles.cache.get(ekip.roleID)}]
        • Toplam Üye: ${guild.roles.cache.get(ekip.roleID).members.size} (${guild.roles.cache.get(ekip.roleID).members.array().filter(m => m.user.presence.status !== 'offline').length} Aktif)
        • Tagdaki Üye: ${guild.roles.cache.get(ekip.roleID).members.array().filter(m => m.user.username.includes(client.config.tag)).length}
        • Sesteki Üye: ${guild.voiceStates.cache.filter(state => state.channel && state.member.roles.cache.has(ekip.roleID)).size}
        `).join("\n●▬▬▬▬▬▬▬●\n");
        const embed = new MessageEmbed().setDescription(ekipDatas).setTitle(guild.name).setThumbnail(guild.iconURL()).setColor('#7bf3e3');
        await ctx.send({
            embeds: [embed]
        }).then(msg => {
            setTimeout(async () => {
                await msg.delete();
            }, 10000);
        });

    }
}