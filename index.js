var Discord = require('discord.js');
var bot = new Discord.Client();

require("./strutil");
global.__root = require('path').resolve(__dirname);

var	commands = require("./commands").commands;
var checkLevel = require("./commands").checkLevel;
var	authData = require("./storage/auth.json");
var blacklist = require("./storage/blist.json");
var pastaData = require("./storage/user/pasta.json");

var cleverbot = require("cleverbot"), clever = new cleverbot({key: authData.clever_key}), cleverstate;
var cleverbot2 = require("cleverbot.io"), clever2 = new cleverbot2(authData.clever2_user,authData.clever2_key);
clever2.setNick("RUUKOTO_DISCBOT");
clever2.create(function (err, session) {});

bot.login(authData.token);
bot.music = {};

bot.on("ready", () => {
	console.log("ruukoto online");
	bot.user.setGame("Sweeping the Hakurei Shrine");
});

bot.on("message", (msg) => {
	var msgc = msg.content;
	var msga = msgc.split(' ');
	if (msg.author.id !== bot.user.id) {
		/* Main Command Parser
		*/
		if (msgc[0] === '-' || (msgc[0] === '.' && msg.guild.id === "103851116512411648")) {
			var msgcmd = msgc.indexOf(' ') > -1 ? msgc.slice(msgc.indexOf(' ')+1) : '';
			var msgtype = msgc.split(' ')[0].slice(1);
			if (msgtype in commands) {
				if (checkLevel(msgtype, msg, bot)) commands[msgtype].func(msg, msgcmd, bot);
			} else {
				var aliascmd = "";
				for (cmd in commands) {
					if ("alias" in commands[cmd]) {
						for (let i = 0; i < commands[cmd].alias.length; i++) {
							if (msgtype === commands[cmd].alias[i] && (checkLevel(cmd, msg, bot))) aliascmd = cmd;
						}
					}
				}
				if (aliascmd) commands[aliascmd].func(msg, msgcmd, bot);
				else if (msg.guild.id in pastaData && msga[0].slice(1) in pastaData[msg.guild.id]) {
					var pastacmd = pastaData[msg.guild.id][msga[0].slice(1)];
					msgcmd = pastacmd.indexOf(' ') > -1 ? pastacmd.slice(pastacmd.indexOf(' ')+1) : '';
					msgtype = pastacmd.split(' ')[0];
					if (msgtype in commands) {
						if (checkLevel(msgtype, msg, bot)) { 
							msgcmd = msgcmd.replace(/%input%/g, msgc.indexOf(' ') > -1 ? msgc.slice(msgc.indexOf(' ')+1) : '');
							msgcmd = msgcmd.replace(/%user%/g, msg.author);
							commands[msgtype].func(msg, msgcmd, bot); 
						}
					} else {
						for (cmd in commands) {
							if ("alias" in commands[cmd]) {
								for (let i = 0; i < commands[cmd].alias.length; i++) {
									if (msgtype === commands[cmd].alias[i] && (checkLevel(cmd, msg, bot))) commands[cmd].func(msg, msgcmd, bot);
								}
							}
						}
					}
				}
			}
		}
		/* Cleverbot Module
		-- Stuttering text with asterisk fix.
		-- Use Cleverbot.com with Cleverbot.io fallback.
		*/
		else if ((msg.isMentioned(bot.user) || msg.channel.type == 'dm') && blacklist.indexOf(msg.author.id) === -1) {
			if (cleverstate) {
				clever.query(msgc, {cs: cleverstate})
				.then(res => {msg.channel.send(stutter(res.output));})
				.catch(e => {
					clever2.ask(msgc, function (err, res) {
  					msg.channel.send(stutter(res));
					});
				});
			} else {
				clever.query(msgc)
				.then(res => {msg.channel.send(stutter(res.output)); cleverstate = res.cs;})
				.catch(e => {
					clever2.ask(msgc, function (err, res) {
  					msg.channel.send(stutter(res));
					});
				});
			}
		}
	}

});

/* Spy Module
*/

bot.on("messageDelete", (msg) => {
	if (msg.guild.id === "103851116512411648" && !msg.author.bot) {
		require('fs').appendFileSync("./storage/cheese/delete.txt", `[${msg.createdAt.toISOString().slice(0,-8)} #${msg.channel.name}] ${msg.author.username}: ${msg.content}\n`);
	}
});

bot.on("presenceUpdate", (oldUser, newUser) => {
	if (oldUser.guild.id === "103851116512411648" && oldUser.presence.status !== newUser.presence.status) {
		require('fs').appendFileSync("./storage/cheese/spy.txt", `${new Date().toISOString().slice(0,-8)} ${oldUser.user.username}: ${oldUser.presence.status} > ${newUser.presence.status}\n`);
	}
});

/* Greet/Leave Module
*/

bot.on("guildMemberAdd", (newUser) => {
	switch(newUser.guild.id){
		case "103851116512411648": newUser.guild.defaultChannel.send("Welcome to the Cheesebox, " + newUser.user.username + "!"); break;
		case "206956124237332480": { 
			newUser.guild.defaultChannel.send("Welcome to Zedart, " + newUser.user.username + "!");
			newUser.addRole('276871780352917504'); break; 
		}
		case "167209063480950785": newUser.guild.defaultChannel.send("Welcome to Eientei, " + newUser.user.username + "!"); break;
		case "91330381625696256": newUser.addRole('210769404705636352'); break;
	}
});

bot.on("guildMemberRemove", (oldUser) => {
	switch (oldUser.guild.id) {
		case "103851116512411648": oldUser.guild.defaultChannel.send(oldUser.user.username + " didn't fly so good. Who wants to try next?").then(m => m.react("\u{1f1eb}")); break;
		case "206956124237332480": case "167209063480950785": oldUser.guild.defaultChannel.send("Sorry to see you go, " + oldUser.user.username + ", come back soon!").then(m => m.react("\u{1f1eb}"));
	}
});

/* Voice Channel Tracker
-- Restrict to Cheesebox for now.
*/

bot.on("voiceStateUpdate", (oldUser, newUser) => {
	var debug;
	switch (oldUser.guild.id) {
		case "103851116512411648": debug = bot.channels.get("211941895729971200"); break;	
		case "167209063480950785": debug = bot.channels.get("210866572951158784"); break;
		case "206956124237332480": debug = bot.channels.get("298168730788167680"); break;
	}
	if (debug) {
		if (!(oldUser.voiceChannel) && newUser.voiceChannel) debug.send((newUser.nickname || newUser.user.username) + ' has joined ' + newUser.voiceChannel.name + ".");
		else if (!(newUser.voiceChannel) && oldUser.voiceChannel) debug.send((oldUser.nickname || oldUser.user.username) + ' has left ' + oldUser.voiceChannel.name + ".");
		else if (oldUser.voiceChannel.name !== newUser.voiceChannel.name) {
			debug.send((oldUser.nickname || oldUser.user.username) + ' has moved from ' + oldUser.voiceChannel.name + " to " + newUser.voiceChannel.name + ".");
		}
	}	
});

function stutter(res){
	return res[0] === '*' ? '' : res[0] + '-' + res;
}
