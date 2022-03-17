const { Schema, model } = require('mongoose');

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

module.exports = {
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