const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Staffver extends Command {
    constructor(client) {
        super(client, {
            name: "staff",
            description: "Belirtilen roldeki üyeleri gösterir.",
            usage: "staff @fero/ID",
            examples: ["rolver @fero/ID"],
            category: "Yetkili",
            aliases: ["permver", "yetkiver"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single"],
            cooldown: 10000,
            enabled: false
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!mentioned) return await message.reply(new Discord.MessageEmbed().setColor("BLACK").setDescription(`Kullanıcı bulunamadı :(`)).then(msg => msg.delete({ timeout: 10000 }));

        const yetenekembed = new Discord.MessageEmbed().setColor("BLACK").setTimestamp()
            .setFooter(`• fero sizi seviyor 🌟`).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setTitle("† Dante's INFEЯИO");

        let select = args[1]
        if (!select || (select !== 'register' && select !== 'ability' && select !== 'jail' && select !== 'mute' && select !== 'gang'))
            return message.reply(yetenekembed.setDescription(`
        ───────────────────
        • .permver @fer/ID register (\`Gatekeeper †\`) permini verir.
        • .permver @fero/ID ability (\`Ruby †\`) permini verir.
        • .permver @fero/ID jail (\`Punisher †\`) permini verir.
        • .permver @fero/ID mute (\`Silencer †\`) permini verir.
        • .permver @fero/ID gang (\`Gang †\`) permini verir.
        ───────────────────
        `)).then(msg => msg.delete({ timeout: 10000 }));

        if (select == "register") {
            if (!mentioned.roles.cache.has(data.roles["cmd-registry"])) {
                mentioned.roles.add(data.roles["cmd-registry"])
                const registeremb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Gatekeeper †\` adlı rolü verdim.`)
                return await message.reply(registeremb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if (select == "ability") {
            if (!mentioned.roles.cache.has(data.roles["cmd-ability"])) {
                mentioned.roles.add(data.roles["cmd-ability"])
                const abilityemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Ruby †\` adlı rolü verdim.`)
                return await message.reply(abilityemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if (select == "jail") {
            if (!mentioned.roles.cache.has(data.roles["cmd-jail"])) {
                mentioned.roles.add(data.roles["cmd-jail"])
                const jailemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Punisher †\` adlı rolü verdim.`)
                return await message.reply(jailemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if (select == "mute") {
            if (!mentioned.roles.cache.has(data.roles["cmd-mute"])) {
                mentioned.roles.add(data.roles["cmd-mute"])
                const muteemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Silencer †\` adlı rolü verdim.`)
                return await message.reply(muteemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if (select == "gang") {
            if (!mentioned.roles.cache.has(data.roles["cmd-crew"])) {
                mentioned.roles.add(data.roles["cmd-crew"])
                const gangemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Gang †\` adlı rolü verdim.`)
                return await message.reply(gangemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
    }
}

module.exports = Staffver;