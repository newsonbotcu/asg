const Command = require("../../../Base/Command");
const low = require('lowdb');
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
class Reload extends Command {

    constructor(client) {
        super(client, {
            name: "reload",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: ["rl"],
            acceptedRoles: [],
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
        
        let command = args[0];
        let i = 0;
        if (!args[0]) {
            let directories = await readdir("./Commands/client-commands/");
            await client.logger.log(`Loading a total of ${directories.length} categories.`, "category");
            directories.forEach(async (dir) => {
                let commands = await readdir("./Commands/client-commands/" + dir + "/");
                commands.filter((cmd) => cmd.split(".").pop() === "js").forEach(async (cmd) => {
                    cmd = this.client.commands.get(cmd.replace('.js', ''));
                    await this.client.unloadCommand(cmd.config.location, cmd.info.name);
                    const response = this.client.loadCommand(cmd.config.location, cmd.info.name);
                    if (response) {
                        return client.logger.log(response, "error");
                    }
                    
                    i = i + 1;
                });
            });

            setTimeout(() => {
                client.logger.log(`${i} COMMANDS HAS BEEN RELOADED!`, "log");
                message.inlineReply(`\`${i} Adet Komut Başarıyla Yüklendi!\``);
            }, 1000);

        } else {

            let cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
            if (!cmd) {
                return message.react(emojis.get("error").value().split(':')[2].replace('>', ''));
            }
            await this.client.unloadCommand(cmd.config.location, cmd.info.name);
            await this.client.loadCommand(cmd.config.location, cmd.info.name);
            message.inlineReply(`\`Başarıyla Yenilendi\``);

        }


    }

}

module.exports = Reload;