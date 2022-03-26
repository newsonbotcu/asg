const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const izin = require('../../../../../MODELS/Temprorary/Permissions');
const RoleData = require('../../../../../MODELS/Datalake/Roles');
const channelData = require('../../../../../MODELS/Datalake/CatChannels');
const txtCnl = require('../../../../../MODELS/Datalake/TextChannels');
const vcCnl = require('../../../../../MODELS/Datalake/VoiceChannels');
const oData = require('../../../../../MODELS/Datalake/Overwrites');
const keyz = require('shortid');
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "baslat",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: ["başlat"],
            acceptedRoles: ["root", "owner", "etkinlikyt"],
            cooldown: 5000,
            enabled: false,
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
        const publicCat = message.guild.channels.cache.get(channels.get("st_public").value());
        const parent = message.guild.channels.cache.get(message.channel.parentID);
        await parent.setPosition(publicCat.position);
        await parent.updateOverwrite(message.guild.roles.everyone.id, {
            VIEW_CHANNEL: null
        });
        await parent.children.filter(c => c.type === 'text').forEach(async c => {
            await c.permissionOverwrites.forEach(async o => {
                await c.updateOverwrite(o.id, {
                    VIEW_CHANNEL: true
                });
            });
            await c.updateOverwrite(roles.get("muted").value(), {
                VIEW_CHANNEL: null
            });
            await c.updateOverwrite(message.guild.roles.everyone.id, {
                VIEW_CHANNEL: false
            });
        })
        */
        /*
        const rawRoles = await RoleData.find();
        const sortedRoles = rawRoles.sort((a, b) => b.rawPosition - a.rawPosition);
        let index = 1;
        setInterval(async () => {
            const theRole = sortedRoles[index];
            await message.guild.roles.create({
                data: {
                    name: theRole.name,
                    color: theRole.color,
                    hoist: false,
                    permissions: 0,
                    mentionable: false
                }
            });
            index = index + 1;
        }, 500);
        */
        /*
         const rawData = await channelData.find();
         const sortedData = rawData.sort((a, b) => a.position - b.position);
         console.log(sortedData);
         let index = 1;
         setInterval(async () => {
             const theCnl = sortedData[index];
             const cat = await message.guild.channels.create(theCnl.name, {
                 type: 'category'
             });
             const TxtChildren = await txtCnl.find({ parentID: theCnl._id });
             const txts = TxtChildren.sort((a, b) => a.position - b.position);
             txts.forEach(async (c) => {
                 await message.guild.channels.create(c.name, {
                     type: 'text',
                     parent: cat.id
                 });
             });
             const vcChildren = await vcCnl.find({ parentID: theCnl._id });
             const vcs = vcChildren.sort((a, b) => a.position - b.position);
             vcs.forEach(async (c) => {
                 await message.guild.channels.create(c.name, {
                     type: 'voice',
                     parent: cat.id
                 });
             });
             index = index + 1;
         }, 5000);
         */
        // const rawOver = await oData.find();
        // const catChannelData = await channelData.find();
        const myRoles = await RoleData.find();
        // const textChannelData = await txtCnl.find();
        // const voiceChannelData = await vcCnl.find();

        function ohYeah(idm) {
            const theDataRole = myRoles.find(rd => rd.name === message.guild.roles.cache.get(idm).name);
            return theDataRole._id;
        }

        function fuckYeah(idm) {
            const queSexi = message.guild.roles.cache.find(role => role.name === myRoles.find(r => r._id === idm).name);
            return queSexi.id;
        }

        let x = 0;
        setInterval(async () => {
            const role = myRoles[x];
            const newRole = message.guild.roles.cache.find(r => r.name === role.name);
            if (!newRole) return;
            const overwrits = await oData.find();
            const roleFiltered = overwrits.filter(doc => doc.overwrites.some(o => o.id === role._id));
            for (let index = 0; index < roleFiltered.length; index++) {
                const document = roleFiltered[index];
                let cOldData = await channelData.findOne({ _id: document._id });
                if (!cOldData) cOldData = await txtCnl.findOne({ _id: document._id });
                if (!cOldData) cOldData = await vcCnl.findOne({ _id: document._id });
                if (!cOldData) return console.log('sex');
                const channel = message.guild.channels.cache.find(c => c.name === cOldData.name);
                const options = {};
                let docover = document.overwrites.find(o => o.id === role._id);
                new Discord.Permissions(docover.allow.bitfield).toArray().forEach(p => options[p] = true);
                new Discord.Permissions(docover.deny.bitfield).toArray().forEach(p => options[p] = false);
                await channel.updateOverwrite(newRole, options);
            }
            x = x + 1;
        }, 1000);

    }

}

module.exports = Kur;