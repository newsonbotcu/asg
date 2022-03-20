const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
class Permal extends Command {

    constructor(client) {
        super(client, {
            name: "permal",
            description: "Belirtilen kullanıcının yetkisini alçaltır",
            usage: "permal @etiket/id",
            examples: ["permal 674565119161794560"],
            category: "Management",
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double"],
            enabled: false
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.inlineReply(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kullanıcı bulunamadı!`).setColor('BLACK'));
        if (mentioned.id == message.author.id) return message.inlineReply(new Discord.MessageEmbed().setDescription(`${emojis.get("kullaniciyok").value()} Kendi kendine işlem yapamazsın!`).setColor('BLACK'));
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        message.inlineReply(new Discord.MessageEmbed().setColor("BLACK").setDescription(`${emojis.get("kullaniciyok").value()} Belirtilen yetkiliyi yetkiden almak istediğine eminmisin?`)).then(async msj => {
            await msj.react('✅');
            const kabul = (reaction, user) => {
                return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            msj.awaitReactions(kabul, { max: 1, time: 50000, error: ['time'] }).then(async c => {
                let cevap = c.first();
                if (cevap) {
                    if (mentioned.roles.cache.has("854162987619057665")) await mentioned.roles.set(["854162987619057665"]).catch(e => { })
                    if (mentioned.roles.cache.has("854162990534623233")) await mentioned.roles.set(["854162990534623233"]).catch(e => { })
                    if (mentioned.user.username.includes("†")) await mentioned.roles.add("855651068591341588").catch(e => { })
                    await msj.delete().catch(e => { });
                }
            })
        });
    }
}

module.exports = Permal;