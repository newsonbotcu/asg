const { AppMessageCommand } = require("../../../../base/utils");
class EvalMessage extends AppMessageCommand {
    constructor(client) {
        super(client, {
            name: "eval",
            description: "",
            customId: "eval",
            cooldown: 5000,
            enabled: true,
            ownerOnly: true
        });
    }
    async run(client, interaction) {
        if (interaction.user.id !== client.owner.id) return;
        const message = await interaction.channel.messages.fetch(interaction.targetId);
        function clean(text) {
            if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        }
        try {
            //const code = message.content.split(' ').slice(1).join(' ');
            let evaled = eval(message.content);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            await interaction.reply(clean(evaled), { code: "xl" }, { ephemeral: true });
        } catch (err) {
            interaction.reply({ content: `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\`` });
        }
    }
}

module.exports = EvalMessage;