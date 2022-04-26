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
        client.models.member.findOne({ _id: member.user.id }).then((rolesDataOfMember) => {
            if (rolesDataOfMember) {
                let newRoles = [];
                rolesDataOfMember.roles.forEach((r_doc) => {
                    client.models.roles.findOne({ _id: r_doc._id }).then((doc) => {
                        if (guild.roles.cache.has(doc.meta.pop()._id)) newRoles.push(doc.meta.pop()._id);
                    });
                });
                try {
                    console.log(`[BULUNDU]: ${member.displayName}`);
                    await member.roles.add(newRoles);
                } catch (error) {
                    console.log(error);
                }
            }
        });
        i = i + 1;
    }, 300);
});
client.on("error", (err) => { console.error(err); });
