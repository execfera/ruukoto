var autoload = require('auto-load');

var commands = Object.assign(autoload("./commands/author"), autoload("./commands/fun"), autoload("./commands/reference"), autoload("./commands/utility"));

commands.help = {
	desc: "Provides help on bot commands.\nUSAGE: -help: Lists all available commands to this user.\n-help [COMMAND]: Prints information on specific command.",
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) {
			var cmdlist = Object.keys(commands).map(e => e.code());
			msg.channel.send("Available commands: " + cmdlist.sort().join(", ") + ".\n\nUse `-help COMMAND` for more information.");
		}
		else msg.channel.send((cmd + ": " + commands[cmd].desc).codeblock());
	}
}

module.exports = commands;