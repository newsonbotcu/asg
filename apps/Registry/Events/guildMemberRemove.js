const Discord = require('discord.js');
const low = require('lowdb');
class GuildMemberRemove {
    constructor(client) {
        this.client = client;
    }

    async run(member) {
        const client = this.client;
        if (member.guild.id !== client.config.server) return;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const embed = new Discord.MessageEmbed().setColor('#2f3136');
        const pruneentry = await member.guild.fetchAuditLogs({ type: "MEMBER_PRUNE" }).then(logs => logs.entries.first());
        const model = await client.models.mem_roles.findOne({ _id: cur.user.id });
        if (model) await client.models.mem_roles.delete({ _id: member.user.id });
        if (pruneentry && pruneentry.createdTimestamp >= Date.now() - 10000) {
            const removed = pruneentry.extra.removed;
            const days = pruneentry.extra.days;
            const mesaje = pruneentry.setDescription(`${pruneentry.executor.username} ${days} günde ${removed} kadar aktif olmayan üyeyi sunucudan ${pruneentry.reason ? pruneentry.reason : "bilinmeyen"} sebeple çıkardı.`);
            if (utils.get("root").value().includes(pruneentry.executor.id)) return member.guild.channels.cache.get(channels.get("guard").value()).send(mesaje);
            await member.guild.members.ban(pruneentry.executor.id, { reason: `${days} günde ${removed} kadar aktif olmayan üyeyi sunucudan ${pruneentry.reason ? pruneentry.reason : "bilinmeyen"} sebeple çıkardı.` });
            return;
        }
        const entry = await member.guild.fetchAuditLogs({ type: "MEMBER_KICK" }).then(logs => logs.entries.first());
        if ((entry.target.id === member.user.id) && entry.createdTimestamp >= Date.now() - 1000) {
            const exeMember = member.guild.members.cache.get(entry.executor.id);
            const embedtrue = embed.setDescription(`${emojis.get("kicked").value()} **${member.user.username}** adlı kullanıcı ${exeMember} tarafından kicklendi!`);
            if (member.user.bot && entry.executor.bot) return member.guild.channels.cache.get(channels.get("guard").value()).send(embedtrue);
            if (exeMember.roles.cache.has(roles.get("root").value())) return member.guild.channels.cache.get(channels.get("guard").value()).send(embedtrue);
            if (utils.get("root").value().includes(entry.executor.id)) return member.guild.channels.cache.get(channels.get("guard").value()).send(embedtrue);
            client.extention.emit("Jail", exeMember, this.client.user.id, "KDE - Üye Atma", "Perma", 1);
            await member.guild.channels.cache.get(channels.get("guard").value()).send(embedtrue.setColor("#RED"));
            return;
        }
    }
}
module.exports = GuildMemberRemove;