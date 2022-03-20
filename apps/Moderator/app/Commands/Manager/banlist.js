const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');

class RoleInfo extends Command {

    constructor(client) {
        super(client, {
            name: "banlist",
            description: "sunucudaki banlı üyeleri gösterir.",
            usage: "banlist",
            examples: ["banlist"],
            category: "Yetkili",
            aliases: ["banlar"],
            accaptedPerms: ["root", "owner"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        message.guild.fetchBans(true).then(banuser => {
        let Banneduser = banuser.map(x => `${x.user.tag} (\`${x.user.id}\`)`)
            message.inlineReply(`
• Banlı Kullanıcılar.
• Toplam Banlı Kullancı sayısı: \`${banuser.size}\`           
${Banneduser.join("\n")})`, 
{ split: true })
        })
    }
}
module.exports = RoleInfo;