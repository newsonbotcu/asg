const { stripIndents } = require('common-tags');
const { ClientEvent } = require("../../../base/utils");
const moment = require('moment');
class GuildMemberAdd extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "guildMemberAdd"
        });
        this.client = client;
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
                client.handler.emit("ban", member.guild, exeMember, this.client.user.id, "* Bot Ekleme", "Perma", 1);
            }
            return;
        }
        let inviter;
        console.log(this.client.invites);
        member.guild.invites.fetch().then((gInvites) => {
            let invite = gInvites.find((inv) => inv.uses > this.client.invites.get(inv.code).uses);
            if (invite) {
                inviter = invite.inviter.id
            } else {
                member.guild.fetchVanityData().then((dData) => {
                    this.client.vanityUses = dData.uses;
                    inviter = "VANITY_URL";
                });
            };
            this.client.invites = gInvites;
        });
        const docs = await client.models.invites.find({ inviter: inviter, invited: member.user.id, isFirst: true });
        const first = docs.length > 0;
        await client.models.invites.create({
            inviter: inviter,
            invited: member.user.id,
            created: new Date(),
            isFirst: !first
        });
        const recovery = await client.models.member.find({ _id: member.user.id });
        const tag = (client.config.tags.some(tag => member.user.username.includes(tag)) || client.config.dis === member.user.discriminator) ? client.config.point.tagged : client.config.point.default;
        let penals = await client.models.penalties.find({ userId: member.user.id });
        penals = penals.filter((penal) => penal.until.getTime() > Date.now());
        if (penals.length > 0) {
            console.log(penals);
            for (let index = 0; index < penals.length; index++) {
                const penal = penals[index];
                switch (penal.type) {
                    case "JAIL":
                        if ((penal.reason === "FORBIDDEN") && !this.data.other["forbidden"].some(tag => member.user.username.includes(tag))) {
                            await client.models.penalties.updateOne({ _id: penal._id }, { $set: { until: Date.now() } });
                            let addRole = [];
                            await penal.extras.filter((extra) => extra.subject === "role").map((extra) => extra.data).forEach(async (roleId) => {
                                const rData = await client.models.roles.find({ meta: { $elemMatch: { _id: roleId } } });
                                addRole.push(rData.meta.pop()._id);
                            });
                            if (recovery.length > 0) {
                                const record = recovery.filter((doc) => moment(doc.gone).add("3M").toDate().getTime() < Date.now()).sort((a, b) => a.created.getTime() - b.created.getTime())[0];
                                if (record) await member.edit({
                                    nick: `${tag} ${record.name} | ${record.age}`,
                                    roles: this.data.roles[record.gender].concat(this.data.roles["member"])
                                }, "Önceden Kayıtlıdır");
                                return;
                            }
                        } else {
                            if (recovery.length > 0) {
                                const record = recovery.filter((doc) => moment(doc.gone).add("3M").toDate().getTime() < Date.now()).sort((a, b) => a.created.getTime() - b.created.getTime())[0];
                                if (record) await member.edit({
                                    nick: `${tag} ${record.name} | ${record.age}`,
                                    roles: this.data.roles["prisoner"].concat(this.data.roles["karantina"])
                                }, "Önceden Kayıtlıdır, rol verilmedi.");
                                return;
                            }
                        }
                        break;
                    case "CMUTE":
                        await member.roles.add(this.data.roles["muted"]);
                        break;

                    default:
                        break;
                }
            }
        }
        if (client.config.tags.some(t => member.user.username.includes(t))) await member.roles.add(this.data.roles["taglı"]);
        if (client.func.checkDays(member.user.createdAt) < 7) return await member.roles.add(this.data.roles["suspicious"].concat(this.data.roles["karantina"]));
        if (recovery && recovery.registries && recovery.registries.length > 0 && !this.data.other["taglıAlım"]) {
            const record = recovery.filter((doc) => moment(doc.gone).add("3M").toDate().getTime() < Date.now()).sort((a, b) => a.created.getTime() - b.created.getTime())[0];
            if (record) await member.edit({
                nick: `${tag} ${record.name} | ${record.age}`,
                roles: this.data.roles[record.gender].concat(this.data.roles["member"])
            }, "Önceden Kayıtlıdır");
            return;
        }
        const tutor = member.guild.members.cache.get(inviter);
        const invCnt = await client.models.invites.find({ inviter: inviter, isFirst: true });
        await member.roles.add(this.data.roles["welcome"]);
        await member.guild.channels.cache.get(this.data.channels["welcome"]).send(stripIndents`
        > <a:cekic:957252645968551956> **Hoş Geldin** ${member},
        > buraya gelmeni sağlayan ${tutor || "özel url"} toplamda **${invCnt.length || 1} kişiyi** buraya kazandırdı.
        > Güvenli bölgede anlık olarak **${member.guild.memberCount} üye** barınıyor.
        > Giriş için lütfen **V. Confirmed** isimli kanallardan herhangi birinde yetkili birisinin seninle ilgilenmesini bekle.
        > <a:146_yldrm:948840799343353877> __Hesap <t:${Math.round(member.user.createdTimestamp / 1000)}:R> oluşturulmuş__
       `);
    }
}

module.exports = GuildMemberAdd;
