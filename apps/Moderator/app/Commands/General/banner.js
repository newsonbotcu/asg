const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const afkdata = require('../../../../../MODELS/Temprorary/AfkData');
const low = require('lowdb');
class Banner extends Command {

    constructor(client) {
        super(client, {
            name: "banner",
            description: "Belirtilen kullanıcının banner kısmını mesaj kanalına yollar.",
            usage: "banner id",
            examples: ["banner id"],
            category: "Genel",
            aliases: [],
            cmdChannel: "bot-komut",
            cooldown: 5000
        });
    }
    //TOKEN BENİM BOT TOKENİ SADECE APİDEN BİLGİ ÇEKMEK İÇİN HERHANGİ BİR ZAAFI YOK ELLEMEYİN SİKERİM - STARK

    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        if (message.mentions.members.first()) {

            let member = message.mentions.members.first()
            let app = member.id

            avatar(client, message, app, "ODY5MzQ2Mjc3NDY3NTAwNTk1.YP830A.BtutP3faTiJdv7_dHSJ2KF_xoRE")

        } else if (!message.mentions.members.first()) {

            let member;
            if (args[0]) member = args[0]
            if (!args[0]) member = message.member.id

            avatar(client, message, member, "ODY5MzQ2Mjc3NDY3NTAwNTk1.YP830A.BtutP3faTiJdv7_dHSJ2KF_xoRE")
        }

    }
}

module.exports = Banner;

async function avatar(client, message, member, token) {

    const fetch = require('node-fetch').default;
    const userID = `${member}`;

    let fetched = await fetch(`https://discord.com/api/users/${userID}`, {
        method: "GET",
        headers: {
            "Authorization": `Bot ${token}`
        }
    })
    let json = await fetched.json();
    if (json.banner == null) return mmessage.react(emojis.get("error").value().split(':')[2].replace('>', ''));
    let avatarGIF = `https://cdn.discordapp.com/banners/${userID}/${json.banner}.gif?size=1024`;
    let avatarPNG = `https://cdn.discordapp.com/banners/${userID}/${json.banner}.png?size=1024`;
    let avatarFetch = await fetch(avatarGIF);
    let isavatarGIF = avatarFetch.status == 200;
    let yarrak;
    if (isavatarGIF) yarrak = avatarGIF; else yarrak = avatarPNG
    message.inlineReply(yarrak)
}
