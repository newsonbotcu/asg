const low = require("lowdb");
const { checkDays, rain } = require('../../../HELPERS/functions');
const { stripIndents } = require('common-tags');

class GuildMemberAdd {

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
        if (member.user.bot) {
            const entry = await member.guild.fetchAuditLogs({ type: "BOT_ADD" }).then(logs => logs.entries.first());
            if (client.config.owner === entry.executor.id) {
                await member.guild.channels.cache.get(channels.get("guard").value()).send(`${emojis.get("accepted_bot").value()} ${client.owner} Tarafından ${member} botu başarıyla eklendi.`);
                await member.roles.add(roles.get("bots").value());
            } else {
                await member.kick("Korundu");
                const exeMember = member.guild.members.cache.get(entry.executor.id);
                client.extention.emit("Ban", member.guild, exeMember, this.client.user.id, "* Bot Ekleme", "Perma", 1);
            }
            return;
        }
        let davetci = {};
        if (member.guild.vanityURLCode && (utils.get("vanityUses").value() < member.guild.vanityURLUses)) {
            utils.update("vanityUses", n => vanityURLUses).write();
            davetci = {
                username: "ÖZEL URL"
            };
        }
        await member.guild.invites.fetch().then(async gInvites => {
            let invite = gInvites.find(inv => inv.uses > client.invites.get(inv.code).uses) || client.invites.find(i => !gInvites.has(i.code));
            if (invite) {
                davetci = invite.inviter;
                const obj = {
                    user: member.user.id,
                    created: new Date()
                };
                let systeminv = await client.models.invites.findOne({ _id: davetci.id });
                if (!systeminv) await client.models.invites.create({ _id: davetci.id, records: [] });
                systeminv = await client.models.invites.findOne({ _id: davetci.id });
                const dosyam = systeminv.get('records');
                if (!dosyam.some(entry => entry.user === member.user.id)) await client.models.invites.updateOne({ _id: davetci.id }, { $push: { records: obj } });
                count = dosyam.length + 1 || 1;
            }
        });
        client.invites = await member.guild.invites.fetch();
        const mute = await client.models.cmute.findOne({ _id: member.user.id });
        if (mute) await member.roles.add(roles.get("muted").value());
        const registered = await client.models.members.findOne({ _id: member.user.id });
        const pointed = client.config.tag.some(t => member.user.username.includes(t)) ? client.config.tag[0] : client.config.extag;
        if (registered) await member.setNickname(`${pointed} ${registered.name} | ${registered.age}`).catch(e => console.error);
        if (client.config.tag.some(t => member.user.username.includes(t))) await member.roles.add(roles.get("taglı").value());
        
        if (utils.get("forbidden").value().some(tag => member.user.username.includes(tag))) return await member.roles.add([roles.get("forbidden").value(), roles.get("karantina").value()]);
        const pJail = await client.models.jail.findOne({ _id: member.user.id });
        if (pJail) {
            if ((pJail.reason === "YASAKLI TAG") && !utils.get("forbidden").value().some(tag => member.user.username.includes(tag))) {
                await pJails.deleteOne({ _id: member.user.id });
            } else {
                return await member.roles.add([roles.get("prisoner").value(), roles.get("karantina").value()]);
            }
        }
        if (checkDays(member.user.createdAt) < 7) return await member.roles.add([roles.get("suspicious").value(), roles.get("karantina").value()]);
        
        if (registered && !utils.get("taglıAlım").value()) return await member.roles.add(roles.get(registered.sex).value());
        await member.roles.add(roles.get("welcome").value());
        await member.guild.channels.cache.get(channels.get("welcome").value()).send(stripIndents`
        ${emojis.get("hg").value()} Aramıza hoş geldin ${member}, eğer müsaitsen sunucumuza kayıt olmak için ses kanallarından birine girip bir yetkiliye ulaşabilirsin.       
       `);
    }
}

module.exports = GuildMemberAdd;