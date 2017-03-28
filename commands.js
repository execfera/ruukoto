var autoload = require('auto-load');

var commands = Object.assign(autoload("./commands/author"), autoload("./commands/fun"), autoload("./commands/reference"), autoload("./commands/server"), autoload("./commands/utility"));

commands.help = {
	desc: "Provides help on bot commands.\nUSAGE: -help: Lists all available commands to this user.\n-help [COMMAND]: Prints information on specific command.",
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) {
			var cmdlist = Object.keys(commands).filter(e => {
				switch (commands[e].lvl) {
					case "author": return msg.author.id === "91327883208843264";
					case "rern": return msg.guild.id === "208498945343750144";
					case "cheese": return msg.guild.id === "103851116512411648";
					case "zed": return msg.guild.id === "206956124237332480";
					default: return true;
				}
			}).map(e => e.code());
			msg.channel.sendMessage("Available commands: " + cmdlist.sort().join(", ") + ".\n\nUse `-help COMMAND` for more information.");
		}
		else msg.channel.sendMessage((cmd + ": " + commands[cmd].desc).codeblock());
	}
}

module.exports = commands;