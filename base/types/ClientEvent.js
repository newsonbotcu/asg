class ClientEvent {
    constructor(client, {
        name = null,
        allow = [],
        audit = (auditType) => client.guild.fetchAuditLogs({ type: auditType }).then(logs => logs.entries.first()),
    }) {
        this.client = client;
        
    }
}