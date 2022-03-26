const Command = require("../../../Base/Command");
const low = require('lowdb');
const Discord = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');
const path = require('path');
const percent = require("stuffs/lib/percent");
const makeSureFolderExists = require("stuffs/lib/makeSureFolderExists");
const randomString = require("stuffs/lib/randomString");
const execAsync = require("util").promisify(require("child_process").exec);
const os = require("os");
const Roles = require("../../../../../BASE/yetkiroles.json")
class Kur extends Command {

    constructor(client) {
        super(client, {
            name: "gifstat",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: ["gifstat"],
            acceptedRoles: ["root"],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: false,
            onTest: true,
            rootOnly: false,
            dmCmd: false
        });
    }
    /**
     * @param {import("discord.js").Message} message
     * @type {Canvas.Image} 
    */
    async run(client, message, args, data) {
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const emojis = await low(client.adapters('emojis'));
        const channels = await low(client.adapters('channels'));

        let member = message.guild.members.cache.get(args[0]) || message.mentions.members.first()
        const avatarURL = member.user.avatarURL({ format: "png" })
        let templateImage = null;
        let templateImagePath = path.resolve(__dirname, `template.png`)
        let yetkiNumber;
        let sahipOlunanRol = Number();
        for (yetkiNumber = 0; yetkiNumber < Roles.Roles.length; yetkiNumber++) {
            if (member.roles.cache.has(Roles.Roles[yetkiNumber])) {
                sahipOlunanRol += yetkiNumber
            };
        }
        const roleText = `${message.guild.roles.cache.get(Roles.Roles[sahipOlunanRol]).name}`;
        const roleColor = `${message.guild.roles.cache.get(Roles.Roles[sahipOlunanRol]).hexColor}`;
        const sesText = "600 Saat";
        const msgText = "1000 Mesaj";
        const usernameText = `${member.displayName ? member.displayName : member.user.username}`
        const xpCurrent = 100;
        const xpMax = 100;
        const xpBarColor = "#4200ff";
        const badgePaths = Array(5).fill("").map((_, i) => path.resolve(__dirname, `../../../../src/badges/badge${i + 1}.png`))

        if (!templateImage) {
            templateImage = await Canvas.loadImage(templateImagePath);
        }
        let tmpFolder = path.resolve(`./tmp/profile/${randomString(8)}`);
        await makeSureFolderExists(tmpFolder);

        let canvas = Canvas.createCanvas(500, 200);
        let ctx = canvas.getContext("2d");

        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        // Draw Background
        ctx.drawImage(templateImage, 0, 0);

        // Draw Avatar
        ctx.drawImage(await Canvas.loadImage(avatarURL), 26, 14, 125, 125);

        ctx.font = "600 12px Arial";

        // Draw Role
        const { width: roleTextWidth, emHeightDescent: roleTextHeight } = ctx.measureText(roleText);
        const roleTextBgPadding = 4;

        ctx.fillStyle = `${roleColor}55`;
        ctx.fillRect(87 - (roleTextWidth / 2) - roleTextBgPadding, 166 - roleTextBgPadding, roleTextWidth + roleTextBgPadding * 2, roleTextHeight + roleTextBgPadding * 2)

        ctx.fillStyle = "whitesmoke";
        ctx.fillText(roleText, 87 - (roleTextWidth / 2), 166);

        // Draw Ses Text
        ctx.font = "bold 12px Arial";

        const { width: sesTextWidth } = ctx.measureText(sesText);
        ctx.fillText(sesText, 416 - (sesTextWidth / 2), 85);

        // Draw Msg Text
        const { width: msgTextWidth } = ctx.measureText(msgText);
        ctx.fillText(msgText, 416 - (msgTextWidth / 2), 121);

        // Draw Username Text
        ctx.font = "bold 14px Arial";
        ctx.fillText(usernameText, 205, 31, 134);

        let frameIndex = 0;

        // Draw Badges
        for (let i = 0; i < badgePaths.length; i++) {
            const badgePath = badgePaths[i];
            frameIndex += 1;

            ctx.drawImage(await Canvas.loadImage(badgePath), 172 + (i * 26), 90);

            let framePath = path.resolve(tmpFolder, `frame${frameIndex.toString().padStart(3, "0")}.png`);
            await fs.promises.writeFile(framePath, canvas.toBuffer());
        }

        // Draw Bar Animation
        let progressTotal = percent(xpCurrent, xpMax, 300, 1);
        let progressX = 171;
        let progressY = 162;
        let progressSteps = 10;
        let progressOneStepSize = progressTotal / progressSteps;

        ctx.fillStyle = xpBarColor;

        for (let i = 0; i < progressSteps; i++) {
            frameIndex += 1;
            ctx.fillRect(progressX, progressY, progressOneStepSize * (i + 1), 20);
            let framePath = path.resolve(tmpFolder, `frame${frameIndex.toString().padStart(3, "0")}.png`);
            await fs.promises.writeFile(framePath, canvas.toBuffer());
        }


        // Generating Color Platte For Better Output
        await execAsync(`ffmpeg -i "frame%003d.png" -vf palettegen palette.png -y`, { timeout: 5000, cwd: tmpFolder });

        // Encoding the gif.
        let outputGifPath = path.resolve(tmpFolder, "output.gif");
        await execAsync(`ffmpeg -i "frame%003d.png" -i "palette.png" -loop -1 -filter_complex "[0]setpts=4*PTS[slowed];[slowed]paletteuse" "${outputGifPath}" -y`, { timeout: 5000, cwd: tmpFolder });

        // SEND TO DISCORD

        const attachment = new Discord.MessageAttachment(outputGifPath);
        await message.inlineReply({ files: [attachment] })

        // AFTER SEND STUFF
        // Deleting temp files..
        await execAsync(os.platform() == "win32" ? `rmdir /S /Q "${tmpFolder}"` : `rm -rf "${tmpFolder}"`, { timeout: 5000 });

    }

}

module.exports = Kur;