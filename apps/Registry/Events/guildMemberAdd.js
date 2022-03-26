const { stripIndents } = require('common-tags');
const { ClientEvent } = require("../../../base/utils");
const moment = require('moment');
class GuildMemberAdd extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "guildMemberAdd",
            audit: "BOT_ADD"
        });
        this.client = client;
        this.data = this.loadMarks();
    }

    async run(member) {
        const client = this.client;
        if (member.guild.id !== client.config.server) return;
        if (member.user.bot) {
            const entry = await member.guild.fetchAuditLogs({ type: "BOT_ADD" }).then(logs => logs.entries.first());
            if (client.config.owner === entry.executor.id) {
                await member.guild.channels.cache.get(this.data.channels["guard"]).send(`${this.data.emojis["accepted_bot"]} ${client.owner} Tarafından ${member} botu başarıyla eklendi.`);
                await member.roles.add(this.data.roles["bots"]);
            } else {
                await member.kick("Korundu");
                const exeMember = member.guild.members.cache.get(entry.executor.id);
                client.handler.emit("Ban", member.guild, exeMember, this.client.user.id, "* Bot Ekleme", "Perma", 1);
            }
            return;
        }
        let inviter = "VANITY_URL";
        if (member.guild.vanityURLCode && (client.vanityUses < member.guild.vanityURLUses)) {
            client.vanityUses = vanityURLUses;
        }
        await member.guild.invites.fetch().then(async (gInvites) => {
            let invite = gInvites.find(inv => inv.uses > client.invites.get(inv.code).uses) || client.invites.find(i => !gInvites.has(i.code));
            if (invite) inviter = invite.inviter.id;
        });
        const docs = await client.models.invites.find({ inviter: inviter, invited: member.user.id, isFirst: true });
        const first = docs.length > 0;
        await client.models.inv.create({
            inviter: inviter,
            invited: member.user.id,
            created: new Date(),
            isFirst: !first
        });
        client.invites = await member.guild.invites.fetch();
        const penals = await client.models.penal.find({ userId: member.user.id });
        penals = penals.filter((penal) => penal.until.getTime() > Date.now());
        for (let index = 0; index < penals.length; index++) {
            const penal = penals[index];
            switch (penal.type) {
                case "JAIL":
                    if ((penal.reason === "FORBIDDEN") && !this.data.other["forbidden"].some(tag => member.user.username.includes(tag))) {
                        await client.models.penal.updateOne({ _id: penal._id }, { until: Date.now() });
                        let addRole = [];
                        await penal.extras.filter((extra) => extra.subject === "role").map((extra) => extra.data).forEach(async (roleId) => {
                            const rData = await client.models.roles.find({ aliases: roleId });
                            addRole.push(rData.roleId);
                        });
                        const recovery = await client.models.registry.find({ user: member.user.id });
                        if (recovery.length > 0) {
                            const record = recovery.filter((doc) => moment(doc.gone).add("3M").toDate().getTime() < Date.now()).sort((a, b) => a.created.getTime() - b.created.getTime())[0];

                        }
                    } else {
                        return await member.roles.add(this.data.mash(this.data.roles["prisoner"], this.data.roles["karantina"]));
                    }

                    break;

                default:
                    break;
            }

        }
        if (mute) await member.roles.add(this.data.roles["muted"]);
        const registered = await client.models.members.findOne({ _id: member.user.id });
        const pointed = client.config.tag.some(t => member.user.username.includes(t)) ? client.config.tag[0] : client.config.extag;
        if (registered) await member.setNickname(`${pointed} ${registered.name} | ${registered.age}`).catch(e => console.error);
        if (client.config.tag.some(t => member.user.username.includes(t))) await member.roles.add(this.data.roles["taglı"]);

        if (this.data.other["forbidden"].some(tag => member.user.username.includes(tag))) return await member.roles.add([this.data.roles["forbidden"], this.data.roles["karantina"]]);
        const pJail = await client.models.jail.findOne({ _id: member.user.id });
        if (pJail) {
            if ((pJail.reason === "YASAKLI TAG") && !this.data.other["forbidden"].some(tag => member.user.username.includes(tag))) {
                await pJails.deleteOne({ _id: member.user.id });
            } else {
                return await member.roles.add(this.data.mash(this.data.roles["prisoner"], this.data.roles["karantina"]));
            }
        }
        if (client.utils.checkDays(member.user.createdAt) < 7) return await member.roles.add([this.data.roles["suspicious"], this.data.roles["karantina"]]);

        if (registered && !this.data.other["taglıAlım"]) {
            return await member.roles.add(this.data.roles["member"]);
        }
        await member.roles.add(this.data.roles["welcome"]);
        await member.guild.channels.cache.get(this.data.channels["welcome"]).send(stripIndents`
        ${this.data.emojis["hg"]} Aramıza hoş geldin ${member}, eğer müsaitsen sunucumuza kayıt olmak için ses kanallarından birine girip bir yetkiliye ulaşabilirsin.       
       `);
    }
}

module.exports = GuildMemberAdd;