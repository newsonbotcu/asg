const {
    MessageButton,
    MessageSelectMenu,
    ApplicationCommand,
    Collection
} = require('discord.js');
const { Schema, model, Types } = require('mongoose');

class ClientEvent {
    constructor(client, {
        name = null, audit = null
    }) {
        this.client = client;
        this.name = name;
        this.cooldown = new Collection();
        this.allow = [];
        this.audit = audit;
        this.data = {
            emojis: {}, roles: {}, channels: {}, other: {}, mash: (...values) => {
                let temp = [];
                for (let i = 0; i < values.length; i++) {
                    const value = values[i];
                    temp.concat(value);
                }
                return temp;
            }
        }
    }

    exec(...args) {
        this.client.models.key_config.find()
            .then((docs) => {
                docs.forEach((doc) => {
                    switch (doc.type) {
                        case "ROLE":
                            this.data.roles[doc.name] = doc.values;
                            break;
                        case "CHANNEL":
                            this.data.channels[doc.name] = doc.values;
                            break;
                        case "EMOJI":
                            this.data.emojis[doc.name] = doc.values;
                            break;
                        case "OTHER":
                            this.data.other[doc.name] = doc.values;
                            break;
                        default:
                            break;
                    }
                });
            });
        if (!this.run) return;
        if (this.audit) {
            this.audit = this.client.guild.fetchAuditLogs({ type: this.audit })
                .then(logs => logs.entries.first());
            this.client.models.exep.find({ audit: this.audit.action, event: this.name })
                .then()
        }
        try {
            this.run(...args);
        } catch (error) {
            this.client.log(error, this.name);
        }
    }

}

class SlashCommand extends ApplicationCommand {
    constructor(client, {
        name = null,
        description = null,
        customId = null,
        disabled = false,
        dirname = null,
        intChannel = null,
        cooldown = new Map(),
        enabled = true,
        time = 3000,
        options: []
    }) {
        super(client, {
            id: customId,
            type: "CHAT_INPUT",
            application_id: client.application.id,
            guild_id: client.guild.id,
            name: name,
            description: description,
            options: options,
            default_permission: false,
        }, client.guild, client.guild.id);
        this.client = client;
        this.props = {
            name, dirname, intChannel, cooldown, enabled, time
        };
        this.customId = customId;
        this.style = style;
        this.emoji = emoji;
        this.url = url;
        this.disabled = disabled;
        this.perms = this.exec();
    }

    exec() {
        return this.client.models.cmd_perms.findOne({ cmd_type: "SLASH", _id: this.customId })
            .then((doc) => {
                return doc.permissions;
            });
    }

}

class ButtonCommand extends MessageButton {
    constructor(client, {
        name = null,
        label = null,
        customId = null,
        style = "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK",
        emoji = null,
        url = null,
        disabled = false,
        isconst = false,
        dirname = null,
        intChannel = null,
        cooldown = 5000,
        enabled = true
    }) {
        super({
            label, customId, style, emoji, url, disabled
        })
        this.client = client;
        this.props = {
            name, type, dirname, intChannel, cooldown, enabled, isconst
        };
        this.info = {
            label, customId, style, emoji, url, disabled
        };
        this.perms = [];
    }

    loadPerms() {
        this.client.models.cmd_perms.findOne({ cmd_type: "BUTTON", _id: this.customId })
            .then(doc => {
                this.props.perms = doc.permissions;
            });
        return this.perms;
    }

}

class MenuCommand extends MessageSelectMenu {
    constructor(client, {
        custom_id = null, options = [], placeholder = null, min_values = 0, max_values = 0, disabled = false,
    }) {
        super({
            custom_id, options, placeholder, min_values, max_values, disabled
        });
        this.client = client;

    }
}

class AppUserCommand extends ApplicationCommand {
    constructor(client, {
        name = null,
        description = null,
        customId = null,
        options = [],
        disabled = false,
        dirname = null,
        intChannel = null,
        cooldown = 5000,
        enabled = true
    }) {
        super(client, {
            id: customId,
            type: "USER",
            application_id: client.application.id,
            guild_id: client.guild.id,
            name: name,
            description: description,
            options: options,
            default_permission: false,
        }, client.guild, client.guild.id);
        this.client = client;
        this.props = {
            name, dirname, intChannel, cooldown, enabled, isconst
        };
        this.label = label;
        this.customId = customId;
        this.style = style;
        this.emoji = emoji;
        this.url = url;
        this.disabled = disabled;
        this.perms = [];
    }
}

class AppMessageCommand extends ApplicationCommand {
    constructor(client, {
        name = null,
        description = null,
        customId = null,
        options = [],
        disabled = false,
        dirname = null,
        intChannel = null,
        cooldown = 5000,
        enabled = true
    }) {
        super(client, {
            id: customId,
            type: "MESSAGE",
            application_id: client.application.id,
            guild_id: client.guild.id,
            name: name,
            description: description,
            options: options,
            default_permission: false,
        }, client.guild, client.guild.id);
        this.client = client;
        this.props = {
            name, dirname, intChannel, cooldown, enabled, isconst
        };
        this.label = label;
        this.customId = customId;
        this.style = style;
        this.emoji = emoji;
        this.url = url;
        this.disabled = disabled;
        this.perms = [];
    }
}

class DotCommand {
    constructor(client, {
        name = null,
        description = "Açıklama Belirtilmemiş",
        usage = "Kullanım Belirtilmemiş",
        examples = [],
        dirname = null,
        category = "Diğer",
        aliases = [],
        cmdChannel = null,
        accaptedPerms = [],
        cooldown = 5000,
        enabled = true,
        ownerOnly = false,
        rootOnly = false,
        onTest = false,
        adminOnly = false,
        dmCmd = false
    }) {
        this.client = client;
        this.config = {
            dirname, enabled, ownerOnly, rootOnly, onTest, adminOnly, dmCmd
        };
        this.info = {
            name, description, usage, examples, category, aliases, cmdChannel, accaptedPerms, cooldown
        };
    }
    load(props) {
        this.client.responders.set(`dot:${this.name}`, props);
    }
}


function dateTimePad(value, digits) {
    let number = value
    while (number.toString().length < digits) {
        number = "0" + number
    }
    return number;
}

function format(tDate) {
    return (tDate.getFullYear() + "-" + dateTimePad((tDate.getMonth() + 1), 2) + "-" + dateTimePad(tDate.getDate(), 2) + " " + dateTimePad(tDate.getHours(), 2) + ":" + dateTimePad(tDate.getMinutes(), 2) + ":" + dateTimePad(tDate.getSeconds(), 2) + "." + dateTimePad(tDate.getMilliseconds(), 3))
}

const models = {
    membership: model("role_init", new Schema({
        _id: String, roles: Array
    }, { _id: false })), key_config: model("key_config", new Schema({
        _id: Types.ObjectId, type: String, name: String, values: Array, deleted: Boolean
    })), exep: model("guard_exeption", new Schema({
        _id: Types.ObjectId,
        userId: String,
        executor: String,
        case: String,
        audit: String,
        event: String,
        count: Number,
        until: Date,
        created: Date,
        start: Boolean
    })), afk_inbox: model("afk_inbox", new Schema({
        _id: String, reason: String, created: Date, inbox: Array
    }, { _id: false })), cmd_perms: model("cmd_perms", new Schema({
        _id: Types.ObjectId, cmd_id: String, type: String, permission: Boolean
    })),
    roles: model("data_roles", new Schema({
        roleId: String,
        name: String,
        color: String,
        hoist: Boolean,
        mentionable: Boolean,
        rawPosition: Number,
        bitfield: String,
        aliases: Array
    })), overwrites: model("data_overwrites", new Schema({
        _id: Types.ObjectId, channel: String, subjecType: String, subjectId: String, allow: Array, deny: Array
    })), category: model("data_categories", new Schema({
        _id: String, name: String, position: Number, children: Array
    }, { _id: false })), textChannel: model("data_textChannels", new Schema({
        _id: String, name: String, nsfw: Boolean, parentID: String, position: Number, rateLimit: Number
    }, { _id: false })), voiceChannels: model('data_voiceChannels', new Schema({
        _id: String, name: String, bitrate: Number, parentID: String, position: Number
    }, { _id: false })), penal: model('penalty', new Schema({
        _id: Types.ObjectId,
        userId: String,
        executor: String,
        reason: String,
        type: String,
        extras: Array,
        until: Date,
        created: Date
    })), cmd: model("log_cmd", new Schema({
        _id: Types.ObjectId, cmd: String, executorId: String, args: String, resp: String
    })), action: model("log_action", new Schema({
        _id: Types.ObjectId,
        auditId: String,
        type: String,
        target: String,
        targetId: String,
        targetType: String,
        action: String,
        actionType: String,
        extra: Object,
        reason: String,
        data: Object,
        executorId: String,
        changes: Array,
        created: Date
    })), //
    voice: model("log_voice", new Schema({
        _id: Types.ObjectId, userId: String, channelId: String, connected: Boolean, status: Array, created: Date
    })), //
    nick: model("log_nick", new Schema({
        _id: Types.ObjectId, userId: String, nick: String, claimer: String, created: Date
    })), warp: model("log_warp", new Schema({
        _id: Types.ObjectId, user: String, job: String, data: String, created: Date
    })), //
    inv: model("log_invite", new Schema({
        _id: Types.ObjectId, inviter: String, invited: String, created: Date, isFirst: Boolean
    })), insult: model("log_insult", new Schema({
        _id: Types.ObjectId, author: String, message: String, created: Date
    })), registry: model("log_registry", new Schema({
        _id: Types.ObjectId,
        user: String,
        executor: String,
        name: String,
        age: Number,
        gender: String,
        created: Date,
        gone: Date
    }))
}

const functions = {
    comparedate(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff);
        return days;
    }, checkSecs(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 1000);
        return days / 60;
    }, checkMins(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let secs = Math.floor(diff / 60000);
        return secs;
    }, sortByKey(array, key) {
        return array.sort(function (a, b) {
            let x = a[key];
            let y = b[key];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    }, shuffle(pArray) {
        let array = [];
        pArray.forEach(element => array.push(element));
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }, randomNum(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }, rain(client, sayi) {
        const emojis = low(client.adapters('emojis'))
            .get("numbers");
        var basamakbir = sayi.toString()
            .replace(/ /g, "     ");
        var basamakiki = basamakbir.match(/([0-9])/g);
        basamakbir = basamakbir.replace(/([a-zA-Z])/g, "bilinmiyor")
            .toLowerCase();
        if (basamakiki) {
            basamakbir = basamakbir.replace(/([0-9])/g, d => {
                return {
                    "0": emojis.sfr,
                    "1": emojis.bir,
                    "2": emojis.iki,
                    "3": emojis.uch,
                    "4": emojis.drt,
                    "5": emojis.bes,
                    "6": emojis.alt,
                    "7": emojis.ydi,
                    "8": emojis.sks,
                    "9": emojis.dkz
                }[d];
            });
        }
        return basamakbir;
    }, sayi(number) {
        var reg = new RegExp("^\\d+$");
        var valid = reg.test(numbdate1er);
        return valid;
    }, checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days;
    }, checkHours(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 3600000);
        return days;
    }, log(content, type = "log") {
        const date = `[${format(new Date(Date.now()))}]:`;
        console.log(`${date}[${type.toUpperCase()}] ~ :${content} `);
    }
}

module.exports = {
    ButtonCommand,
    DotCommand,
    SlashCommand,
    MenuCommand,
    AppUserCommand,
    AppMessageCommand,
    ClientEvent,
    functions,
    models
}
