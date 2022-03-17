const { MessageEmbed, ApplicationCommand } = require('discord.js');
const low = require('lowdb');
module.exports = class Kayitsil extends ApplicationCommand {
    constructor(client, data) {
        super(client, data = {
            name: "kayıtsil",
            type: "USER",
            default_permission: false
        });
        this.permissions = client.config.staff.slice(1).map(o => {
            return {
                id: o,
                type: "ROLE",
                permission: true
            }
        });
    }
    async run(client, intg) {
        const roles = await low(client.adapters("roles"));
        const target = intg.guild.members.cache.get(intg.targetId);
        if (!target) return intg.reply({ content: `Kullanıcı bulunamadı. Lütfen etiketleyerek işlem yapmayı deneyin.`, ephemeral: true, fetchReply: true });

        if (intg.member.roles.highest.rawPosition <= target.roles.highest.rawPosition) return await intg.reply(`${emojis.get("missingPerms").value()} Bunu yapmak için yeterli yetkiye sahip değilsin`, {
            ephemeral: true
        });
        if (!target.bannable) return await intg.reply(`Bu kişiyi banlamak için yeterli yetkiye sahip değilim`, {
            ephemeral: true
        });
        await target.roles.remove(target.roles.cache.map(m => m.id).filter(m => m !== roles.get("booster").value()));
        await target.roles.add(roles.get("welcome").value());
        await client.models.members.deleteOne({ _id: target.id });
        const myEmbed = new MessageEmbed().setDescription(`${target} kişisinin kaydı <@${intg.user.id}> tarafından silindi`);
        await intg.reply({
            embeds: [myEmbed]
        });

    }
}