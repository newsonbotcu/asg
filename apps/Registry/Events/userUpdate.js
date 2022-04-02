const Discord = require('discord.js');
const { ClientEvent } = require('../../../base/utils');

class UserUpdate extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "userUpdate"
        });
        this.client = client;
    }
    async run(oldUser, newUser) {
        const client = this.client;
        if (oldUser.username === newUser.username) return;
        const guild = client.guild;
        const member = guild.members.cache.get(newUser.id);
        if (!data.other["forbidden"].some(tag => oldUser.username.includes(tag)) && data.other["forbidden"].some(tag => newUser.username.includes(tag))) {
            client.handler.emit('Jail', member, this.client.user.id, "FORBIDDEN", "Perma", 1)
            const embed = new Discord.MessageEmbed().setColor('#2f3136').setTitle("Yasaklı Tag Alındı").setThumbnail(newUser.displayAvatarURL())
                .setDescription(`${member} kullanıcısı **${data.other["forbidden"].find(tag => !oldUser.username.includes(tag) && newUser.username.includes(tag))}* tagını aldığından dolayı hapise atıldı!`);
            await guild.channels.cache.get(data.channels["ast-ytag"]).send(embed);
            const dmEmbed = new Discord.MessageEmbed().setColor('#2f3136')
                .setDescription(`Kullanıcı adındaki ${data.other["forbidden"].find(tag => !oldUser.username.includes(tag) && newUser.username.includes(tag))} simgesi sunucumuzda yasaklı olan bir tagdır. Simgeyi kullanıcı adından kaldırdığında rollerin direkt olarak geri verilecektir.`);
            await member.send(dmEmbed);
        }
        if (data.other["forbidden"].some(tag => oldUser.username.includes(tag)) && !data.other["forbidden"].some(tag => newUser.username.includes(tag))) {
            const pjail = await client.models.jail.findOne({ _id: newUser.id, reason: "FORBIDDEN" });
            if (pjail) {
                await member.roles.remove(data.roles["prisoner"]);
                let deletedRoles = [];
                await pjail.roles.forEach(rolename => deletedRoles.push(guild.roles.cache.find(role => role.name === rolename).id));
                await member.roles.add(deletedRoles);
                await client.models.jail.deleteOne({ _id: newUser.id });
                const embed = new Discord.MessageEmbed().setColor('#2f3136').setTitle("Yasaklı Tag Çıkarıldı").setThumbnail(newUser.displayAvatarURL())
                    .setDescription(`${member} kullanıcısı **${data.other["forbidden"].find(tag => oldUser.username.includes(tag) && !newUser.username.includes(tag))}* tagını çıkardığından dolayı hapisten çıkarıldı!`);
                await guild.channels.cache.get(data.channels["ast-ytag"]).send(embed);
                const dmEmbed = new Discord.MessageEmbed().setColor('#2f3136')
                    .setDescription(`Kullanıcı adındaki ${data.other["forbidden"].find(tag => !oldUser.username.includes(tag) && newUser.username.includes(tag))} simgesini çıkardığın için eski rollerin geri verilmiştir. İyi eğlenceler...`);
                await member.send(dmEmbed);
            }
        }
        if (!oldUser.username.includes(client.config.tag) && newUser.username.includes(client.config.tag)) {
            const tagrecord = await Tagli.findOne({ _id: newUser.id });
            if (tagrecord) {
                const trc = new Tagli({ _id: newUser.id, created: new Date() });
                await trc.save();
            }
            await member.setNickname(member.displayName.replace('•', client.config.tag));
            await member.roles.add(data.roles["taglı"]);
            await guild.channels.cache.get(data.channels["general"]).send(`${data.emojis["tag"]} Tagımızı taşıman bizi onurlandırdı ${member} !\n**Bütün ailemiz selam dursun!**`);
            const embed = new Discord.MessageEmbed().setColor('#2f3136').setTitle("Tagımızı Aldı!").setDescription(`${member} tagımızı aldı!`).setThumbnail(newUser.displayAvatarURL());
            await guiild.channels.cache.get(data.channels["ast-tag"]).send(embed);
        }
        if (oldUser.username.includes(client.config.tag) && !newUser.username.includes(client.config.tag)) {
            const tagrecord = await Tagli.findOne({ _id: newUser.id });
            if (tagrecord) await Tagli.deleteOne({ _id: newUser.id });
            await member.setNickname(member.displayName.replace(client.config.tag, '•'));
            await member.roles.remove(data.roles["taglı"]);
            if (data.other["taglıAlım"] && !member.roles.cache.has(data.roles["vip"] && !member.roles.cache.has(data.roles["booster"]))) {
                await member.roles.remove(member.roles.cache.filter(r => r.editable).array());
                await member.roles.add(data.roles["welcome"]);
            }
            if (member.roles.highest.rawPosition > guild.roles.cache.get(data.roles["booster"]).rawPosition) {
                await member.roles.remove(member.roles.cache.filter(r => r.editable).filter(r => r.rawPosition > guild.roles.cache.get(data.roles["booster"]).rawPosition).array());
                await guild.channels.cache.get(data.channels["ast-salanyetkililer"]).send(new Discord.MessageEmbed().setDescription(`${member} yetkideyken tagı saldı!`))
            }
            const embed = new Discord.MessageEmbed().setColor('#ff0000').setTitle("Tagımızı Saldı!").setDescription(`${member} tagımızı saldı!`).setThumbnail(newUser.displayAvatarURL());
            await guild.channels.cache.get(data.channels["ast-tag"]).send(embed);
            
        }
    }
}
module.exports = UserUpdate;