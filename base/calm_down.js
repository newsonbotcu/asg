const client = new (require('./Tantoony'))({
    fetchAllMembers: true
}, `CD_${process.argv.pop()}`);
const pm2 = require('pm2');
client.on('ready', async () => {
    client.user.setPresence({ status: client.config.cdStatus });
    const guild = client.guilds.cache.get(client.config.server);
    const sayi = Math.floor(guild.members.cache.size / client.config.vars.calm_down.length);
    const array = guild.members.cache.map(m => m).slice((sayi * process.argv.pop()), (sayi * (process.argv.pop() + 1)));
    let i = 0;
    setInterval(async () => {
        const member = array[i];
        if (i === array.length && !member) return pm2.delete(`CD${process.argv.pop()}`);
        
        let rolesDataOfMember = await this.client.models.members.findOne({ _id: member.user.id });
        if (rolesDataOfMember) {
            const newRoles = await rolesDataOfMember.roles.filter((roleName) => guild.roles.cache.map(role => role.name).includes(roleName)).map((roleName) => guild.roles.cache.find(role => role.name === roleName).id);
            try {
                console.log(`[BULUNDU]: ${member.displayName}`);
                await member.roles.add(newRoles);
            } catch (error) {
                console.log(error);
            }
        }
        i = i + 1;
    }, 300);
});
client.on("error", (err) => { console.error(err); });
