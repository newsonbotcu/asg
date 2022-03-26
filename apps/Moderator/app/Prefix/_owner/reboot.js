const Command = require('../../../Base/Command');
const low = require('lowdb');
class Reboot extends Command {
    constructor(client) {
        super(client, {
            name: "reboot",
            description: "Açıklama Belirtilmemiş",
            usage: "reboot",
            examples: ["reboot"],
            category: "OWNER",
            aliases: ["crush", "rb"],
            accaptedPerms: [],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: true,
            onTest: false,
            rootOnly: false,
            dmCmd: false
        });
    }
    async run(client, message, args, data) {
        await message.inlineReply(`\`Hazırlanıyor...\``);
        (await low(this.client.adapters('utils'))).set("lastCrush", message.channel.id).write();
        process.exit();
    }
}
module.exports = Reboot;