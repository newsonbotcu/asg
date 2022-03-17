const { Client, Collection } = require('discord.js');
const { EventEmitter } = require('events');

class Tantoony extends Client {
    constructor(options, name) {
        super(options);
        this.name = name;
        this.functions = require('./utils');
        this.models = require('./db_models');
        this.config = require('./config');
        this.logger = require("./logger");
        this.extention = new EventEmitter();
        (() => {
            require('dotenv').config({ path: __dirname + '/.env' });
            this.login(process.env[this.config.vars[name]]);
        })();
        this.mongoLogin(); 
        this.responders = new Collection();
        this.cmdCoodown = new Object();
        this.leaves = new Map();
        this.deleteChnl = new Map();
        this.invites = new Object();
        this.spamwait = new Map();
        this.spamcounts = new Object();
        this.trollwait = new Object();
        this.trollcounts = new Object();
        this.stats = new Object();
        this.banlimit = new Object();
        this.voicecutLimit = new Object();

        this.handler = new (require('./initialize'))(this);
    };

    mongoLogin() {
        require('mongoose').connect(`mongodb://${process.env.mongo_pass}:${this.config.mongoDB.port}`, {
            user: this.config.mongoDB.user,
            pass: process.env.mongoDB,
            authSource: this.config.mongoDB.auth,
            dbName: this.config.mongoDB.name
        }).then(() => {
            this.logger.log("Connected to the Mongodb database.", "mngdb");
        }).catch((err) => {
            this.logger.log("Unable to connect to the Mongodb database. Error: " + err, "error");
        });
    }

    getPath(obj, value, path) {

        if (typeof obj !== 'object') {
            return;
        }

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var t = path;
                var v = obj[key];
                if (!path) {
                    path = key;
                }
                else {
                    path = path + '.' + key;
                }
                if (v === value) {
                    return path.toString();
                }
                else if (typeof v !== 'object') {
                    path = t;
                };
                var res = this.getPath(v, value, path);
                if (res) {
                    return res;
                }
            }
        };
    }

    async load_int(intName, intType, client) {
        const props = new (require(`../apps/${this.name}/src/${intType}/${intName}`))(client, {}, client.guild, this.config.apps);
        client.responders.set(`${intType}:${props.name}`, props);
        if (props.name) try {
            const cmd = await client.guild.commands.create(props, this.config.apps);
            props.id = cmd.id;
            this.logger.log(`Loading "${intType}" Integration in ${this.name}: ${cmd.name} [${props.id}] 👌`, "load");
            client.responders.set(`${intType}:${cmd.name}`, props);
            const markedRoles = await this.models.marked_ids.find({ type: "ROLE" });
            const prm = props.permissions.map(p => markedRoles.find(rD => rD._id === p).value);
            if (prm.length !== 0) client.guild.commands.permissions.set({
                command: cmd.id,
                permissions: prm.map(pm => {
                    return {
                        id: prm,
                        type: "ROLE",
                        permission: true
                    }
                })
            });
            return false;
        } catch (e) {
            return `Unable to load "${intType}" Integration ${intName}: ${e}`;
        }
    }

    async unload_int(intName, intType) {
        let ress;
        if (this.responders.has(intType + ":" + intName)) {
            ress = this.responders.get(intType + ":" + intName);
        }
        if (!ress) {
            return `The command \`${intName}\` doesn't seem to exist, nor is it an alias. Try again!`;
        }
        if (ress.shutdown) {
            await ress.shutdown(this);
        }
        delete require.cache[require.resolve(`../apps/${this.name}/src/${intType}/${intName}.js`)];
        return false;
    }

    async fetchEntry(action) {
        const entry = await this.client.guild.fetchAuditLogs({ type: action }).then((logs) => logs.entries.first());
        return entry;
    }

}
module.exports = Tantoony;
