const Command = require("../../../Base/Command");
const low = require('lowdb');
const { stripIndents } = require("common-tags");
const children = require("child_process");
const Points_config = require('../../../../../MODELS/Economy/Points_config');
const Points_profile = require("../../../../../MODELS/Economy/Points_profile");
class pm2 extends Command {

    constructor(client) {
        super(client, {
            name: "puanla",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: [],
            accaptedPerms: [],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: true,
            onTest: false,
            rootOnly: false,
            dmCmd: false
        });
    }

    async run(client, message, args, data) {

        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        const hoistroller = message.guild.roles.cache
            .filter(r => r.rawPosition >= message.guild.roles.cache.get("856265277637394472").rawPosition)
            .filter(r => r.hoist).filter(r => r.name.startsWith('†'))
            .filter(r => r.id !== roles.get("booster").value())
            .sort((a, b) => a.rawPosition - b.rawPosition).array().reverse();
        console.log(hoistroller.map(r => r.name))

        for (let index = 0; index < hoistroller.length; index++) {
            const role = hoistroller[index];
            await Points_config.create({
                _id: role.id,
                requiredPoint: 100000000000,
                expiringHours: 10000,
                registry: 0,
                invite: 0,
                tagged: 0,
                authorized: 0,
                message: 0,
                voicePublicPerMinute: 0,
                voiceOtherPerMinute: 0
            })
        }

        await message.guild.members.cache.filter(m => hoistroller.some(rol => m.roles.cache.has(rol.id))).forEach(async (member) => {
            await Points_profile.create({
                _id: member.user.id,
                role: member.roles.cache.map(r => r.id).find(rID => hoistroller.map(r => r.id).includes(rID)),
                points: [],
                msgPoints: 0,
                excused: false,
                created: new Date()
            })
        })


    }

}

module.exports = pm2;