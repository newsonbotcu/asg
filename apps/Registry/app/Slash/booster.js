const low = require('lowdb');
const { MessageEmbed, ApplicationCommand } = require('discord.js');
module.exports = class AFKCommand extends ApplicationCommand {
    constructor(client, data, guild, guildId) {
        super(client, data = {
            name: 'booster',
            description: 'Boosterların isim değiştirme komutu.',
            options: [
                {
                    type: "STRING",
                    name: 'isim',
                    description: 'İsmin ne olsun?',
                    required: true,
                }
            ],
            defaultPermission: false,
            guildId: [guildId],
            permissions =[{
                id: "booster",
                type: "ROLE",
                permission: true
            }],
        }, guild, guildId);
        this.filePath = __filename;
    }

    async run(ctx) {
        const client = ctx.creator.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const channels = await low(client.adapters('channels'));
        const emojis = await low(client.adapters('emojis'));
        const mentioned = client.guilds.cache.get(ctx.guildID).members.cache.get(ctx.user.id);
        const pointed = client.config.tag.some(t => ctx.user.username.includes(t)) ? client.config.tag[0] : client.config.extag;
        if (client.config.tag.some(tag => mentioned.user.username.includes(tag))) await mentioned.roles.add(roles.get("crew").value());
        await mentioned.setNickname(`${pointed} ${ctx.options["isim"]}`);
        const embed = new MessageEmbed().setColor('#2f3136').setDescription(`${emojis.get("pando1").value()} Başarıyla Ayarlandı!`);
        await ctx.send({
            embeds: [embed]
        });
    }
}
