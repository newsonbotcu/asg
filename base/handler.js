const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const pm2 = require('pm2');

class Handler {
	constructor(client) {
		this.client = client;
		this.project_events();
		this.loader();
		this.lauch();
	}
	
	lauch() {
		pm2.launchBus(function (err, bus) {
			bus.on("process:msg", function (packet) {
				console.log(packet);
			});
		});
		process.on('message', function () {
			process.send({
				type: 'process:msg',
				data: {
					success: true
				}
			});
		});
	}
	
	project_events() {
		readdir(__dirname + '/../events/')
		.then((files) => {
			files.filter((e) => e.endsWith('.js'))
			.forEach((file) => {
				this.client.log("loading event: " + file, "load");
				const event = new (require(__dirname + "/../events/" + file))(this.client);
				this.client.on(event.name, (...args) => event.exec(...args));
				delete require.cache[require.resolve(__dirname + "/../events/" + file)];
			});
		});
	}
	
	hello(client) {
		this.client = client;
		client.emit("_ready");
		readdir(__dirname.replace('base', 'apps') + `/${this.client.name}/app/`)
		.then((appFolders) => {
			appFolders.forEach(async (intType) => {
				readdir(__dirname.replace('base', 'apps') + `/${this.client.name}/app/${intType}/`)
				.then((raw_output) => {
					raw_output.filter((s) => s.endsWith('.js'))
					.map(s => s.slice(0, s.length - ".js".length))
					.forEach(async (output) => {
						const response = await client.load_int(output, intType, client);
						if (response) {
							client.log(response, "error");
						}
					});
				});
			});
		})
		.catch(reason => {
			client.log(reason, "error");
		});
		if (client) this.client = client;
		//client.channels.cache.get(data.other["lastCrush"]).send("**TEKRAR ONLINE!**");
		return this.client;
	}
	
	loader() {
		this.client.on("error", (e) => this.client.log(e, "error"));
		this.client.on("warn", (info) => this.client.log(info, "warn"));
		readdir(__dirname + `/../apps/${this.client.name}/Events/`)
		.then((elements) => {
			this.client.log(`Loading ${elements.length} events in ${this.client.name}...`, "category");
			elements.forEach(async (element) => {
				if (element.endsWith(".js")) {
					this.client.log(`Loading Event: ${element.split(".")[0]}`, "load");
					const event = new (require(__dirname + `/../apps/${this.client.name}/Events/${element}`))(this.client);
					this.client.on(event.name, (...args) => event.exec(...args));
					delete require.cache[require.resolve(__dirname + `/../apps/${this.client.name}/Events/${element}`)];
				} else {
					const detaileds = await readdir(__dirname + `/../apps/${this.client.name}/Events/${element}/`);
					this.client.log(`Loading ${detaileds.length} details of the event ${element} in ${this.client.name}...`, "category");
					detaileds.forEach((detail) => {
						this.client.log(`Loading Event: ${detail.split(".")[0]}`, "load");
						const event = new (require(__dirname + `/../apps/${this.client.name}/Events/${element}/${detail}`))(this.client);
						this.client.on(event.name, (...args) => event.exec(...args));
						delete require.cache[require.resolve(__dirname + `/../apps/${this.client.name}/Events/${element}/${detail}`)];
					});
				}
			});
		});
	}
	
	
}

module.exports = Handler;
