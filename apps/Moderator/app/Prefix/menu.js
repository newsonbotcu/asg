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
            cmmChannel: "bot-komut",
            cooldown: 300000
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
                            customId: "menu_oyun",
                            placeholder: "Oyun Rolleri",
                            maxValues: 6,
                            minValues: 0,
                            options: [
                                {
                                    label: "League of Legends",
                                    value: "oyun_lol",
                                    emoji: {
                                        name: "lol",
                                        id: "940032438585933924"
                                    }
                                },
                                {
                                    label: "PUBG",
                                    value: "oyun_pubg",
                                    emoji: {
                                        name: "pubglite",
                                        id: "940032442570534963"
                                    }
                                },
                                {
                                    label: "Valorant",
                                    value: "oyun_valo",
                                    emoji: {
                                        name: "valorantlogo",
                                        id: "940032437851930674"
                                    }
                                },
                                {
                                    label: "GTA V",
                                    value: "oyun_gta",
                                    emoji: {
                                        name: "GTAV",
                                        id: "940032442373373962"
                                    }
                                },
                                {
                                    label: "Minecraft",
                                    value: "oyun_minecraft",
                                    emoji: {
                                        name: "oyun_mc",
                                        id: "940032442138505249"
                                    }
                                },
                                {
                                    label: "Apex",
                                    value: "oyun_apex",
                                    emoji: {
                                        name: "apex",
                                        id: "940032437881294848"
                                    }
                                },
                                {
                                    label: "Mobile Legends",
                                    value: "oyun_ml",
                                    emoji: {
                                        name: "minecraft",
                                        id: "940032442138505249"
                                    }
                                },
                                {
                                    label: "CSGO",
                                    value: "oyun_csgo",
                                    emoji: {
                                        name: "apex",
                                        id: "940032437881294848"
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
                            customId: "menu_cekilis",
                            maxValues: 6,
                            minValues: 0,
                            placeholder: "Katılımcı Rolleri",
                            options: [
                                {
                                    label: "Spotify Avcısı",
                                    value: "katılımcı_konser",
                                    description: "Buluşmalara katılmak istiyorsan buyur",
                                    emoji: {
                                        name: "katilimci_konser",
                                        id: "869301954587803688"
                                    }
                                },
                                {
                                    label: "Nitro Avcısı",
                                    value: "katılımcı_mc",
                                    description: "MC Sunucumuzda katkı sağla",
                                    emoji: {
                                        name: "pandomc",
                                        id: "859934355388497970"
                                    }
                                },
                                {
                                    label: "Netflix Avcısı",
                                    value: "katılımcı_etkinlik",
                                    description: "Dc, vk gibi oyunlar için",
                                    emoji: {
                                        name: "katilimci_etkinlik",
                                        id: "869301953975418940"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "SELECT_MENU",
                    customId: "menu_bildirim",
                    maxValues: 1,
                    minValues: 0,
                    placeholder: "Bildirim Rolleri",
                    options: [
                        {
                            label: "Etkinlik Bildirimleri",
                            value: "burc_boga",
                            emoji: {
                                name: "burc_boga",
                                id: "865090197296513024"
                            }
                        },
                        {
                            label: "Çekiliş Bildirimleri",
                            value: "burc_ikizler",
                            emoji: {
                                name: "burc_ikizler",
                                id: "865090196960968715"
                            }
                        },
                        {
                            label: "Konser Bildirimleri",
                            value: "burc_yengec",
                            emoji: {
                                name: "burc_yengec",
                                id: "865090195598737428"
                            }
                        },
                        {
                            label: "Turnuva Bildirimleri",
                            value: "burc_aslan",
                            emoji: {
                                name: "burc_aslan",
                                id: "865090195337248808"
                            }
                        }
                    ]
                },
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "SELECT_MENU",
                            customId: "etkinlik_secim",
                            maxValues: 7,
                            minValues: 0,
                            placeholder: "Etkinlik Rolleri",
                            options: [
                                {
                                    label: "Vampir Köylü",
                                    value: "etkinlik_vk",
                                    description: "Orda bir köy var Discord'da..",
                                    emoji: {
                                        name: "etkinlik_vk",
                                        id: "869301434594787409"
                                    }
                                },
                                {
                                    label: "Kırmızı Koltuk",
                                    value: "etkinlik_kk",
                                    description: "Soran gizli, dürüstlük zorunlu.",
                                    emoji: {
                                        name: "etkinlik_kk",
                                        id: "869301433579761705"
                                    }
                                },
                                {
                                    label: "Soru Cevap",
                                    value: "etkinlik_sc",
                                    description: "Discord işi doğruluk/cesaret.",
                                    emoji: {
                                        name: "etkinlik_sc",
                                        id: "869301434666086400"
                                    }
                                },
                                {
                                    label: "MC Etkinlikleri",
                                    value: "etkinlik_mc",
                                    description: "MC sunucumuzdan haberdar olun.",
                                    emoji: {
                                        name: "pandomc",
                                        id: "859934355388497970"
                                    }
                                },
                                {
                                    label: "Baskın Etkinlikleri",
                                    value: "etkinlik_baskın",
                                    description: "Baskın zamanında bildirim al.",
                                    emoji: {
                                        name: "pando",
                                        id: "825933532962488361"
                                    }
                                },
                                {
                                    label: "Satranç Etkinlikleri",
                                    value: "etkinlik_satranc",
                                    description: "Satranç turnuvalarımıza katıl.",
                                    emoji: {
                                        name: "piyon",
                                        id: "843288747873140776"
                                    }
                                },
                                {
                                    label: "Zirve Etkinlikleri",
                                    value: "etkinlik_zirve",
                                    description: "Geleneksel Pando zirvelerinde bizimle buluş.",
                                    emoji: {
                                        name: "zirve",
                                        id: "869323496940011520"
                                    }
                                }
                            ]
                        },
                        {
                            type: "ACTION_ROW",
                            components: [
                                {
                                    type: "SELECT_MENU",
                                    customId: "etkinlik_secim",
                                    maxValues: 7,
                                    minValues: 0,
                                    placeholder: "İlgi Alanı Rolleri",
                                    options: [
                                        {
                                            label: "Yazılım",
                                            value: "etkinlik_vk",
                                            description: "Orda bir köy var Discord'da..",
                                            emoji: {
                                                name: "etkinlik_vk",
                                                id: "869301434594787409"
                                            }
                                        },
                                        {
                                            label: "Müzik",
                                            value: "etkinlik_kk",
                                            description: "Soran gizli, dürüstlük zorunlu.",
                                            emoji: {
                                                name: "etkinlik_kk",
                                                id: "869301433579761705"
                                            }
                                        },
                                        {
                                            label: "Bilim",
                                            value: "etkinlik_sc",
                                            description: "Discord işi doğruluk/cesaret.",
                                            emoji: {
                                                name: "etkinlik_sc",
                                                id: "869301434666086400"
                                            }
                                        },
                                        {
                                            label: "Felsefe",
                                            value: "etkinlik_mc",
                                            description: "MC sunucumuzdan haberdar olun.",
                                            emoji: {
                                                name: "pandomc",
                                                id: "859934355388497970"
                                            }
                                        },
                                        {
                                            label: "Tasarım",
                                            value: "etkinlik_baskın",
                                            description: "Baskın zamanında bildirim al.",
                                            emoji: {
                                                name: "pando",
                                                id: "825933532962488361"
                                            }
                                        },
                                        {
                                            label: "Tarih",
                                            value: "etkinlik_satranc",
                                            description: "Satranç turnuvalarımıza katıl.",
                                            emoji: {
                                                name: "piyon",
                                                id: "843288747873140776"
                                            }
                                        },
                                        {
                                            label: "Yabancı Dil",
                                            value: "etkinlik_zirve",
                                            description: "Geleneksel Pando zirvelerinde bizimle buluş.",
                                            emoji: {
                                                name: "zirve",
                                                id: "869323496940011520"
                                            }
                                        }
                                    ]
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
