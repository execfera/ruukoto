var autoload = require('auto-load');

var cmdsAtr = autoload(__root + "/commands/author");
var cmdsAdm = autoload(__root + "/commands/admin");
var cmdsFun = autoload(__root + "/commands/fun");
var cmdsRef = autoload(__root + "/commands/reference");
var cmdsSrv = autoload(__root + "/commands/server");
var cmdsUtl = autoload(__root + "/commands/utility");

var blacklist = require(__root + "/storage/blist.json");

var commands = Object.assign({}, cmdsAtr, cmdsAdm, cmdsFun, cmdsRef, cmdsSrv, cmdsUtl);

commands.help = {	
	desc: "Provides help on bot commands.\nUSAGE: -help: Lists all available commands to this user.\n-help [COMMAND]: Prints information on specific command.",
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) {
			var helpText = "Available commands: \n\n";
			if (populateHelp(cmdsAtr, msg, bot).length > 0) helpText += "**Author**: " + populateHelp(cmdsAtr, msg, bot).sort().join(", ") + ".\n";
			if (populateHelp(cmdsAdm, msg, bot).length > 0) helpText += "**Admin**: " + populateHelp(cmdsAdm, msg, bot).sort().join(", ") + ".\n";
			helpText += "**Fun:** " + populateHelp(cmdsFun, msg, bot).sort().join(", ") + ".\n";
			helpText += "**Reference:** " + populateHelp(cmdsRef, msg, bot).sort().join(", ") + ".\n";
			helpText += "**Utility:** " + populateHelp(cmdsUtl, msg, bot).sort().join(", ") + ".\n";
			if (populateHelp(cmdsSrv, msg, bot).length > 0) helpText += "**Special:** " + populateHelp(cmdsSrv, msg, bot).sort().join(", ") + ".\n";
			msg.channel.sendMessage(helpText + "\nUse `-help COMMAND` for more information.");
		}
		else msg.channel.sendMessage((cmd + ": " + commands[cmd].desc).codeblock());
	}
}

function populateHelp (cmds, msg, bot) { 
	return Object.keys(cmds).filter(e => { return checkLevel(e, msg, bot) }).map(e => e.code()); 
}

function checkLevel (cmd, msg, bot) {
	if (blacklist.indexOf(msg.author.id) > -1) return false;
	switch (commands[cmd].lvl) {
		case "kick_mem": return (msg.member.hasPermission("KICK_MEMBERS") && msg.guild.member(bot.user).hasPermission("KICK_MEMBERS"));
		case "ban_mem": return (msg.member.hasPermission("BAN_MEMBERS") && msg.guild.member(bot.user).hasPermission("BAN_MEMBERS"));
		case "man_msg": return (msg.member.hasPermission("MANAGE_MESSAGES") && msg.guild.member(bot.user).hasPermission("MANAGE_MESSAGES"));
		case "man_msg_usr": return msg.member.hasPermission("MANAGE_MESSAGES");
		case "man_prm": return (msg.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS") && msg.guild.member(bot.user).hasPermission("MANAGE_ROLES_OR_PERMISSIONS"));

		case "rern": return msg.guild.id === "208498945343750144";
		case "cheese": return msg.guild.id === "103851116512411648";
		case "zed": return msg.guild.id === "206956124237332480";

		case "author": return msg.author.id === "91327883208843264";
		case "all": default: return true;
	}
}

module.exports.commands = commands;
module.exports.checkLevel = checkLevel;