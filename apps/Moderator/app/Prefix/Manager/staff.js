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
        if (!mentioned) return await message.inlineReply(new Discord.MessageEmbed().setColor("BLACK").setDescription(`Kullanıcı bulunamadı :(`)).then(msg => msg.delete({ timeout: 10000 }));

        const yetenekembed = new Discord.MessageEmbed().setColor("BLACK").setTimestamp()
            .setFooter(`• fero sizi seviyor 🌟`).setThumbnail(mentioned.user.displayAvatarURL({ dynamic: true })).setColor(mentioned.displayHexColor).setTitle("† Dante's INFEЯИO");

        let select = args[1]
        if (!select || (select !== 'register' && select !== 'ability' && select !== 'jail' && select !== 'mute' && select !== 'gang'))
            return message.inlineReply(yetenekembed.setDescription(`
        ───────────────────
        • .permver @fer/ID register (\`Gatekeeper †\`) permini verir.
        • .permver @fero/ID ability (\`Ruby †\`) permini verir.
        • .permver @fero/ID jail (\`Punisher †\`) permini verir.
        • .permver @fero/ID mute (\`Silencer †\`) permini verir.
        • .permver @fero/ID gang (\`Gang †\`) permini verir.
        ───────────────────
        `)).then(msg => msg.delete({ timeout: 10000 }));

        if (select == "register") {
            if (!mentioned.roles.cache.has(roles.get("cmd-registry").value())) {
                mentioned.roles.add(roles.get("cmd-registry").value())
                const registeremb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Gatekeeper †\` adlı rolü verdim.`)
                return await message.inlineReply(registeremb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if (select == "ability") {
            if (!mentioned.roles.cache.has(roles.get("cmd-ability").value())) {
                mentioned.roles.add(roles.get("cmd-ability").value())
                const abilityemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Ruby †\` adlı rolü verdim.`)
                return await message.inlineReply(abilityemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if (select == "jail") {
            if (!mentioned.roles.cache.has(roles.get("cmd-jail").value())) {
                mentioned.roles.add(roles.get("cmd-jail").value())
                const jailemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Punisher †\` adlı rolü verdim.`)
                return await message.inlineReply(jailemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if (select == "mute") {
            if (!mentioned.roles.cache.has(roles.get("cmd-mute").value())) {
                mentioned.roles.add(roles.get("cmd-mute").value())
                const muteemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Silencer †\` adlı rolü verdim.`)
                return await message.inlineReply(muteemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
        if (select == "gang") {
            if (!mentioned.roles.cache.has(roles.get("cmd-crew").value())) {
                mentioned.roles.add(roles.get("cmd-crew").value())
                const gangemb = new Discord.MessageEmbed().setColor("BLACK").setDescription(`Başarıyla \`Gang †\` adlı rolü verdim.`)
                return await message.inlineReply(gangemb).then(msg => msg.delete({ timeout: 10000 }));
            }
        }
    }
}

module.exports = Staffver;