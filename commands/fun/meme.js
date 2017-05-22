var jsonfile = require('jsonfile');
var pastaData = require(__root + "/storage/user/pasta.json");

module.exports = {
	desc: "Custom command creation. Commands can either be plaintext or a native bot command.\nUSAGE:\n-meme [COMMAND] [OUTPUT]: Adds custom command.\n-meme [COMMAND]: Deletes custom command.\n-meme -list: List server commands and sends to file.\n-[COMMAND]: Use custom command.\nALIAS: alias",
	alias: ["alias"],
	lvl: "all",
	func (msg, cmd, bot) {
		var msga = cmd.split(' ');
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
		else if (msga[0] === '-list' && msg.guild.id in pastaData) { 
			msg.channel.send(
				{ file: {attachment: Buffer.from(JSON.stringify(pastaData[msg.guild.id], null, '\t'), 'utf8'), name: 'commands.txt'} }
			); 
		} else {
			if (!(msg.guild.id in pastaData)) pastaData[msg.guild.id] = { "echo": "echo echo" };
			var pastacmd = cmd.slice(cmd.indexOf(' ')+1);
			if (pastaData[msg.guild.id][msga[0]]) {
				if (pastacmd === cmd) {
					delete pastaData[msg.guild.id][msga[0]];
					jsonfile.writeFileSync(__root + "/storage/user/pasta.json", pastaData, {spaces: 2});
					msg.channel.send(msga[0].code() + " cleared.");
				}
				else msg.channel.send(msga[0].code() + " already exists!");
			} else {
				if (pastacmd === cmd) msg.channel.send(msga[0].code() + " does not exist!");
				else {
					if (pastacmd[0] === '-' || (pastacmd[0] === '.' && msg.guild.id === "103851116512411648")) pastaData[msg.guild.id][msga[0]] = pastacmd.slice(1);
					else pastaData[msg.guild.id][msga[0]] = "echo " + pastacmd; 
					jsonfile.writeFileSync(__root + "/storage/user/pasta.json", pastaData, {spaces: 2});
					msg.channel.send(msga[0].code() + " added as custom command. Type `-" + msga[0] + "` to use it.");					
				}
			}
		}
	}
}