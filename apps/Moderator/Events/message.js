const Discord = require("discord.js");
const { ClientEvent } = require('../../../base/utils');

class MsgCrte extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "messageCreate"
        });
        this.client = client;
    }
    async run(message) {
        const client = this.client;
        const data = this.data;
        if (message.guild && (message.guild.id !== client.config.server)) return;
        const elebaşı = ["discord.gg/", "discord.com/invite/", "discordapp.com/invite/", "discord.me/"];
        if (message.guild && elebaşı.some(link => message.content.includes(link))) {
            for (let c = 0; c < elebaşı.length; c++) {
                const ele = elebaşı[c];
                if (message.content.includes(ele)) {
                    message.content.split(" ").filter((str) => str.includes(ele)).map(el => el.slice(ele.length)).forEach(async (code) => {
                        const reklam = await client.fetchInvite(code);
                        if (!reklam.guild) return;
                        if (reklam.guild.id !== client.guild.id) {
                            client.emit("ban", message.author.id, client.user.id, `\`${reklam.guild.name}\` [${reklam.guild.id}] sunucusunun reklamını\n\`${message.channel.name}\` [${message.channel.id}] kanalına attı.\n${reklam.inviter ? reklam.inviter.username + '#' + reklam.inviter.discriminator + " [" + reklam.inviter.id + "] " : ""}`, "p", `#REKLAM`, 2);
                        }
                    });
                }
            }
        }
        /*
        let uCooldownz = client.spamwait[message.author.id];
        if (!uCooldownz) {
            client.spamwait[message.author.id] = {};
            uCooldownz = client.spamwait[message.author.id];
        }
        let timez = uCooldownz[message.content] || 0;
        if (timez && (timez > Date.now())) {
            let uCount = client.spamcounts[message.author.id];
            if (!uCount) {
                this.client.spamcounts[message.author.id] = {};
                uCount = this.client.spamcounts[message.author.id];
                //console.log(uCount);
            }
            let count = uCount[message.content] || 0;
            //console.log(uCount);
            if (count === 1) message.channel.send(`Spamlamaya devam edersen muteleneceksin! ${ message.author }`);
            if (count === 3) {
                message.member.roles.add(data.roles["muted"]);
                message.channel.send(`${ message.member } Spam yaptığın için mutelendin!`)
            }
            if (count >= 1) await message.delete();
            this.client.spamcounts[message.author.id][message.content] = count + 1;
            return;
        }
        this.client.spamwait[message.author.id][message.content] = Date.now() + 3000;
        let system = await afkdata.findOne({ _id: message.member.user.id });
        if (system) {
            message.channel.send(new Discord.MessageEmbed().setDescription(`Seni tekrardan görmek ne güzel ${ message.member }!\n${ system.inbox.length > 0 ? `${system.inbox.length} yeni mesajın var!\n●▬▬▬▬▬▬▬▬▬●\n${system.inbox.map(content => `[${message.guild.members.cache.get(content.userID) || "Bilinmiyor"}]: ${content.content}`).join('\n')}` : "Hiç yeni mesajın yok!" }`));
            await afkdata.deleteOne({ _id: message.member.user.id });
        }
        if (message.mentions.members.first()) {
            const afksindata = await afkdata.find();
            const afks = message.mentions.members.array().filter(m => afksindata.some(doc => doc._id === m.user.id));
            if (afks.length > 0) {
                message.channel.send(new Discord.MessageEmbed().setDescription(afks.map(afk => `${ afk } \`${afksindata.find(data => data._id === afk.user.id).reason}\` sebebiyle, **${checkHours(afksindata.find(data => data._id === afk.user.id).created)}** saattir AFK!`).join('\n')));
                    await afks.forEach(async afk => {
                        await afkdata.updateOne({ _id: afk.user.id }, {
                            $push: {
                                inbox: {
                                    content: message.content,
                                    userID: message.author.id
                                }
                            }
                        });
                    });
                }
            }
        */

    }
}
module.exports = MsgCrte;