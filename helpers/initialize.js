const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const low = require('lowdb');
const { Client } = require('discord.js');
const Tantoony = require('../BASE/Tantoony');
class Initialize {
    /**
     *@param {Tantoony} client
     */
    constructor(client) {
        this.client = client;
        this.project_events();
        this.loader();
    }

    project_events() {
        return [
            readdir(__dirname + '/../events/').then((files) => {
                files.filter((e) => e.endsWith('.js')).forEach((file) => {
                    this.client.logger.log("loading event: " + file, "load");
                    const event = new (require(__dirname + "/../events/" + file))(this.client);
                    this.client.extention.on(file.split(".")[0], (...args) => event.run(...args));
                    delete require.cache[require.resolve(__dirname + "/../events/" + file)];
                });
                return;
            }),
            readdir(__dirname + '/../events/module/').then((files) => {
                files.filter((e) => e.endsWith('.js')).forEach((file) => {
                    this.client.logger.log("loading event: " + file, "load");
                    const event = new (require(__dirname + "/../events/module/" + file))(this.client);
                    this.client.on(file.split(".")[0], (...args) => event.run(...args));
                    delete require.cache[require.resolve(__dirname + "/../events/module/" + file)];
                });
                return;
            })
        ]
    }

    /**
     * @param {Tantoony} client
     */
    hello(client) {
        client = client || this.client;
        //const utils = low(client.adapters('utils')).then(a => a.);
        client.guild = client.guilds.cache.get(client.config.server);
        client.owner = client.users.cache.get(client.config.owner);
        readdir(__dirname.replace('helpers', 'apps') + `/${this.client.name}/src/`).then((appFolders) => {
            appFolders.forEach(async (intType) => {
                readdir(__dirname.replace('helpers', 'apps') + `/${this.client.name}/src/${intType}/`).then((raw_output) => {
                    raw_output.filter((s) => s.endsWith('.js')).map(s => s.slice(0, s.length - ".js".length)).forEach(async (output) => {
                        const response = await client.load_int(output, intType, client);
                        if (response) {
                            client.logger.log(response, "error");
                        }
                    });
                });
            });
        }).catch(reason => {
            client.logger.log(reason, "error");
        });
        if (client) this.client = client;
        //client.channels.cache.get(utils.get("lastCrush").value()).send("**TEKRAR ONLINE!**");
        return this.client;
    }

    async loader() {
        this.client.on("error", (e) => client.logger.log(e, "error"));
        this.client.on("warn", (info) => client.logger.log(info, "warn"));
        const elements = await readdir(__dirname + `/../apps/${this.client.name}/Events/`);
        this.client.logger.log(`Loading ${elements.length} events in ${this.client.name}...`, "category");
        await elements.forEach(async (element) => {
            if (element.endsWith(".js")) {
                this.client.logger.log(`Loading Event: ${element.split(".")[0]}`, "load");
                const event = new (require(__dirname + `/../apps/${this.client.name}/Events/${element}`))(this.client);
                this.client.on(element.split(".")[0], (...args) => event.run(...args));
                delete require.cache[require.resolve(__dirname + `/../apps/${this.client.name}/Events/${element}`)];
            } else {
                const detaileds = await readdir(__dirname + `/../apps/${this.client.name}/Events/${element}/`);
                this.client.logger.log(`Loading ${detaileds.length} details of the event ${element} in ${this.client.name}...`, "category");
                detaileds.forEach((detail) => {
                    this.client.logger.log(`Loading Event: ${detail.split(".")[0]}`, "load");
                    const event = new (require(__dirname + `/../apps/${this.client.name}/Events/${element}/${detail}`))(this.client);
                    this.client.on(element.split(".")[0], (...args) => event.run(...args));
                    delete require.cache[require.resolve(__dirname + `/../apps/${this.client.name}/Events/${element}/${detail}`)];
                });
            }
        });
    }


}

module.exports = Initialize;
