const { ClientEvent } = require('../../../base/utils');
class RoleCreate extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "roleCreate",
            action: "ROLE_CREATE",
            punish: "ban",
            privity: true
        });
        this.client = client;
    }

    async rebuild(role) {
        await client.models.roles.create({
            meta: [
                {
                    _id: role.id,
                    name: role.name,
                    icon: role.icon,
                    color: role.hexColor,
                    hoist: role.hoist,
                    mentionable: role.mentionable,
                    position: role.rawPosition,
                    bitfield: role.permissions.bitfield.toString(),
                    created: role.createdAt,
                    emoji: role.unicodeEmoji
                }
            ]
        });

    }

    async refix(role) {
        await role.delete();
    }
}

module.exports = RoleCreate;