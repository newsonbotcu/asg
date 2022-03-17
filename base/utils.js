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
};
function checkSecs(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 1000);
    return days / 60;
};
function checkMins(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let secs = Math.floor(diff / 60000);
    return secs;
};
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
};
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};
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
};
function sayi(anan) {
    var reg = new RegExp("^\\d+$");
    var valid = reg.test(anan);
    return valid;
};
function checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days;
};
function checkHours(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 3600000);
    return days;
};
module.exports = {
    ButtonCMD,
    DefaultCMD,
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
};