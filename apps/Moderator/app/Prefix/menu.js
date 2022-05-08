const { DotCommand } = require("../../../../base/utils");
const Discord = require('discord.js');
const { stripIndents } = require("common-tags");
class Eval extends DotCommand {

    constructor(client) {
        super(client, {
            name: "menu",
            description: "sunucunun linkini gönderir",
            usage: "link",
            examples: ["link"],
            cooldown: 300000,
            ownerOnly: true
        });
    }
    async run(client, message, args) {

        const embed_1 = new Discord.MessageEmbed().setColor('#2f3136').setDescription(stripIndents`
        \`!\` Sadece tek bir admin klanında bulunabilirsiniz.
        \`!\` Pando rollerinden sadece 4 tane seçebilirsiniz.

        Ek __Pando Rollerini__ **Pancoin** <:pancoin:828431916369838120> ile almanız mümkün!

        \`*\` Seçtiğiniz oyun rolleri ile deha kolay oyuncu bulabilir veya o oyunla alakalı olan etkinliklerimizden daha hızlı haberdar olabilirsiniz.
        `);
        const embed_2 = new Discord.MessageEmbed().setColor('#2f3136').setDescription(stripIndents`
        \`Rolleri bırakmak için "🗑️" emojisine tıklayınız.\`
        `);

        await message.channel.send({
            content: stripIndents`
            Merhaba sevgili **Asgard**'lı sakinler,
            Sizlerin kolaylıkla rol alması için gördüğünüz bu menüyü oluşturduk.
            `,
            embeds: [
                embed_2
            ],
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "SELECT_MENU",
                            customId: "rol_oyun",
                            placeholder: "Video Oyunları Rolleri",
                            maxValues: 9,
                            minValues: 0,
                            options: [
                                {
                                    label: "League of Legends",
                                    value: "oyun_lol",
                                    emoji: {
                                        name: "oyun_lol",
                                        id: "956800147734536232"
                                    }
                                },
                                {
                                    label: "PUBG",
                                    value: "oyun_pubg",
                                    emoji: {
                                        name: "oyun_pubg",
                                        id: "956800148070101012"
                                    }
                                },
                                {
                                    label: "Valorant",
                                    value: "oyun_valo",
                                    emoji: {
                                        name: "oyun_valo",
                                        id: "956800147751333889"
                                    }
                                },
                                {
                                    label: "GTA V",
                                    value: "oyun_gta",
                                    emoji: {
                                        name: "oyun_gta",
                                        id: "972914955298963546"
                                    }
                                },
                                {
                                    label: "Minecraft",
                                    value: "oyun_mc",
                                    emoji: {
                                        name: "oyun_mc",
                                        id: "972914762633580704"
                                    }
                                },
                                {
                                    label: "Apex Legends",
                                    value: "oyun_apex",
                                    emoji: {
                                        name: "oyun_apex",
                                        id: "972914705381339187"
                                    }
                                },
                                {
                                    label: "Mobile Legends",
                                    value: "oyun_ml",
                                    emoji: {
                                        name: "oyun_ml",
                                        id: "956800147776499762"
                                    }
                                },
                                {
                                    label: "CSGO",
                                    value: "oyun_csgo",
                                    emoji: {
                                        name: "oyun_csgo",
                                        id: "956800147566776411"
                                    }
                                },
                                {
                                    label: "Temizle",
                                    value: "oyun_clear",
                                    emoji: {
                                        name: "🗑️"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "SELECT_MENU",
                            customId: "rol_cekilis",
                            maxValues: 4,
                            minValues: 0,
                            placeholder: "Çekiliş Avcısı Rolleri",
                            options: [
                                {
                                    label: "Spotify Avcısı",
                                    value: "hunt_spotify",
                                    emoji: {
                                        name: "146_spotify",
                                        id: "965676553780494387"
                                    }
                                },
                                {
                                    label: "Nitro Avcısı",
                                    value: "hunt_nitro",
                                    emoji: {
                                        name: "146_nitro",
                                        id: "972917532669399060"
                                    }
                                },
                                {
                                    label: "Netflix Avcısı",
                                    value: "hunt_netflix",
                                    emoji: {
                                        name: "146_netflix",
                                        id: "965676551716888626"
                                    }
                                },
                                {
                                    label: "Temizle",
                                    value: "hunt_clear",
                                    emoji: {
                                        name: "🗑️"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "SELECT_MENU",
                            customId: "rol_katılımcı",
                            maxValues: 5,
                            minValues: 0,
                            placeholder: "Çekiliş Katılımcısı Rolleri",
                            options: [
                                {
                                    label: "Etkinlik Katılımcısı",
                                    value: "sub_etkinlik",
                                    description: "Sunucu içi oyunlardan haberdar ol",
                                    emoji: {
                                        name: "🎉"
                                    }
                                },
                                {
                                    label: "Çekiliş Katılımcısı",
                                    value: "sub_cekilis",
                                    description: "Çekilişlerimizi kaçırma",
                                    emoji: {
                                        name: "🎁"
                                    }
                                },
                                {
                                    label: "Konser Katılımcısı",
                                    value: "sub_konser",
                                    description: "Konsere de bekleriz",
                                    emoji: {
                                        name: "🎵"
                                    }
                                },
                                {
                                    label: "Turnuva Katılımcısı",
                                    value: "sub_turnuva",
                                    description: "İddialı oyuncular buraya da tıklasın",
                                    emoji: {
                                        name: "🏆"
                                    }
                                },
                                {
                                    label: "Temizle",
                                    value: "sub_clear",
                                    emoji: {
                                        name: "🗑️"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "SELECT_MENU",
                            customId: "rol_etkinlik",
                            maxValues: 5,
                            minValues: 0,
                            placeholder: "Sunucu Etkinlikleri Rolleri",
                            options: [
                                {
                                    label: "Vampir Köylü",
                                    value: "etkinlik_vk",
                                    description: "Orda bir köy var Discord'da.."
                                },
                                {
                                    label: "Kırmızı Koltuk",
                                    value: "etkinlik_kk",
                                    description: "Soranlar gizli, dürüstlük zorunlu."
                                },
                                {
                                    label: "Soru Cevap",
                                    value: "etkinlik_sc",
                                    description: "Discord işi doğruluk/cesaret."
                                },
                                {
                                    label: "Tahmin Tuttur",
                                    value: "etkinlik_tt",
                                    description: "DC'yi tersine sevenler için"
                                },
                                {
                                    label: "Temizle",
                                    value: "etkinlik_clear",
                                    emoji: {
                                        name: "🗑️"
                                    }
                                }
                            ]
                        },
                    ]
                },
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "SELECT_MENU",
                            customId: "rol_hobi",
                            maxValues: 8,
                            minValues: 0,
                            placeholder: "İlgi Alanı Rolleri",
                            options: [
                                {
                                    label: "Yazılım",
                                    value: "hobi_yazılım"
                                },
                                {
                                    label: "Müzik",
                                    value: "hobi_müzik"
                                },
                                {
                                    label: "Bilim",
                                    value: "hobi_bilim"
                                },
                                {
                                    label: "Felsefe",
                                    value: "hobi_felsefe"
                                },
                                {
                                    label: "Tasarım",
                                    value: "hobi_tasarım"
                                },
                                {
                                    label: "Tarih",
                                    value: "hobi_tarih"
                                },
                                {
                                    label: "Yabancı Dil",
                                    value: "hobi_dil"
                                },
                                {
                                    label: "Temizle",
                                    value: "hobi_clear",
                                    emoji: {
                                        name: "🗑️"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });

    }

}

module.exports = Eval;
