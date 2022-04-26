const children = require("child_process");
const { SlashCommand } = require("../../../../base/utils");

module.exports = class SlashBan extends SlashCommand {
    constructor(client) {
        super(client, {
            name: 'sudo',
            description: 'tantoony only',
            options: [
                {
                    type: "SUB_COMMAND",
                    name: 'eval',
                    description: 'Dikkat et yavrum',
                    options: [
                        {
                            type: "STRING",
                            name: "tür",
                            description: "eval türü",
                            required: true,
                            choices: [
                                {
                                    name: "sync",
                                    value: "sync"
                                },
                                {
                                    name: "async",
                                    value: "async"
                                }
                            ]
                        },
                        {
                            type: "STRING",
                            name: "kod",
                            description: "yazacağın kod",
                            required: true
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: 'pm2',
                    description: 'pm2 komutları',
                    options: [
                        {
                            type: "STRING",
                            name: "komut",
                            description: "komutu belirtiniz",
                            required: true,
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: 'dağıtıcılar',
                    description: 'Rol dağıtma botları',
                    options: [
                        {
                            type: "STRING",
                            name: 'işlem',
                            choices: [
                                {
                                    name: "aç",
                                    value: "start"
                                },
                                {
                                    name: "kapat",
                                    value: "delete"
                                }
                            ],
                            required: true
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: 'debug',
                    description: 'Backup buglarını düzeltir',
                    options: [
                        {
                            type: "STRING",
                            name: 'işlem',
                            description: 'Debug yapılacak veritabanı',
                            choices: [
                                {
                                    name: "Metin Kanalları",
                                    value: "text"
                                },
                                {
                                    name: "Ses Kanalları",
                                    value: "voice"
                                },
                                {
                                    name: "Kategori Kanalları",
                                    value: "category"
                                },
                                {
                                    name: "Kanal izinleri",
                                    value: "overwrite"
                                },
                                {
                                    name: "Sunucu Rolleri",
                                    value: "role"
                                },
                                {
                                    name: "Üye Rolleri",
                                    value: "member"
                                }
                            ],
                            required: true
                        }
                    ]
                }
            ],
            defaultPermission: false,
        });
    }

    async run(ctx) {
        const client = ctx.creator.client;
        const userID = Object.values(ctx.options)[0];
        const guild = client.guilds.cache.get(ctx.guildID);
        const channel = guild.channels.cache.get(ctx.channelID);
        function clean(text) {
            if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        }
        switch (Object.keys(ctx.options)[0]) {
            case "eval":
                if (Object.values(ctx.options['eval'])[0] === 'sync') {
                    try {
                        let evaled = eval(Object.values(ctx.options['eval'])[1]);
                        if (typeof evaled !== "string")
                            evaled = require("util").inspect(evaled);

                        await ctx.send(`\`\`\`xl\n${clean(evaled)}\`\`\``, { ephemeral: true });
                    } catch (err) {
                        await ctx.send(`\`\`\`xl\n${clean(err)}\`\`\``, { ephemeral: true });
                    }
                } else {
                    try {
                        let evaled = eval("(async () => {" + Object.values(ctx.options['eval'])[1] + "})()");
                        if (typeof evaled !== "string")
                            evaled = require("util").inspect(evaled);

                        await ctx.send(`\`\`\`xl\n${clean(evaled)}\`\`\``, { ephemeral: true });
                    } catch (err) {
                        await ctx.send(`\`\`\`xl\n${clean(err)}\`\`\``, { ephemeral: true });
                    }
                }
                break;

            case "pm2":
                if (Object.values(ctx.options['pm2'])[0].startsWith('logs')) return;
                const ls = children.exec(`pm2 ${Object.values(ctx.options['pm2'])[0]}`);
                ls.stdout.on('data', function (data) {
                    ctx.send(`\`\`\`${data.slice(0, 1990)}...\`\`\``);
                });
                ls.stderr.on('data', function (data) {
                    ctx.send(`\`\`\`${data.slice(0, 1990)}...\`\`\``);
                });
                setTimeout(() => {
                    ls.kill();
                }, 100);
                break;

            case "calm-down":
                function Process(i) {
                    var ls = children.exec(`pm2 ${Object.values(ctx.options['calm-down'])[0]} /home/${client.config.user}/${client.config.repo}/INTERNAL/BOTS/_CD/cd${i}.js`);
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
                for (let index = 1; index < client.config.vars.calm_down.length + 1; index++) {
                    Process(index);
                }
                await ctx.send(`Başarılı!`);
                break;

            case "debug":
                const BackupData = require(`../../../../../MODELS/Datalake/backup_${Object.values(ctx.options["debug"])[0]}`);
                if (Object.values(ctx.options["debug"])[0] === "text") {
                    const TextBackup = await BackupData.find();
                    await TextBackup.forEach(async data => {
                        if (!guild.channels.cache.has(data._id)) {
                            await BackupData.deleteOne({ _id: data._id });
                        } else {
                            await BackupData.updateOne({ _id: data._id }, {
                                $set: {
                                    name: guild.channels.cache.get(data._id).name,
                                    name: guild.channels.cache.get(data._id).name,
                                    nsfw: guild.channels.cache.get(data._id).nsfw,
                                    parentId: guild.channels.cache.get(data._id).parentId,
                                    position: guild.channels.cache.get(data._id).position,
                                    rateLimit: guild.channels.cache.get(data._id).rateLimit
                                }
                            });
                        }
                    });
                    await guild.channels.cache.filter(c => (c.type === 'text' || c.type === 'news') && !TextBackup.some(data => data._id === c.id)).forEach(async c => {
                        await BackupData.create({
                            _id: c.id,
                            name: c.name,
                            nsfw: c.nsfw,
                            parentId: c.parentId,
                            position: c.position,
                            rateLimit: c.rateLimit
                        });
                    });
                }
                if (Object.values(ctx.options["debug"])[0] === "voice") {
                    const VoiceBackup = await BackupData.find();
                    await VoiceBackup.forEach(async data => {
                        if (!guild.channels.cache.has(data._id)) {
                            await BackupData.deleteOne({ _id: data._id });
                        } else {
                            await BackupData.updateOne({ _id: data._id }, {
                                $set: {
                                    name: guild.channels.cache.get(data._id).name,
                                    bitrate: guild.channels.cache.get(data._id).bitrate,
                                    parentId: guild.channels.cache.get(data._id).parentId,
                                    position: guild.channels.cache.get(data._id).position
                                }
                            });
                        }
                    });
                    await guild.channels.cache.filter(c => c.type === 'voice' && !VoiceBackup.some(data => data._id === c.id)).forEach(async c => {
                        await BackupData.create({
                            _id: c.id,
                            name: c.name,
                            bitrate: c.bitrate,
                            parentId: c.parentId,
                            position: c.position
                        });
                    });
                }
                if (Object.values(ctx.options["debug"])[0] === "category") {
                    const CategoryBackup = await BackupData.find();
                    await CategoryBackup.forEach(async data => {
                        if (!guild.channels.cache.has(data._id)) {
                            await BackupData.deleteOne({ _id: data._id });
                        } else {
                            await BackupData.updateOne({ _id: data._id }, {
                                $set: {
                                    name: guild.channels.cache.get(data._id).name,
                                    position: guild.channels.cache.get(data._id).position
                                }
                            });
                        }
                    });
                    await guild.channels.cache.filter(c => c.type === 'category' && !CategoryBackup.some(data => data._id === c.id)).forEach(async c => {
                        await BackupData.create({
                            _id: c.id,
                            name: c.name,
                            position: c.position
                        });
                    });
                }
                if (Object.values(ctx.options["debug"])[0] === "overwrite") {
                    const OverwriteBackup = await BackupData.find();
                    await OverwriteBackup.forEach(async data => {
                        if (!guild.channels.cache.has(data._id)) {
                            await BackupData.deleteOne({ _id: data._id });
                        } else {
                            await BackupData.updateOne({ _id: data._id }, {
                                $set: { overwrites: guild.channels.cache.get(data._id).permissionOverwrites.array() }
                            });
                        }
                    });
                    await guild.channels.cache.filter(c => !OverwriteBackup.some(data => data._id === c.id)).forEach(async c => {
                        await BackupData.create({ _id: c.id, overwrites: c.permissionOverwrites.array() });
                    });
                }
                if (Object.values(ctx.options["debug"])[0] === "role") {
                    const RoleBackup = await BackupData.find();
                    await RoleBackup.forEach(async data => {
                        if (!guild.roles.cache.has(data._id)) {
                            await BackupData.deleteOne({ _id: data._id });
                        } else {
                            const role = guild.roles.cache.get(data._id);
                            await BackupData.updateOne({ _id: data._id }, {
                                $set: {
                                    name: role.name,
                                    color: role.hexColor,
                                    hoist: role.hoist,
                                    mentionable: role.mentionable,
                                    rawPosition: role.rawPosition,
                                    bitfield: role.permissions
                                }
                            });
                        }
                    });
                    await guild.roles.cache.filter(r => !RoleBackup.some(data => data._id === r.id)).forEach(async role => {
                        await BackupData.create({
                            _id: role.id,
                            name: role.name,
                            color: role.hexColor,
                            hoist: role.hoist,
                            mentionable: role.mentionable,
                            rawPosition: role.rawPosition,
                            bitfield: role.permissions
                        });
                    });
                }
                if (Object.values(ctx.options["debug"])[0] === "member") {
                    const MemberBackup = await BackupData.find();
                    await MemberBackup.forEach(async data => {
                        if (!guild.members.cache.has(data._id)) {
                            await BackupData.deleteOne({ _id: data._id });
                        } else {
                            await BackupData.updateOne({ _id: data._id }, {
                                $set: { roles: guild.members.cache.get(data._id).roles.cache.array().map(r => r.name) }
                            });
                        }
                    });
                    await guild.members.cache.filter(m => !MemberBackup.some(data => data._id === m.user.id)).forEach(async m => {
                        await BackupData.create({ _id: m.user.id, roles: m.roles.cache.array().map(r => r.name) });
                    });
                }
                await ctx.send("OK BOOMER", {
                    ephemeral: true
                });
                break;

            default:
                break;
        }
    }
}
