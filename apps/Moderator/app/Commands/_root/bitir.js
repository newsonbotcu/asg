const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const izin = require('../../../../../MODELS/Temprorary/Permissions');
const keyz = require('shortid');
const children = require('child_process');
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "bitir",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: [],
            acceptedRoles: ["root", "owner", "etkinlikyt"],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: false,
            rootOnly: true,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        /*
        const publicCat = message.guild.channels.cache.filter(c => c.type === "category").array();
        const parent = message.guild.channels.cache.get(message.channel.parentID);
        await parent.permissionOverwrites.forEach(async o => {
            await parent.updateOverwrite(o.id, {
                VIEW_CHANNEL: null
            });
        });
        await parent.setPosition(publicCat.length - 2);
        await parent.updateOverwrite(message.guild.roles.everyone.id, {
            VIEW_CHANNEL: false
        });
        await message.guild.channels.cache.filter(c => c.parentID === parent.id).forEach(async c => {
            await c.lockPermissions();
            await c.lockPermissions();
        });
        await parent.updateOverwrite(message.guild.roles.everyone.id, {
            VIEW_CHANNEL: false
        });
        */
        function Process(i) {
            var ls = children.exec(`pm2 delete /home/${client.config.project}/${utils.get("dir").value()}/INTERNAL/BOTS/_CD/cd${i}.js`);
            ls.stdout.on('data', function (data) {
                console.log(data);
            });
            ls.stderr.on('data', function (data) {
                console.log(data);
            });
            ls.on('close', function (code) {
                if (code == 0)
                    console.log('Stop');
                else
                    console.log('Start');
            });
        }
        for (let index = 1; index < utils.get("CdSize").value() + 1; index++) {
            Process(index);
        }
        await ctx.send(`Başarılı!`);
    }

}

module.exports = Kur;