const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');
const moment = require("moment")
const rol_log = require("../../../../../MODELS/Moderation/Rollog.js")
class CountByRole extends Command {

    constructor(client) {
        super(client, {
            name: "rollog",
            description: "Belirtilen kişinin geçmiş rol dökümünü verir.",
            usage: "rollog @Stark/ID",
            examples: ["rollog 853011311328100411"],
        //    cooldown: 3600000,
            category: "Yetkili",
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single"],
        });
    }

    async run(client, message, args) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        const mentioned = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member
        if(!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        let rolelogs = await rol_log.findOne({_id: mentioned.id}).exec();

        if(!rolelogs || rolelogs.length) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
    //    staffID: rolveren.executor.id, tarih: new Date.now(), rolid: role.id, type: aldiverdi
        const liste = rolelogs.rolveridb.map(a => `${client.emojis.cache.get(a.type)} Rol: <@&${a.rolid}> Yetkili: <@!${a.staffID}> \n**Tarih:** \`${moment(a.tarih).format("lll")}\` \n**─────────────────**`).reverse();
        let page = 1;
        const embed = new Discord.MessageEmbed().setAuthor(mentioned.displayName, mentioned.user.avatarURL({ dynamic: true })).setColor("RANDOM");
        const question = await message.inlineReply(
            embed.setDescription(`${mentioned} kişisinin toplamda **${liste.length}** rol bilgisi bulunmakta son 10 rolün bilgileri aşağıda belirtilmiştir. \n\n${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n")}`)
        );

        if (rolelogs && rolelogs.rolveridb.length > 10) {
             question.react("◀").catch(() => {})
             question.react("❌").catch(() => {})
             question.react("▶").catch(() => {})

            const collector = question.createReactionCollector(
                (react, user) => ["◀", "❌", "▶"].some((e) => e == react.emoji.name) && user.id == message.author.id,
                { time: 120000 }
            );

            collector.on("collect", async (react) => {
                await react.users.remove(message.author.id).catch(() => undefined);
                if (react.emoji.name == "▶") {
                    if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
                    page += 1;
                    let newList = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    question.edit(embed.setDescription(`${mentioned} kişisinin toplamda ${liste.length} rol bilgisi bulunmakta son 10 rolün bilgileri aşağıda belirtilmiştir. \n\n${newList}`));
                }
                if(react.emoji.name == "❌") {
                    question.delete()
                }
                if (react.emoji.name == "◀") {
                    if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
                    page -= 1;
                    let newList = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
                    question.edit(embed.setDescription(`${mentioned} kişisinin toplamda ${liste.length} rol bilgisi bulunmakta son 10 rolün bilgileri aşağıda belirtilmiştir. \n\n${newList}`));
                }
            });
        }

    }

}

module.exports = CountByRole;