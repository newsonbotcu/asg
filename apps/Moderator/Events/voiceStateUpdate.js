const { ClientEvent } = require('../../../base/utils');
class VoiceStateUpdate extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "voiceStateUpdate"
        });
        this.client = client;
    }
    async run(prev, cur) {
        const client = this.client;
        const vmute = await this.client.models.penalties.findOne({ type: "VMUTE", userId: cur.member.user.id, until: { $gt: new Date() } });
        if (vmute && !cur.serverMute) {
            await cur.setMute(true);
        }
        if (prev && cur && prev.selfMute && !cur.selfMute) {
            let uCooldown = client.trollwait[cur.member.user.id];
            if (!uCooldown) {
                client.trollwait[cur.member.user.id] = {};
                uCooldown = client.trollwait[cur.member.user.id];
            };
            let time = uCooldown[cur.channel.id] || 0;
            if (time && (time > Date.now())) {
                let uCount = client.trollcounts[cur.member.user.id];
                if (!uCount) {
                    this.client.trollcounts[cur.member.user.id] = {};
                    uCount = this.client.trollcounts[cur.member.user.id];
                };
                let count = uCount[cur.channel.id] || 0;
                if (count === 3) await cur.guild.channels.cache.get(this.data.channels["stat-warn"]).send(`${cur.member} Mikrofonun açıp kapamaya devam edersen sesli kanallardan susturulacaksın.`);
                if (count === 7) {
                    client.handler.emit("vmute", cur.member, this.client.user.id, "MIC-BUG", 5);
                    await cur.guild.channels.cache.get(this.data.channels["stat-warn"]).send(`${cur.member} Mikrofonunu çok fazla açıp kapattığın için 5 dakika mutelendin!`);
                }
                this.client.trollcounts[cur.member.user.id][cur.channel.id] = count + 1;
            }
            this.client.trollwait[cur.member.user.id][cur.channel.id] = Date.now() + 3000;
        }
        await this.client.models.voice.create({
            channelId: cur.channelId,
            userId: cur.member.user.id,
            self_mute: cur.selfMute,
            self_deaf: cur.selfDeaf,
            server_mute: cur.serverMute,
            server_deaf: cur.serverDeaf,
            streaming: cur.streaming,
            webcam: cur.selfVideo
        });
    }
}
module.exports = VoiceStateUpdate;