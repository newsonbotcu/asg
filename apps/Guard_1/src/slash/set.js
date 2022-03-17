const { ApplicationCommand, MessageEmbed } = require('discord.js');

module.exports = class SlashSet extends ApplicationCommand {
    constructor(client, data, guild, guildId) {
        super(client, data = {
            name: "set",
            description: "Data'da id işlemleri",
            default_permission: false,
            options: [
                {
                    name: "rol",
                    description: "bir rol değeri ayarlayın",
                    type: "SUBCOMMAND",
                    options: [
                        {
                            name: "değer",
                            description: "veritabanına girilecek değer",
                            type: "STRING",
                            choices: [
                                {
                                    name: "kayıtsız  rolü",
                                    value: "welcome"
                                },
                                {
                                    name: "erkek rolü",
                                    value: "Male"
                                },
                                {
                                    name: "kız rolü",
                                    value: "Female"
                                },
                                {
                                    name: "üye rolü",
                                    value: "member"
                                },
                                {
                                    name: "cezalı rolü",
                                    value: "prison"
                                },
                                {
                                    name: "muted rolü",
                                    value: "muted"
                                },
                                {
                                    name: "yasaklı tag rolü",
                                    value: "welcome"
                                },
        
                            ],
                            required: true
                        },
                        {
                            name: "rol",
                            description: "sunucu rolü",
                            type: "ROLE",
                            required: true
                        }
                    ]
                },
            ],
            guildId: [guildId]
        }, guild, guildId);
        this.permissions = client.config.staff.slice(5).map(o => {
            return {
                id: o,
                type: "ROLE",
                permission: true
            }
        });
    }
    async run(client, intg) {
        

    }
}