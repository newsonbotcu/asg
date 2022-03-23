const { ClientEvent } = require('../../../../base/utils');
class VoiceStateUpdate extends ClientEvent {
    constructor(client) {
        super(client);
        this.client = client;
    }
    async run(prev, cur) {
        this.data = this.init();
        const client = this.client;
        const leaves = client.leaves;
        const deleteChnl = client.deleteChnl;
        if (prev && prev.channel && cur && cur.channel && (cur.channel.id === prev.channel.id)) return;
        const privChannels = await client.models.priv_chnl.find();
        const channel = client.guild.channels.cache.get(this.data.channels["oda_olustur"]);
        const gaming = client.guild.channels.cache.get(this.data.channels["game_lobby"]);
        if (prev.channel && privChannels.some(c => c._id === prev.channel.id)) {
            let tyype;
            switch (prev.channel.parentID) {
                case this.data.channels["oda_olustur"]:
                    tyype = "gaming";
                    break;
                case this.data.channels["game_lobby"]:
                    tyype = "private";
                    break;
                default:
                    break;
            }
            const myChannelData = privChannels.find(c => (c.owner === prev.member.user.id) && (c.type === tyype));
            if (myChannelData) {
                const myChannel = prev.guild.channels.cache.get(myChannelData._id);
                if (prev.channel.members.size === 0) {
                    const deleteTimeout = setTimeout(async () => {
                        await client.models.priv_chnl.deleteOne({ _id: prev.channel.id });
                        await prev.channel.delete();
                        deleteChnl.delete(myChannel.id);
                    }, 60000);
                    deleteChnl.set(myChannel.id, deleteTimeout);
                    return;
                }
                if ((prev.member.user.id === myChannelData.owner) && (prev.channel.id === myChannelData._id)) {
                    const myTimeout = setTimeout(async () => {
                        await myChannel.setUserLimit(myChannel.members.size);
                        leaves.delete(myChannel.id);
                    }, 600000);
                    leaves.set(myChannel.id, myTimeout);
                }
            }
        }
        if (cur && cur.channel) {
            let type;
            let creatorChannel;
            switch (cur.channel.id) {
                case this.data.channels["gaming"]:
                    type = "gaming";
                    creatorChannel = gaming;
                    break;
                case this.data.channels["oda_olustur"]:
                    type = "private";
                    creatorChannel = channel;
                    break;
                default:
                    break;
            }
            const myChannelData = privChannels.find(c => c.owner === cur.member.user.id && c.type === type);
            if (myChannelData && (cur.channel.id === myChannelData._id)) {
                clearTimeout(leaves.get(myChannelData._id));
                leaves.delete(myChannelData._id);
            }
            if ((cur.channel.id === channel.id) || (cur.channel.id === gaming.id)) {
                const oldData = await client.models.priv_chnl.findOne({ owner: cur.member.user.id, type: type });
                const privDatas = await client.models.priv_chnl.find({ type: type });
                if (oldData) return await cur.member.voice.setChannel(oldData._id);
                const nueva = await creatorChannel.clone({
                    name: (type === "private" ? "Bigard" : "Game Room") + client.functions.miniNum(privDatas.length + 1),
                    userLimit: 1,
                    permissionOverwrites: [
                        {
                            id: client.guild.roles.everyone.id,
                            allow: [],
                            deny: ["MOVE_MEMBERS"]
                        },
                        {
                            id: cur.member.user.id,
                            allow: ["MOVE_MEMBERS"],
                            deny: []
                        },
                        {
                            id: this.data.roles["musicbots"],
                            allow: ["CONNECT", "MOVE_MEMBERS"],
                            deny: []
                        }
                    ]
                });
                await client.models.priv_chnl.create({ _id: nueva.id, type: type, owner: cur.member.user.id });
                await cur.member.voice.setChannel(nueva.id);
            }
        }
    }
}
module.exports = VoiceStateUpdate;