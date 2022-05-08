const { Client, Collection } = require('discord.js');
class Tantoony extends Client {
    constructor(options, name) {
        super(options);
        this.name = name;
        this.config = require('./config');
        this.log = (p, t) => {
            return require("./utils")
                .functions
                .log(p, t)
        };
        (() => {
            require('dotenv').config({ path: __dirname + '/.env' });
            this.login(process.env[this.config.vars[name]]);
            this.mongoLogin();
        })();
        this.data = {
            emojis: {},
            roles: {},
            channels: {},
            other: {},
            mash: (...values) => {
                let temp = [];
                for (let i = 0; i < values.length; i++) {
                    const value = values[i];
                    temp.concat(value);
                }
                return temp;
            }
        };
        this.models = require('./utils').models;
        this.func = require('./utils').functions;
        this.responders = new Collection();
        this.vanityUses = 0;
        this.actionlist = {
            textspam: new Collection(),
            voicespam: new Collection(),
            voicecut: new Collection()
        };
        this.handler = new (require('./handler'))(this);
        /*
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
        */
    };

    mongoLogin() {
        require('mongoose').connect(`mongodb://${process.env.mongo_pass}:${this.config.mongoDB.port}`, {
            user: this.config.mongoDB.user,
            pass: process.env.mongoDB,
            authSource: this.config.mongoDB.auth,
            dbName: this.config.mongoDB.name
        }).then(() => {
            this.log("Connected to the Mongodb database.", "mngdb");
        }).catch((err) => {
            this.log("Unable to connect to the Mongodb database. Error: " + err, "error");
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
        try {
            const rawCmd = new (require(`./../apps/${this.name}/app/${intType}/${intName}`))(client);
            await rawCmd.load();
            return false;
        } catch (e) {
            return `[HATA] "${intType}" komutu olan "${intName}" yüklenemedi: ${e}`;
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

    updateData() {
        this.models.roles.find({ keyConf: { $exists: true } }).then((docs) => {
            docs.forEach((doc) => {
                this.data.roles[doc.keyConf] = doc.meta.pop()._id;
            });
        });
        this.models.channels.find({ keyConf: { $exists: true } }).then((docs) => {
            docs.forEach((doc) => {
                this.data.channels[doc.keyConf] = doc.meta.pop()._id;
            });
        });
        return this.data;
    }

}
module.exports = Tantoony;
