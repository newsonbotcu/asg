const Command = require('../../../Base/Command');
const Discord = require('discord.js');
const low = require('lowdb');
const { sayi } = require('../../../../../HELPERS/functions');
const nameData = require('../../../../../MODELS/Datalake/Registered');
class Duzelt extends Command {
    constructor(client) {
        super(client, {
            name: "duzelt",
            description: "kayıt sonrasında kişinin adınıi yaşını veya cinsiyetini değiştirmek için kullanılır.",
            usage: "duzelt etiket/id (isim/yaş/cinsiyet) (yeni değer)",
            examples: ["duzelt 674565119161794560 isim tantoony"],
            category: "Kayıt",
            aliases: ["dzlt", "düzelt"],
            accaptedPerms: ["cmd-registry", "cmd-all", "cmd-manager", "cmd-rhode", "cmd-authority", "cmd-staff"],
            cooldown: 10000,
        });
    };
    async run(client, message, args) {
        client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        const data = await nameData.findOne({ _id: mentioned.user.id });
        if (!data) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));

        const adana = args[1]
        if (!adana) {
            if (mentioned.roles.cache.has(roles.get("Male").value())) {
                await mentioned.roles.remove(roles.get("Male").value());
                await mentioned.roles.add(roles.get("Female").value());
            }
            if (mentioned.roles.cache.has(roles.get("Female").value())) {
                await mentioned.roles.remove(roles.get("Female").value());
                await mentioned.roles.add(roles.get("Male").value());
            };
            return;
        }
        if (adana) {
            if (adana && !sayi(adana)) {
                let ampul = adana.charAt(0).toUpperCase() + adana.slice(1).toLowerCase()
                await nameData.updateOne({ _id: mentioned.user.id }, { name: ampul });
                await mentioned.setNickname(mentioned.displayName.replace(mentioned.displayName.slice(2).split(' | ')[0], ampul));
            }
            if (adana && sayi(adana)) {
                let yas = Number(adana)
                await nameData.updateOne({ _id: mentioned.user.id }, { age: yas });
                await mentioned.setNickname(mentioned.displayName.replace(mentioned.displayName.slice(2).split(' | ')[1], yas));
            }
        }








        // if (adana == "isim") {
        //     const rawName = args[2]
        //     let adana = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase()
        //     await nameData.updateOne({ _id: mentioned.user.id }, { name: adana });
        //     await mentioned.setNickname(mentioned.displayName.replace(mentioned.displayName.slice(2).split(' | ')[0], adana));
        // }
        // if (adana == "yaş") {
        //     const yaş = args[2];
        //     const age = Number(yaş);
        //     if (!sayi(yaş)) return message.inlineReply(new Discord.MessageEmbed().setDescription(`Geçerli bir yaş girmelisin!`));
        //     await nameData.updateOne({ _id: mentioned.user.id }, { age: age });
        //     await mentioned.setNickname(mentioned.displayName.replace(mentioned.displayName.slice(2).split(' | ')[1], yaş));
        // }
        // if (adana == "cinsiyet") {
        //     let mersin = args[2]
        //     if (mersin == "e") {
        //         await nameData.updateOne({ _id: mentioned.user.id }, { sex: 'Male' });
        //         await mentioned.roles.remove("854162990534623233");
        //         await mentioned.roles.add("854162987619057665");
        //     } else
        //         if (mersin == "k") {
        //             await nameData.updateOne({ _id: mentioned.user.id }, { sex: 'Female' });
        //             await mentioned.roles.remove("854162987619057665");
        //             await mentioned.roles.add("854162990534623233");

        //         } else return message.inlineReply(`lütfen düzeltme türünü \`isim\`, \`yaş\` veya \`cinsiyet\` olarak belirtiniz.`);

        // }

        await message.react(emojis.get("ok").value().split(':')[2].replace('>', ''));
    }
}
module.exports = Duzelt;