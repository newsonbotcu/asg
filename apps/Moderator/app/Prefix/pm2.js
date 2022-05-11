const { stripIndents } = require("common-tags");
const children = require("child_process");
const { DotCommand } = require("../../../../base/utils");
const pm2 = require("pm2");
const stringTable = require('string-table');
class pm2 extends DotCommand {

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
        children.exec(`pm2 ${args.join(' ')}`);
		pm2.list((err, list) => {
			if (err) return;
            const table = stringTable.create(list, ["id", "name", "status"]);
            message.reply(`\`\`\`md\n${table}\`\`\``);
		});
        


    }

}

module.exports = pm2;