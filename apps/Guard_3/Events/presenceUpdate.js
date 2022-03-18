const { CliEvent } = require('../../../base/utils');
class presenceUpdate extends CliEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }

    async run(eski, yeni) {
        /*
        client = this.client;
        const durum = Object.keys(yeni.user.presence.clientStatus);
        const status =  Object.keys(yeni.presence.status);
        const nRoles = yeni.user.roles.cache.filter(x => x.editable && x.id != yeni.guild.id && !yeni.user.bot && yeni.guild.id === guilID && ["268435456", "8", "16", "2", "4", "8589934592"].some((a) => x.permissions.has(a)));
        if (yeni.guild.ownerId === yeni.user.id) return;

        if (durum.find(x => x === "web")) {
            await yeni.user.roles.remove(nRoles.map(x => x.id), "Kullanıcı tarayıcıdan giriş yaptığı için bazı yetkileri alındı.");
            await data.findOneAndUpdate({ _id: yeni.user.id }, { $set: { roles: roller.map(x => x.id) } }, { upsert: true })
            client.extention.emit('Logger', 'KDE', yeni.user.id, "presenceUpdate", `Tarayıcıdan giriş yaptığı için yetkileri çekildi. Rol listesi: ${nRoller.map((x) => `<@&${x.id}>`).join("\n")}`);
        }
        if (durum.find(x => x === "mobile" && x === "desktop" && x != "web" && status.find())) {
            await data.findOne({ _id: yeni.user.id });

        }
        */
    }
}
module.exports = presenceUpdate;