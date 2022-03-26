const Command = require('../../../Base/Command');
const low = require('lowdb');
const Discord = require('discord.js');

class Meeting extends Command {
  constructor (client) {
    super(client, {
      name: "toplantı",
      description: "Belirtilen segmenteki istatistiklerini gösterir",
      usage: "toplantı",
      examples: ["toplantı"],
      category: "Düzen",
      aliases: ["toplanti", "meeting"],
      accaptedPerms: ["root", "owner", "cmd-ceo"],
      cooldown: 10000
    })
  }

  async run(client, message, args) {
    const roles = await low(client.adapters('roles'));

    const meetingemb = new Discord.MessageEmbed().setColor("BLACK").setTimestamp().setFooter(`• Şeytan sizi seviyor 🌟`).setColor("BLACK").setTitle("† Dante's INFEЯИO");

    switch (args[0]) {
      case "katıldı": {
        let joined = message.member.voice.channel.members.filter(member => !member.roles.cache.has(roles.get("857410693959647282").value())).array();
        joined.forEach((member, fast) => {
          setTimeout(async () => {
            member.roles.add(roles.get("857410693959647282").value()).catch();
          }, fast * 750)
        })
        message.inlineReply(`Toplantı Odasında bulunan toplam \`${katıldı.size}\` kişiye rolü dağtımaya başaldım!`)
        break;
      }
      case "sustoplantı": {
        if (!message.member.voice.channel.id) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        let MutedMembers = message.guild.channels.cache.get(message.member.voice.channel.id).members.array().filter(x => x.id !== message.member.id);
        MutedMembers.forEach((x, y) => {
          setTimeout(async () => {
            x.voice.setMute(true)
          }, y * 200)
        })
        break;
      }
      case "konuspublic": {
        if (!message.member.voice.channel.id) return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
        let MutedMembers = message.guild.channels.cache.get(message.member.voice.channel.id).members.array().filter(x => x.id !== message.member.id);
        MutedMembers.forEach((x, y) => {
          setTimeout(async () => {
            x.voice.setMute(false)
          }, y * 200)
        })
        await message.inlineReply(`Toplantı kanalındaki (\`${MutedMembers.length}\`) adet kişinin susturması kaldırıldı!`)
        break;
      }
      default: {
        message.inlineReply(meetingemb.setDescription(`
───────────────────
• .toplantı katıldı Toplantı odasındaki üyelere katıldı permini verir.
• .toplantı sustoplantı Toplantı odasındaki üyeleri susturur.
• .toplantı konuspublic Toplantı odasındaki üyelerin susturmasını açar.
───────────────────
        `)).then(msg => msg.delete({ timeout: 10000 }));
        break;
      }
    }
  }
}

module.exports = Meeting;