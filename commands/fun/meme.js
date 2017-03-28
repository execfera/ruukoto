var jsonfile = require('jsonfile');
var pastaData = require(__root + "/storage/user/pasta.json");

module.exports = {
	desc: "Custom command creation.\nUSAGE:\n-meme [COMMAND] [OUTPUT]: Adds custom command.\n-meme [COMMAND]: Deletes custom command.\n-meme -list: List server commands and sends to file.\n-meme -random: Uses a random custom command.\n~[COMMAND]: Use custom command.",
	lvl: "all",
	func (msg, cmd, bot) {
		var msga = cmd.split(' ');
		if (!cmd) { msg.channel.sendMessage(("meme: " + this.desc).codeblock()); }
		else if (msga[0] === '-list' && msg.guild.id in pastaData) { msg.channel.sendFile(Buffer.from(JSON.stringify(pastaData[msg.guild.id], null, '\t'), 'utf8'), 'commands.txt'); }
		else if (msga[0] === '-random' && msg.guild.id in pastaData) { 
			let target = Object.keys(pastaData[msg.guild.id]), key = target[ target.length * Math.random() << 0];
    		msg.channel.sendMessage("~`" + key + "`\n" + pastaData[msg.guild.id][key]);
		}
		else if (cmd[0] === '~' || cmd[0] === '-') { msg.channel.sendMessage("Invalid command format."); }
		else {
			if (!(msg.guild.id in pastaData)) pastaData[msg.guild.id] = { "echo": "echo" };
			var pastacmd = cmd.slice(cmd.indexOf(' ')+1);
			if (pastaData[msg.guild.id][msga[0]]) {
				if (pastacmd === cmd) {
					delete pastaData[msg.guild.id][msga[0]];
					jsonfile.writeFileSync(__root + "/storage/user/pasta.json", pastaData, {spaces: 2});
					msg.channel.sendMessage(msga[0].code() + " cleared.");
				}
				else msg.channel.sendMessage(msga[0].code() + " already exists!");
			}
			else {
				if (pastacmd === cmd) msg.channel.sendMessage(msga[0].code() + " does not exist!");
				else {
					pastaData[msg.guild.id][msga[0]] = pastacmd;
					jsonfile.writeFileSync(__root + "/storage/user/pasta.json", pastaData, {spaces: 2});
					msg.channel.sendMessage(msga[0].code() + " added as custom command. Type `~" + msga[0] + "` to use it.");
				}
			}
		}
	}
}