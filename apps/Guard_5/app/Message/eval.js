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
        const message = interaction.channel.messages.fetch(interaction.targetId);
        function clean(text) {
            if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        }
        try {
            const code = message.content.split(' ').slice(1).join(' ');
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            await message.reply({ content: `${clean(evaled), { code: "xl" }}` });
        } catch (err) {
            message.reply({ content: `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\`` }).then(msg => msg.delete({ timeout: 5000 }));
        }
    }
}

module.exports = EvalMessage;