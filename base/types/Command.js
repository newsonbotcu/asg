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
        this.cooldown = new Map();
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


    load(props) {
        this.client.responders.set(`dot:${this.name}`, props);
    }

    unload() {

    }
    
}
module.exports = DotCommand;