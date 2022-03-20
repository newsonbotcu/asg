const Discord = require('discord.js');
const Command = require("../../../Base/Command");
const low = require('lowdb');
const fetch = require('node-fetch');
class Avatar extends Command {

    constructor(client) {
        super(client, {
            name: "activity",
            description: ":)",
            usage: "activity",
            examples: ["activity youtube", "activiy poker"],
            aliases: ["act"],
            category: "Genel",
            cmdChannel: "bot-komut",
            cooldown: 10000
        });
    }

    async run(client, message, args) {
        const ACTIVITIES = {
            "poker": {
                id: "755827207812677713",
                name: "Poker Night"
            },
            "betrayal": {
                id: "773336526917861400",
                name: "Betrayal.io"
            },
            "youtube": {
                id: "755600276941176913",
                name: "YouTube Together"
            },
            "fishington": {
                id: "814288819477020702",
                name: "Fishington.io"
            }
        };
        const emojis = await low(client.adapters('emojis'));
        if (!message.channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        if (!message.member.voice.channel) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        const activity = ACTIVITIES[args[0] ? args[0].toLowerCase() : null];
        if (!activity) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        fetch(`https://discord.com/api/v8/channels/${message.member.voice.channelID}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: activity.id,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
        }).then(response => response.json()).then(data => {
            message.inlineReply(
            `✅ **${message.member.voice.channel.name}** odasına kuruldu!\nℹ️ Partiye katılmak ve arkadaşlarınızı davet etmek için Yönlendirme bağlantısını kullanın.\n\nBağlantı: https://discord.gg/${data.code}`
            );
        }).catch(e => {
            message.inlineReply(`:x: | Başlatılamadı ${activity.name}!`);
        })
    }
}

module.exports = Avatar;