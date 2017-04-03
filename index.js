var Discord = require('discord.js');
var bot = new Discord.Client();

require("./strutil");
global.__root = require('path').resolve(__dirname);

var	commands = require("./commands");
var	authData = require("./storage/auth.json");

bot.login(authData.token);

bot.on("ready", () => {
	console.log("freliabot.user online");
});

bot.on("message", (msg) => {
	var msgc = msg.content;
	var msga = msgc.split(' ');
	if (msg.author.id === bot.user.id) {
		/* Main Command Parser
		-- Backwards compatibility prefix for Cheesebox.
		-- Weather alias.
		*/
		if (msgc[0] === '/' && msgc[1] === '/') {
			var msgcmd = msgc.indexOf(' ') > -1 ? msgc.slice(msgc.indexOf(' ')+1) : '';
			var msgtype = msgc.split(' ')[0].slice(2);
			if (msgtype in commands) {
				commands[msgtype].func(msg, msgcmd, bot); }
		} else {
			for (cmd in commands) {
				if ("alias" in commands[cmd]) {
					for (let i = 0; i < commands[cmd].alias.length; i++) {
						if (msgtype === commands[cmd].alias[i]) commands[cmd].func(msg, msgcmd, bot);
					}
				}
			}
		}
	}
});

/* Temporary Random Disconnect Workaround 
-- Track https://github.com/hydrabolt/discord.js/issues/1233 for issue resolution.
*/

bot.on("disconnect", (ev) => {
	if (ev.code === 1000) bot.destroy().then(() => bot.login(authData.token));
});
