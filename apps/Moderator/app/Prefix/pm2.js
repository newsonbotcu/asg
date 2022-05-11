const { stripIndents } = require("common-tags");
const children = require("child_process");
const { DotCommand } = require("../../../../base/utils");
const pm2 = require("pm2");
const stringTable = require('string-table');
class pm2c extends DotCommand {

    constructor(client) {
        super(client, {
            name: "pm2",
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

        function clean(text) {
            if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        }
        if (args[0] === 'logs') return;
        const ls = children.exec(`pm2 ${args.join(' ')}`);
        ls.stdout.on('data', function (data) {
            if (data) message.reply(`\`\`\`${data.slice(0, 1980)}...\`\`\``);
        });
        ls.stderr.on('data', function (data) {
            if (data) message.reply(`\`\`\`${data.slice(0, 1980)}...\`\`\``);
        });
        pm2.list((err, { id, name, status }) => {
            if (err) return;
            const table = stringTable.create({ id, name, status }, ["id", "name", "status"]);
            message.reply(`\`\`\`md\n${table}\`\`\``);
        });



    }

}

module.exports = pm2c;