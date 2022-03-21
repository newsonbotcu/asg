const {
    MessageButton, MessageSelectMenu, ApplicationCommand, CommandInteraction,
    ButtonInteraction, SelectMenuInteraction, UserContextMenuInteraction,
    MessageContextMenuInteraction, Message
} = require('discord.js');
const { Schema, model, Types } = require('mongoose');
const Tantoony = require('./Tantoony');

class ClientEvent {
    /**
     * @param {Tantoony} client
     */
    constructor(client, {
        name = null,
        allow = [],
        audit = null
    }) {
        this.name = name;
        this.allow = allow;
        this.audit = audit;
        this.client = client;
        this.data = {
            emojis: {},
            roles: {},
            channels: {},
            other: {}
        }
        this.loadNarks();
    }

    loadMarks(type) {
        this.audit = client.guild.fetchAuditLogs({ type: audit }).then(logs => logs.entries.first());
        this.client.models.marked_ids.find(type ? { type } : {}).then(docs => {
            docs.forEach(doc => {
                switch (doc.type) {
                    case "ROLE":
                        this.data.roles[doc._id] = doc.value;
                        break;
                    case "CHANNEL":
                        this.data.channels[doc._id] = doc.value;
                        break;
                    case "EMOJI":
                        this.data.emojis[doc._id] = doc.value;
                        break;
                    case "OTHER":
                        this.data.other[doc._id] = doc.value;
                        break;
                    default: break;
                }
            });
        });
        return this.data;
    }

    async mount() {
        client.models.exep.findOne({ user: this.audit.executor.id, type: "overwrite", effect: "channel" });
    }
}

class SlashCommand extends ApplicationCommand {
    /**
     * @param {Tantoony} client
     */
    constructor(client, {
        name = null,
        description = null,
        customId = null,
        options = [],
        disabled = false,
        dirname = null,
        IntChannel = null,
        cooldown = 5000,
        enabled = true
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
            name,
            dirname,
            IntChannel,
            cooldown,
            enabled,
            isconst
        };
        this.label = label;
        this.customId = customId;
        this.style = style;
        this.emoji = emoji;
        this.url = url;
        this.disabled = disabled;
        this.perms = [];
    }

    loadPerms() {
        this.client.models.cmd_perms.findOne({ cmd_type: "BUTTON", _id: this.customId }).then(doc => {
            this.props.perms = doc.permissions;
        });
        return this.perms;
    }
    /**
     * 
     * @param {Tantoony} client "Extenden class for this bot"
     * @param {CommandInteraction} interaction "the response"
     * @param data "USEFUL!"
     * 
     */
    async run(client, interaction, data) { }

}
class ButtonCommand extends MessageButton {
    /**
     * @param {Tantoony} client
     */
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
        IntChannel = null,
        cooldown = 5000,
        enabled = true
    }) {
        super({
            label,
            customId,
            style,
            emoji,
            url,
            disabled
        })
        this.client = client;
        this.props = {
            name,
            type,
            dirname,
            IntChannel,
            cooldown,
            enabled,
            isconst
        };
        this.info = {
            label,
            customId,
            style,
            emoji,
            url,
            disabled
        };
        this.perms = [];
    }

    loadPerms() {
        this.client.models.cmd_perms.findOne({ cmd_type: "BUTTON", _id: this.customId }).then(doc => {
            this.props.perms = doc.permissions;
        });
        return this.perms;
    }
    /**
     * 
     * @param {Tantoony} client "Extenden class for this bot"
     * @param {ButtonInteraction} interaction "the response"
     * @param data "USEFUL!"
     */
    async run(client, interaction, data) { }


}

class MenuCommand extends MessageSelectMenu {
    /**
     * @param {Tantoony} client
     */
    constructor(client, {
        custom_id = null,
        options = [],
        placeholder = null,
        min_values = 0,
        max_values = 0,
        disabled = false,
    }) {
        super({
            custom_id,
            options,
            placeholder,
            min_values,
            max_values,
            disabled
        });
        this.client = client;

    }
    /**
     * 
     * @param {Tantoony} client "Extenden class for this bot"
     * @param {SelectMenuInteraction} interaction "the response"
     * @param data "USEFUL!"
     */
    async run(client, interaction, data) { }

}

class AppUserCommand extends ApplicationCommand {
    /**
     * @param {Tantoony} client
     */
    constructor(client, {
        name = null,
        description = null,
        customId = null,
        options = [],
        disabled = false,
        dirname = null,
        IntChannel = null,
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
            name,
            dirname,
            IntChannel,
            cooldown,
            enabled,
            isconst
        };
        this.label = label;
        this.customId = customId;
        this.style = style;
        this.emoji = emoji;
        this.url = url;
        this.disabled = disabled;
        this.perms = [];
    }
    /**
     * 
     * @param {Tantoony} client "Extenden class for this bot"
     * @param {UserContextMenuInteraction} interaction "the response"
     * @param data "USEFUL!"
     */
    async run(client, interaction, data) { }
}

class AppMessageCommand extends ApplicationCommand {
    /**
     * @param {Tantoony} client
     */
    constructor(client, {
        name = null,
        description = null,
        customId = null,
        options = [],
        disabled = false,
        dirname = null,
        IntChannel = null,
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
            name,
            dirname,
            IntChannel,
            cooldown,
            enabled,
            isconst
        };
        this.label = label;
        this.customId = customId;
        this.style = style;
        this.emoji = emoji;
        this.url = url;
        this.disabled = disabled;
        this.perms = [];
    }
    /**
     * 
     * @param {Tantoony} client "Extenden class for this bot"
     * @param {MessageContextMenuInteraction} interaction "the response"
     * @param data "USEFUL!"
     */
    async run(client, interaction, data) { }
}
class PrefixCommand {
    /**
     * @param {Tantoony} client
     */
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
            dirname,
            enabled,
            ownerOnly,
            rootOnly,
            onTest,
            adminOnly,
            dmCmd
        };
        this.info = {
            name,
            description,
            usage,
            examples,
            category,
            aliases,
            cmdChannel,
            accaptedPerms,
            cooldown
        };
    }
    /**
     * 
     * @param {Tantoony} client "Extenden class for this bot"
     * @param {Message} message "the message"
     * @param {string[]} args "USEFUL!"
     * @param data "USEFUL!!!!!"
     */
    async run(client, message, args, data) {
        return;
    }

    load(props) {
        this.client.responders.set(`dot:${this.name}`, props);
    }
}

module.exports = {
    ButtonCommand,
    PrefixCommand,
    SlashCommand,
    MenuCommand,
    AppUserCommand,
    AppMessageCommand,
    ClientEvent
}


function dateTimePad(value, digits) {
    let number = value
    while (number.toString().length < digits) {
        number = "0" + number
    }
    return number;
}
function format(tDate) {
    return (tDate.getFullYear() + "-" +
        dateTimePad((tDate.getMonth() + 1), 2) + "-" +
        dateTimePad(tDate.getDate(), 2) + " " +
        dateTimePad(tDate.getHours(), 2) + ":" +
        dateTimePad(tDate.getMinutes(), 2) + ":" +
        dateTimePad(tDate.getSeconds(), 2) + "." +
        dateTimePad(tDate.getMilliseconds(), 3))
}

exports.models = {
    conf: {
        key_config: model("key_config", new Schema({
            _id: Types.ObjectId,
            type: String,
            name: String,
            value: String,
            deleted: Boolean
        })),
        exep: model("guard_exeption", new Schema({
            _id: Types.ObjectId,
            userId: String,
            executor: String,
            case: String,
            audit: String,
            event: String,
            count: Number,
            until: Date,
            created: Date,
            queued: Boolean
        })),
        membership: model("membership", new Schema({
            _id: String,
            records: Array,
            roles: Array
        }, { _id: false })),
        afk_inbox: model("afk_inbox", new Schema({
            _id: String,
            reason: String,
            created: Date,
            inbox: Array
        }, { _id: false })),
        cmd_perms: model("cnd_perms", new Schema({
            _id: Types.ObjectId,
            id: String,
            type: String,
            permission: Boolean
        }))
    },
    data: {
        roles: model("data_roles", new Schema({
            _id: Types.ObjectId,
            roleId: String,
            name: String,
            color: String,
            hoist: Boolean,
            mentionable: Boolean,
            rawPosition: Number,
            bitfield: Number,
            aliases: Array
        })),
        overwrites: model("data_overwrites", new Schema({
            _id: Types.ObjectId,
            channel: String,
            subjecType: String,
            subjectId: String,
            allow: Array,
            deny: Array
        })),
        category: model("data_categories", new Schema({
            _id: String,
            name: String,
            position: Number,
            children: Array
        }, { _id: false })),
        textChannel: model("data_textChannels", new Schema({
            _id: String,
            name: String,
            nsfw: Boolean,
            parentID: String,
            position: Number,
            rateLimit: Number
        }, { _id: false })),
        voiceChannels: model('data_voiceChannels', new Schema({
            _id: String,
            name: String,
            bitrate: Number,
            parentID: String,
            position: Number
        }, { _id: false }))
    },
    mod: {
        ban: model('mod_ban', new Schema({
            _id: String,
            executor: String,
            reason: String,
            perma: Boolean,
            until: Number,
            note: String,
            created: Date,
            options: Object
        }, { _id: false })),
        cmute: model('mod_cmute', new Schema({
            _id: String,
            reason: String,
            executor: String,
            duration: Number,
            until: Date,
            created: Date,
            note: String
        }, { _id: false })),
        vmute: model('mod_vmute', new Schema({
            _id: String,
            reason: String,
            executor: String,
            duration: Number,
            until: Date,
            created: Date,
            note: String
        }, { _id: false })),
        jail: model('mod_jail', new Schema({
            _id: String,
            executor: String,
            reason: String,
            roles: Array,
            type: String,
            duration: Number,
            note: String,
            created: Date
        }, { _id: false })),
        penal: model('mod_penal', new Schema({
            _id: Types.ObjectId,
            userId: String,
            executor: String,
            reason: String,
            type: String,
            extra: Array,
            note: String,
            until: Date,
            created: Date
        })),
    },
    logs: {
        cmd: model("log_cmd", new Schema({
            _id: Types.ObjectId,
            cmd: String,
            executorId: String,
            args: String,
            resp: String
        })),
        action: model("log_action", new Schema({
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
        })),
        voice: model("log_voice", new Schema({
            _id: Types.ObjectId,
            userId: String,
            channelId: String,
            connected: Boolean,
            status: Array,
            created: Date
        })),
        nick: model("log_nick", new Schema({
            _id: Types.ObjectId,
            userId: String,
            nick: String,
            claimer: String,
            created: Date
        })),
        warp: model("log_warp", new Schema({
            _id: Types.ObjectId,
            user: String,
            job: String,
            data: String,
            created: Date
        })),
        inv: model("log_inv", new Schema({
            _id: Types.ObjectId,
            inviter: String,
            invited: String,
            created: Date,
            firstTime: Boolean
        })),
        insult: model("log_insult", new Schema({
            _id: Types.ObjectId,
            author: String,
            message: String,
            created: Date
        })),
        registry: model("log_registry", new Schema({
            _id: Types.ObjectId,
            user: String,
            executor: String,
            gender: String,
            created: Date,
            gone: Date
        })),
    }
}

exports.fuctions = {
    comparedate(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff);
        return days;
    },
    checkSecs(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 1000);
        return days / 60;
    },
    checkMins(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let secs = Math.floor(diff / 60000);
        return secs;
    },
    sortByKey(array, key) {
        return array.sort(function (a, b) {
            let x = a[key];
            let y = b[key];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    },
    shuffle(pArray) {
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
    },
    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    rain(client, sayi) {
        const emojis = low(client.adapters('emojis')).get("numbers").value();
        var basamakbir = sayi.toString().replace(/ /g, "     ");
        var basamakiki = basamakbir.match(/([0-9])/g);
        basamakbir = basamakbir.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase();
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
    },
    sayi(number) {
        var reg = new RegExp("^\\d+$");
        var valid = reg.test(number);
        return valid;
    },
    checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days;
    },
    checkHours(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 3600000);
        return days;
    },
    log(content, type = "log") {
        const date = `[${format(new Date(Date.now()))}]:`;
        return console.log(`${date}[${type.toUpperCase()}] ~ :${content} `);
    }
}