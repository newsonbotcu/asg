const { DotCommand } = require("../../../../base/utils");
class Ysay extends DotCommand {

    constructor(client) {
        super(client, {
            name: "ysay",
            description: "Seste olmayan etiketler",
            usage: "ysay @etiket/id",
            examples: ["ysay 674565119161794560"],
            category: "Düzen",
            aliases: ["üyeler"],
            accaptedPerms: ["yt"],
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        let rol = message.guild.roles.cache.get(args[0]);
        if (!rol) return await message.reply(`Böyle bir rol bulunmamaktadır.`);
        const members = rol.members.map(m => `<@${m.id}>`);
        await message.reply(`\`\`\`${rol.name} Rolüne Sahip Olan ${members.length} Kişi Bulunmaktadır \`\`\``);
        for (let index = 0; index < Math.floor(members.length / 40) + 1; index++) {
            await message.reply(`BÖLÜM ${index + 1}:` + `${members.slice(index * 40, (index + 1) * 40).join(', ')}`);
        }

    }
}

module.exports = Ysay;