var autoload = require('auto-load');

var cmdsAtr = autoload("./commands/author");
var cmdsFun = autoload("./commands/fun");
var cmdsRef = autoload("./commands/reference");
var cmdsSrv = autoload("./commands/server");
var cmdsUtl = autoload("./commands/utility");

var commands = Object.assign({}, cmdsAtr, cmdsFun, cmdsRef, cmdsSrv, cmdsUtl);

commands.help = {	
	desc: "Provides help on bot commands.\nUSAGE: -help: Lists all available commands to this user.\n-help [COMMAND]: Prints information on specific command.",
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) {
			var helpText = "Available commands: \n\n";
			if (msg.author.id === "91327883208843264")  helpText += "**Author**: " + checkLevel(cmdsAtr, msg).sort().join(", ") + ".\n";
			helpText += "**Fun:** " + checkLevel(cmdsFun, msg).sort().join(", ") + ".\n";
			helpText += "**Reference:** " + checkLevel(cmdsRef, msg).sort().join(", ") + ".\n";
			helpText += "**Utility:** " + checkLevel(cmdsUtl, msg).sort().join(", ") + ".\n";
			if (checkLevel(cmdsSrv, msg).length > 0) helpText += "**Special:** " + checkLevel(cmdsSrv, msg).sort().join(", ") + ".\n";
			msg.channel.sendMessage(helpText + "\nUse `-help COMMAND` for more information.");
		}
		else msg.channel.sendMessage((cmd + ": " + commands[cmd].desc).codeblock());
	}
}

module.exports = commands;

function checkLevel (cmds, msg) { 
	return Object.keys(cmds).filter(e => {
		switch (cmds[e].lvl) {
			case "author": return msg.author.id === "91327883208843264";
			case "rern": return msg.guild.id === "208498945343750144";
			case "cheese": return msg.guild.id === "103851116512411648";
			case "zed": return msg.guild.id === "206956124237332480";
			default: return true;
		}
	}).map(e => e.code()); 
}