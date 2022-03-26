const Command = require("../../../Base/Command");
const Discord = require("discord.js");
const low = require('lowdb');

class Dagit extends Command {
    constructor(client) {
        super(client, {
            name: "dağıt",
            description: "kanalı public odalara dağıtır.",
            usage: "dağıt",
            examples: ["dağıt"],
            category: "Yetkili",
            aliases: ["odadağıt"],
            accaptedPerms: ["root", "owner", "cmd-ceo"],
        });
    }
    async run(client, message, args) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        if (!message.member.hasPermission("ADMINISTRATOR")) return;

        let voiceChannel = message.member.voice.channelID;
        if (!voiceChannel) return message.reply("Herhangi bir ses kanalında değilsin!");

        let publicRooms = message.guild.channels.cache.filter(c => c.parentID === "854087056757489696" && c.type === "voice" && c.id != "871460692321009715");
        message.member.voice.channel.members.array().forEach((m, index) => {
          setTimeout(() => {
             if (m.voice.channelID !== voiceChannel) return;
             m.voice.setChannel(publicRooms.random().id);
          }, index*1000);
        });
        message.reply(`${message.member.voice.channel} adlı ses kanalındaki üyeler rastgele public odalara dağıtılmaya başlandı!`);
    }
}

module.exports = Dagit;