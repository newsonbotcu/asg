const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const Tantoony = require('./Tantoony');
const pm2 = require('pm2');
const EventEmitter = require('events');
class Handler extends EventEmitter {
    /**
     *@param {Tantoony} client
     */
    constructor(client) {
        super(client)
        this.client = client;
        this.models = (model) => require('./utils').models[model];
        this.project_events();
        this.loader();
        this.lauch();
    }

    lauch() {
        pm2.launchBus(function (err, bus) {
            bus.on("process:msg", function (packet) {
                console.log(packet);
            });
        });
        process.on('message', function (packet) {
            process.send({
                type: 'process:msg',
                data: {
                    success: true
                }
            });
        });
    }

    project_events() {
        return [
            readdir(__dirname + '/../events/').then((files) => {
                files.filter((e) => e.endsWith('.js')).forEach((file) => {
                    this.client.log("loading event: " + file, "load");
                    const event = new (require(__dirname + "/../events/" + file))(this.client);
                    this.on(file.split(".")[0], (...args) => event.exec(...args));
                    delete require.cache[require.resolve(__dirname + "/../events/" + file)];
                });
                return;
            }),
            readdir(__dirname + '/../events/module/').then((files) => {
                files.filter((e) => e.endsWith('.js')).forEach((file) => {
                    this.client.log("loading event: " + file, "load");
                    const event = new (require(__dirname + "/../events/module/" + file))(this.client);
                    this.client.on(event.name, (...args) => event.exec(...args));
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
                            client.log(response, "error");
                        }
                    });
                });
            });
        }).catch(reason => {
            client.log(reason, "error");
        });
        if (client) this.client = client;
        //client.channels.cache.get(data.other["lastCrush"]).send("**TEKRAR ONLINE!**");
        return this.client;
    }

    async loader() {
        this.client.on("error", (e) => client.log(e, "error"));
        this.client.on("warn", (info) => client.log(info, "warn"));
        const elements = await readdir(__dirname + `/../apps/${this.client.name}/Events/`);
        this.client.log(`Loading ${elements.length} events in ${this.client.name}...`, "category");
        await elements.forEach(async (element) => {
            if (element.endsWith(".js")) {
                this.client.log(`Loading Event: ${element.split(".")[0]}`, "load");
                const event = new (require(__dirname + `/../apps/${this.client.name}/Events/${element}`))(this.client);
                this.client.on(event.name, (...args) => event.exec(...args));
                delete require.cache[require.resolve(__dirname + `/../apps/${this.client.name}/Events/${element}`)];
            } else {
                const detaileds = await readdir(__dirname + `/../apps/${this.client.name}/Events/${element}/`);
                this.client.log(`Loading ${detaileds.length} details of the event ${element} in ${this.client.name}...`, "category");
                detaileds.forEach((detail) => {
                    this.client.log(`Loading Event: ${detail.split(".")[0]}`, "load");
                    const event = new (require(__dirname + `/../apps/${this.client.name}/Events/${element}/${detail}`))(this.client);
                    this.client.on(event.name, (...args) => event.exec(...args));
                    delete require.cache[require.resolve(__dirname + `/../apps/${this.client.name}/Events/${element}/${detail}`)];
                });
            }
        });
    }


}

module.exports = Handler;
