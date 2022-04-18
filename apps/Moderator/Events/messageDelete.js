const { MessageEmbed } = require('discord.js');
class MessageDelete {
    constructor(client) {
        this.client = client;
    };
    async run(message) {
        const client = this.client;
        if (!message.guild) return;
        if (message.guild.id !== client.config.server) return;
        const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(logs => logs.entries.first());
        if (entry.executor.bot) return;
        const embed = new MessageEmbed().setColor((entry.createdTimestamp < Date.now() - 1000) ? "#2f3136" : "RED").setDescription(`Mesajın içeriği:\n\`\`\`${message.content}\`\`\``).setTitle("Bir mesaj silindi").addField("Yazarı:", message.author, true);
        if ((entry.createdTimestamp > Date.now() - 1000) && (entry.executor.id !== message.author.id)) {
            return message.guild.channels.cache.get(data.channels["mesajlog"]).send(embed.addField("Silen Kişi", entry.executor, true).addField("Kanal", message.channel, true));
        } else {
            return message.guild.channels.cache.get(data.channels["mesajlog"]).send(embed.addField("Kanal", message.channel, true));
        }




    }
}
module.exports = MessageDelete;
