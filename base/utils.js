const { bgBlue, black, green } = require("chalk");
const { Schema, model } = require('mongoose');

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
function log(content, type = "log") {
    const date = `[${format(new Date(Date.now()))}]:`;
    switch (type) {
        case "log": {
            return console.log(`${date} ${bgBlue(type.toUpperCase())} ${content} `);
        }
        case "warn": {
            return console.log(`${date} ${black.bgHex('#D9A384')(type.toUpperCase())} ${content} `);
        }
        case "error": {
            return console.log(`${date} ${black.bgHex('#FF0000')(type.toUpperCase())} ${content} `);
        }
        case "debug": {
            return console.log(`${date} ${green(type.toUpperCase())} ${content} `);
        }
        case "cmd": {
            return console.log(`${date} ${black.bgHex('#8dbe85')(type.toUpperCase())} ${content}`);
        }
        case "ready": {
            return console.log(`${date} ${black.bgHex('#48D09B')(type.toUpperCase())} ${content}`);
        }
        case "complete": {
            return console.log(`${date} ${black.bgHex('#CCFFCC')(type.toUpperCase())} ${content}`);
        }
        case "docs": {
            return console.log(`${date} ${black.bgHex('#A9D4D9')(type.toUpperCase())} ${content}`);
        }
        case "mngdb": {
            return console.log(`${date} ${black.bgHex('#F9D342')(type.toUpperCase())} ${content}`);
        }
        case "reconnecting": {
            return console.log(`${date} ${black.bgHex('#133729')(type.toUpperCase())} ${content}`);
        }
        case "disconnecting": {
            return console.log(`${date} ${black.bgHex('#782020')(type.toUpperCase())} ${content}`);
        }
        case "load": {
            return console.log(`${date} ${black.bgHex('#7B78B4')(type.toUpperCase())} ${content}`);
        }
        case "varn": {
            return console.log(`${date} ${black.bgHex('#EEA2AD')(type.toUpperCase())} ${content}`);
        }
        case "caution": {
            return console.log(`${date} ${black.bgHex('#FF0000')(type.toUpperCase())} ${content}`);
        }
        case "category": {
            return console.log(`${date} ${black.bgHex('#E8D4A9')(type.toUpperCase())} ${content}`);
        }
        default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
    }
}

class CliEvent {
    constructor(client) {
        this.client = client;
        (() => {
            this.init().then((res) => {
                this.data = res;
            })
        })()
    }

    async init() {
        const idConf = await this.client.models.marked_ids.find();
        return {
            roles: idConf.filter(item => item.type === "ROLE"),
            channels: idConf.filter(item => item.type === "CHANNEL"),
            emojis: idConf.filter(item => item.type === "EMOJI"),
            other: idConf.filter(item => item.type === "OTHER")
        }
    }
}

class ButtonCMD {
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
}

class DefaultCMD {
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
}
function comparedate(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff);
    return days;
}
function checkSecs(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 1000);
    return days / 60;
}
function checkMins(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let secs = Math.floor(diff / 60000);
    return secs;
}
function sortByKey(array, key) {
    return array.sort(function (a, b) {
        let x = a[key];
        let y = b[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}
function shuffle(pArray) {
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
}
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function rain(client, sayi) {
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
}
function sayi(number) {
    var reg = new RegExp("^\\d+$");
    var valid = reg.test(number);
    return valid;
}
function checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days;
}
function checkHours(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 3600000);
    return days;
}


/*
const identity = model('identity', new Schema({
    _id: String,        // Kullanıcı id
    name: String,       // Geçmiş isim listesi
    age: Number,        // Geçmiş yaş listesi
    sex: String,        // Cinsiyet
    roles: Array,       // Rolleri
    passer: String,     // Kayıt eden
    tagger: String,     // Tag aldıran
    afk: Boolean,       // Away durum
    notes: Array,       // Away notu/süresi
    crimes: Array,      // Sicil
    voiceDocs: Array,   // Ses dökümantasyonu
    msgDocs: Array,     // Mesaj dökümantasyonu
    invites: Array,     // Davetleri
    created: Date,      // Identity oluşturulma tarihi
}, { _id: false }));
*/
const afk = model('afk', new Schema({
    _id: String,
    reason: String,
    created: Date,
    inbox: Array
}, { _id: false }));
const bc_cat = model('backup_cc', new Schema({
    _id: String,
    name: String,
    position: Number
}, { _id: false }));
const bc_ovrts = model('backup_overwrite', new Schema({
    _id: String,
    overwrites: Array
}, { _id: false }));
const bc_role = model('backup_role', new Schema({
    _id: String,
    name: String,
    color: String,
    hoist: Boolean,
    mentionable: Boolean,
    rawPosition: Number,
    bitfield: Number
}, { _id: false }));
const bc_text = model('backup_tc', new Schema({
    _id: String,
    name: String,
    nsfw: Boolean,
    parentID: String,
    position: Number,
    rateLimit: Number
}, { _id: false }));
const bc_voice = model('backup_vc', new Schema({
    _id: String,
    name: String,
    bitrate: Number,
    parentID: String,
    position: Number
}, { _id: false }));
const ban = model('mod_ban', new Schema({
    _id: String,
    executor: String,
    reason: String,
    type: String,
    duration: Number,
    note: String,
    created: Date
}, { _id: false }));
const cmute = model('mod_cmute', new Schema({
    _id: String,
    type: String,
    reason: String,
    executor: String,
    duration: Number,
    created: Date
}, { _id: false }));
const vmute = model('mod_vmute', new Schema({
    _id: String,
    type: String,
    reason: String,
    executor: String,
    duration: Number,
    created: Date
}, { _id: false }));
const jail = model('mod_jail', new Schema({
    _id: String,
    executor: String,
    reason: String,
    roles: Array,
    type: String,
    duration: Number,
    note: String,
    created: Date
}, { _id: false }));

const taggeds = model('stat_tagged', new Schema({
    _id: String,
    records: Array
}, { _id: false }));
const voiceData = model('stat_voice', new Schema({
    _id: String,
    records: Array
}, { _id: false }));
const invData = model('stat_invite', new Schema({
    _id: String,
    records: Array
}, { _id: false }));
const crimeData = model('stat_crime', new Schema({
    _id: String,
    records: Array
}, { _id: false }));
const msgData = model('stat_msg', new Schema({
    _id: String,
    records: Array
}, { _id: false }));

const members = model('identity', new Schema({
    _id: String,
    executor: String,
    created: Date,
    name: String,
    age: Number,
    sex: String
}, { _id: false }));

const perms = model('permit', new Schema({
    _id: String,
    user: String,
    executor: String,
    count: Number,
    type: String,
    effect: String,
    created: Date,
    time: Number
}, { _id: false }));

const mem_roles = model('backup_member', new Schema({
    _id: String,
    roles: Array
}, { _id: false }));

const marked_ids = model('marked', new Schema({
    _id: String,
    type: String,
    value: String
}), { _id: false });

module.exports = {
    ButtonCMD,
    DefaultCMD,
    CliEvent,
    log
}

exports.models = {
    marked_ids,
    perms,
    afk,
    bc_cat,
    bc_ovrts,
    bc_role,
    bc_text,
    bc_voice,
    mem_roles,
    ban,
    cmute,
    vmute,
    jail,
    taggeds,
    voiceData,
    invData,
    crimeData,
    msgData,
    members
}

exports.fuctions = {
    comparedate,
    checkDays,
    checkHours,
    checkMins,
    checkSecs,
    comparedate,
    sayi,
    shuffle,
    rain,
    randomNum,
    sortByKey
}