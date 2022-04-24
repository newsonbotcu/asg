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
        const guild = client.guild;
        const member = guild.members.cache.get(newUser.id);
        /*
        if (!this.data.other["forbidden"].some(tag => oldUser.username.includes(tag)) && this.data.other["forbidden"].some(tag => newUser.username.includes(tag))) {
            client.handler.emit('jail', member, this.client.user.id, "FORBIDDEN", "Perma", 1)
            const embed = new Discord.MessageEmbed().setColor('#2f3136').setTitle("Yasaklı Tag Alındı").setThumbnail(newUser.displayAvatarURL())
                .setDescription(`${member} kullanıcısı **${this.data.other["forbidden"].find(tag => !oldUser.username.includes(tag) && newUser.username.includes(tag))}* tagını aldığından dolayı hapise atıldı!`);
            await guild.channels.cache.get(this.data.channels["ast-ytag"]).send(embed);
            const dmEmbed = new Discord.MessageEmbed().setColor('#2f3136')
                .setDescription(`Kullanıcı adındaki ${this.data.other["forbidden"].find(tag => !oldUser.username.includes(tag) && newUser.username.includes(tag))} simgesi sunucumuzda yasaklı olan bir tagdır. Simgeyi kullanıcı adından kaldırdığında rollerin direkt olarak geri verilecektir.`);
            await member.send(dmEmbed);
        }
        if (this.data.other["forbidden"].some(tag => oldUser.username.includes(tag)) && !this.data.other["forbidden"].some(tag => newUser.username.includes(tag))) {
            const pjail = await client.models.jail.findOne({ _id: newUser.id, reason: "FORBIDDEN" });
            if (pjail) {
                await member.roles.remove(this.data.roles["prisoner"]);
                let deletedRoles = [];
                await pjail.roles.forEach(rolename => deletedRoles.push(guild.roles.cache.find(role => role.name === rolename).id));
                await member.roles.add(deletedRoles);
                await client.models.jail.deleteOne({ _id: newUser.id });
                const embed = new Discord.MessageEmbed().setColor('#2f3136').setTitle("Yasaklı Tag Çıkarıldı").setThumbnail(newUser.displayAvatarURL())
                    .setDescription(`${member} kullanıcısı **${this.data.other["forbidden"].find(tag => oldUser.username.includes(tag) && !newUser.username.includes(tag))}* tagını çıkardığından dolayı hapisten çıkarıldı!`);
                await guild.channels.cache.get(this.data.channels["ast-ytag"]).send(embed);
                const dmEmbed = new Discord.MessageEmbed().setColor('#2f3136')
                    .setDescription(`Kullanıcı adındaki ${this.data.other["forbidden"].find(tag => !oldUser.username.includes(tag) && newUser.username.includes(tag))} simgesini çıkardığın için eski rollerin geri verilmiştir. İyi eğlenceler...`);
                await member.send(dmEmbed);
            }
        }
        */
        await this.client.models.member.updateOne({ _id: newUser.id }, {
            names: {
                $push: {
                    username: newUser.username,
                    discriminator: newUser.discriminator,
                    created: new Date(),
                    claimer: ""
                }
            }
        });
        if (!client.config.tags.some(t => oldUser.username.includes(t)) && client.config.tags.some(t => newUser.username.includes(t))) {
            await member.setNickname(member.displayName.replace(client.config.point.default, client.config.point.tagged));
            await member.roles.add(this.data.roles["taglı"]);
            await guild.channels.cache.get(this.data.channels["general"]).send(`${this.data.emojis["tag"]} Tagımızı taşıman bizi onurlandırdı ${member} !\n**Bütün ailemiz selam dursun!**`);
            const embed = new Discord.MessageEmbed().setColor('#2f3136').setTitle("Tagımızı Aldı!").setDescription(`${member} tagımızı aldı!`).setThumbnail(newUser.displayAvatarURL());
            await guiild.channels.cache.get(this.data.channels["ast-tag"]).send(embed);
        }
        if (client.config.tags.some(t => oldUser.username.includes(t)) && !client.config.tags.some(t => newUser.username.includes(t))) {
            await member.setNickname(member.displayName.replace(client.config.point.tagged, client.config.point.default));
            await member.roles.remove(this.data.roles["taglı"]);
            if (this.data.other["taglıAlım"] && !member.roles.cache.has(this.data.roles["vip"] && !member.roles.cache.has(this.data.roles["booster"]))) {
                await member.roles.remove(member.roles.cache.filter(r => r.editable).array());
                await member.roles.add(this.data.roles["welcome"]);
            }
            if (member.roles.highest.rawPosition > guild.roles.cache.get(this.data.roles["booster"]).rawPosition) {
                await member.roles.remove(member.roles.cache.filter(r => r.editable).filter(r => r.rawPosition > guild.roles.cache.get(this.data.roles["booster"]).rawPosition).array());
                await guild.channels.cache.get(this.data.channels["ast-salanyetkililer"]).send(new Discord.MessageEmbed().setDescription(`${member} yetkideyken tagı saldı!`))
            }
            const embed = new Discord.MessageEmbed().setColor('#ff0000').setTitle("Tagımızı Saldı!").setDescription(`${member} tagımızı saldı!`).setThumbnail(newUser.displayAvatarURL());
            await guild.channels.cache.get(this.data.channels["ast-tag"]).send(embed);
        }
        if (oldUser.discriminator === client.config.dis && newUser.discriminator !== client.config.dis) {
            await member.setNickname(member.displayName.replace(client.config.point.tagged, client.config.point.default));
            await member.roles.remove(this.data.roles["taglı"]);
            if (this.data.other["taglıAlım"] && !member.roles.cache.has(this.data.roles["vip"] && !member.roles.cache.has(this.data.roles["booster"]))) {
                await member.roles.remove(member.roles.cache.filter(r => r.editable).array());
                await member.roles.add(this.data.roles["welcome"]);
            }
            if (member.roles.highest.rawPosition > guild.roles.cache.get(this.data.roles["booster"]).rawPosition) {
                await member.roles.remove(member.roles.cache.filter(r => r.editable).filter(r => r.rawPosition > guild.roles.cache.get(this.data.roles["booster"]).rawPosition).array());
                await guild.channels.cache.get(this.data.channels["ast-salanyetkililer"]).send(new Discord.MessageEmbed().setDescription(`${member} yetkideyken tagı saldı!`))
            }
            const embed = new Discord.MessageEmbed().setColor('#ff0000').setTitle("Tagımızı Saldı!").setDescription(`${member} tagımızı saldı!`).setThumbnail(newUser.displayAvatarURL());
            await guild.channels.cache.get(this.data.channels["ast-tag"]).send(embed);
        }
        if (oldUser.discriminator !== client.config.dis && newUser.discriminator === client.config.dis) {
            await member.setNickname(member.displayName.replace(client.config.point.default, client.config.point.tagged));
            await member.roles.add(this.data.roles["taglı"]);
            await guild.channels.cache.get(this.data.channels["general"]).send(`${this.data.emojis["tag"]} Tagımızı taşıman bizi onurlandırdı ${member} !\n**Bütün ailemiz selam dursun!**`);
            const embed = new Discord.MessageEmbed().setColor('#2f3136').setTitle("Tagımızı Aldı!").setDescription(`${member} tagımızı aldı!`).setThumbnail(newUser.displayAvatarURL());
            await guiild.channels.cache.get(this.data.channels["ast-tag"]).send(embed);

        }

    }
}
module.exports = UserUpdate;