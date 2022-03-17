class Danger {
  constructor(client) {
    this.client = client;
  };

  async run(perms) {

    this.client.guild.roles.cache.filter(rol => rol.editable).filter(rol => perms.some(xd => rol.permissions.has(xd))).forEach(async (rol) => {
      rol.setPermissions(BigInt(0))
    });

  }
}
module.exports = Danger;
