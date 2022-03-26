const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const yagmur = require("../../../../../BASE/stark.json")
class Upgrade extends Command {

    constructor(client) {
        super(client, {
            name: "alçalt",
            description: "Belirtilen kullanıcının yetkisini alçaltır",
            usage: "alçalt @etiket/id",
            examples: ["alçalt 674565119161794560"],
            category: "Management",
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "yetkilialım"],
        });
    }

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        const embed = new Discord.MessageEmbed().setColor('#2f3136');
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if(!mentioned.user.username.includes("†")) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));

        const taglırol = message.guild.roles.cache.get(roles.get("starter").value());

        let yetkiNumber;
        let sahipOlunanRol = Number();
        for (yetkiNumber = 0; yetkiNumber < yagmur.Yetkiler.length; yetkiNumber++) {
            if (mentioned.roles.cache.has(yagmur.Yetkiler[yetkiNumber])) {
                sahipOlunanRol += yetkiNumber
            };
        }
        if (!mentioned.roles.cache.has(yagmur.Yetkiler[0])) {
            await mentioned.roles.add(yagmur.Yetkiler[sahipOlunanRol - 1]).catch(e => { })
            await mentioned.roles.remove(yagmur.Yetkiler[sahipOlunanRol]).catch(e => { })
            await message.inlineReply(embed.setDescription(`${mentioned} Kullanısı <@&${yagmur.Yetkiler[sahipOlunanRol - 1]}> Yetkisine Başarılı bir Şekilde Düşürüldü.`)).catch(e => { })
        } else {
            message.inlineReply(embed.setDescription(`:x: Belirtilen yetkili zaten en alt yetkide. Yetkisini almak istermisiniz? ?`)).then(async msj => {
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


        //await message.guild.channels.cache.get(kanallar.get("cmd-yetki").value()).send(embedsex);
        //this.client.cmdCooldown[message.author.id][this.help.name] = Date.now() + this.info.cooldown;

    }
}

module.exports = Upgrade;