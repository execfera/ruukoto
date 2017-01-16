﻿var Discord = require("discord.js");
var request = require('request');
var d20 = require('d20');
var puppy = require('random-puppy');
var jsonfile = require('jsonfile');
var eightball = require('8ball');
var weather = require('openweather-apis');

var authData = require('./auth.json');
var chipData = require("./chip.json");
var traderData = require("./trader.json");
var pastaData = require("./pasta.json");

weather.setAPPID(authData.openweatherkey);
weather.setLang('en');
weather.setUnits('metric');

module.exports = {

"eval": {
	desc: "Evaluates raw JavaScript.\nUSAGE: -eval [COMMAND]",
	lvl: "author",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "eval", bot);  }
		else {
			try { var evalres = eval(cmd); }
			catch (e) { var evalres = e; }
			finally { msg.channel.sendMessage(evalres); }
		}
	}
},

"kys": {
	desc: "Restarts the bot.\nUSAGE: -kys",
	lvl: "author",
	func: (msg, cmd, bot) => {
		msg.channel.sendMessage("\u{1f503} Restarting."); bot.destroy();
	}
},

"raw": {
	desc: "Prints the given message in a code block.\nUSAGE: -raw [MESSAGE]",
	lvl: "author",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "raw", bot);  }
		msg.channel.sendMessage(cmd.codeblock());
	}
},

"echo": {
	desc: "Makes the bot say the given statement.\nUSAGE: -echo [MESSAGE]\nEXAMPLE: -echo I'm talking through the bot!",
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "echo", bot);  }
		else {
			var echo = cmd, target = msg.channel;
			if (msg.author.id === "91327883208843264" && cmd[0] === '-') {
				switch (cmd.split(' ')[0].slice(1)) {
					case "cheese": target = bot.channels.get("103851116512411648"); echo = cmd.slice(cmd.indexOf(' ')+1); break;
					case "rern": target = bot.channels.get("208498945343750144"); echo = cmd.slice(cmd.indexOf(' ')+1); break;
					case "debug": target = bot.channels.get("189911150001913856"); echo = cmd.slice(cmd.indexOf(' ')+1); break;
				}
			}
			target.sendMessage(echo);
		}
	}
},

"choose": {
	desc: "Chooses one of any number of given choices, separated by comma.\nUSAGE: -choose [CHOICE_A],[CHOICE_B],[...]\nEXAMPLE: -choose apple, banana, canteloupe",
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "choose", bot);  }
		else msg.channel.sendMessage('\u{1f5f3} I choose ' + cmd.split(',')[Math.floor(Math.random() * cmd.split(',').length)].trim() + '!');
	}
},

"ping": {
	desc: "Prints out the bot's gateway heartbeat ping.\nUSAGE: -ping",
	lvl: "all",
	func: (msg, cmd, bot) => {
		msg.channel.sendMessage("\u{1f493} Heartbeat OK: " + Math.trunc(bot.ping) + "ms");
	}
},

"roll": {
	desc: "Rolls the dice.\nUSAGE: -roll [NUMBER], -roll [STANDARD_DICE], -roll[STANDARD_DICE]+[MODIFIER1]+[MODIFIER..]\nEXAMPLE: -roll 20, -roll 1d20, -roll 1d20 +0",
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "roll", bot);  }
		else msg.channel.sendMessage('\u{1f3b2} ' + d20.roll(cmd));
	}
},

"roll+": {
	desc: "Rolls the dice, and prints out all dice rolled separately.\nUSAGE/EXAMPLE: See -roll.",
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "roll+", bot);  }
		else msg.channel.sendMessage('\u{1f3b2} ' + d20.roll(cmd, true).join(', '));
	}
},

"avatar": {
	desc: "Prints out the high-quality version of user given. If none given, prints out command user's avatar.\nUSAGE: -avatar, -avatar [@USER_MENTION]\nEXAMPLE: -avatar @Ms. Prog#1162",
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (cmd) msg.channel.sendMessage(bot.users.get(mention2id(cmd)).displayAvatarURL);
		else msg.channel.sendMessage(bot.users.get(msg.author.id).displayAvatarURL);
	}
},

"userinfo": {
	desc: "Returns info about the requested user. If no user is provided, returns info about the requester.\nUSAGE: -userinfo, -userinfo [@USER_MENTION]\nEXAMPLE: -userinfo @Ms. Prog#1162",
	lvl: "all",
	func: (msg, cmd, bot) => {
		var content = '';
		var userid = cmd ? mention2id(cmd) : msg.author.id;
		bot.fetchUser(userid).then(usr => {
			var creatediff = (new Date().getTime() - usr.createdTimestamp)/1000;
			content += "User: `" + usr.username + "#" + usr.discriminator;
			if (msg.guild.members.get(userid)) {
				var guildusr = msg.guild.members.get(userid);
				var joinstamp = guildusr.joinedTimestamp;
				var joindiff = (new Date().getTime() - joinstamp)/1000;
				content += guildusr.nickname ? ' (' + guildusr.nickname + ')`\n' : '`\n';
				content += "User ID: " + userid.code() +'\n';
				content += "Account joined: " + (new Date(joinstamp).toUTCString() + " (" + timeCounter(joindiff) + " ago)").code() + "\n";
			} else { content += "`\nUser ID: " + userid.code() + "\n"; }
			content += "Account created: " + (new Date(usr.createdTimestamp).toUTCString() + " (" + timeCounter(creatediff) + " ago)").code() + "\n";
			content += "Current status: " + usr.presence.status.code() + "\n";
			content += usr.displayAvatarURL;
			msg.channel.sendMessage(content);
		});
	}
},

"serverinfo": {
	desc: "Returns info about the current server.\nUSAGE: -serverinfo",
	lvl: "all",
	func: (msg, cmd, bot) => {
		var content = "", roles = [], txtchn = [], vchn = [], online = 0, idle = 0, dnd = 0, presencearr = [];
		var createstamp = msg.guild.createdTimestamp;
		var creatediff = (new Date().getTime() - createstamp)/1000;
		for (var i = 0; i < msg.guild.roles.array().length; i++) {
			if (msg.guild.roles.array()[i].name !== "@everyone") roles.push(msg.guild.roles.array()[i].name.code());
		}
		for (var i = 0; i < msg.guild.channels.array().length; i++) {
			if (msg.guild.channels.array()[i].type === "text") txtchn.push(msg.guild.channels.array()[i].name.code());
			else vchn.push(msg.guild.channels.array()[i].name.code());
		}
		for (var i = 0; i < msg.guild.presences.array().length; i++) {
			switch (msg.guild.presences.array()[i].status) {
				case "online": online++; break;
				case "idle": idle++; break;
				case "dnd": dnd++; break;
			}
		}
		if (online) presencearr.push(online + " online");
		if (idle) presencearr.push(idle + " idle");
		if (dnd) presencearr.push(dnd + " silenced");
		content += "Name: " + (msg.guild.name + " (ID: " + msg.guild.id + ")").code() + "\n";
		content += "Owner: `" + msg.guild.owner.user.username + "#" + msg.guild.owner.user.discriminator;
		content += (msg.guild.owner.nickname ? " (" + msg.guild.owner.nickname + ")`\n" : "`\n");
		content += "Region: " + msg.guild.region.code() + "\n";
		content += "Created: " + (new Date(createstamp).toUTCString() + " (" + timeCounter(creatediff) + " ago)").code() + "\n";
		content += "User Count: " + (msg.guild.memberCount.toString() + " (" + presencearr.join(', ') + ")").code() + "\n";
		content += "Roles (" + roles.length + "): " + roles.join(', ') + "\n";
		content += "Text Channels (" + txtchn.length + "): " + txtchn.join(', ') + "\n";
		content += "Voice Channels (" + vchn.length + "): " + vchn.join(', ') + "\n";
		content += msg.guild.iconURL;
		msg.channel.sendMessage(content);
	}
},

"prune": {
	desc: "Prunes the bot's last X messages. If no number is given, deletes all of the bot's messages in the last 50 messages.\nUSAGE: -prune, -prune [NUMBER]\nEXAMPLE: -prune, -prune 20",
	lvl: "all",
	func: (msg, cmd, bot) => {
		var limit = cmd || 50, count = 0;
		msg.channel.fetchMessages({limit: limit}).then(messages => {
			for (var i = 0; i < messages.array().length; i++) {
				if (messages.array()[i].author.id === bot.user.id) { messages.array()[i].delete(); count++; }
			}
			msg.channel.sendMessage("Deleted " + count + " message" + (count > 1 ? "s" : "")).then(m => m.delete(5000));
		});
	}
},

"dog": {
	desc: "Dog.\nUSAGE: -dog",
	lvl: "all",
	func: (msg, cmd, bot) => {
		puppy('puppy').then(url => { msg.channel.sendMessage("\u{1f415} " + url); });
	}
},

"cat": {
	desc: "Cat.\nUSAGE: -cat",
	lvl: "all",
	func: (msg, cmd, bot) => {
		request("http://random.cat/meow", function(err, res, body) {
			if (!err && res.statusCode == 200) msg.channel.sendMessage("\u{1f408} " + JSON.parse(body).file);
		});
	}
},

"8ball": {
	desc: "Asks the bot a question.\nUSAGE: -8ball [QUESTION]\nEXAMPLE: -8ball Will I ever become the little girl?",
	lvl: "all",
	func: (msg, cmd, bot) => {
		msg.channel.sendMessage("Question: " + cmd.code() + "\nAnswer: " + eightball().code());
	}
},


"weather": {
	desc: "Shows current weather for the given area.\nUSAGE: -w [AREA], -weather [AREA]\nEXAMPLE: -w New York",
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "weather", bot);  }
		else try {
			var wreport;
			weather.setCity(cmd);
			weather.getAllWeather(function(err, res){
				wreport = getWeatherIcon(res.weather[0].icon) + "__**Weather** for " + res.name + ", " + res.sys.country + "__ :flag_" + res.sys.country.toLowerCase() + ":";
				wreport += "\n" + res.main.temp + "°C / " + (res.main.temp*1.8+32).toFixed(2) + "°F, " + res.weather[0].description;
				wreport += "\n" + res.clouds.all + "% Clouds, Wind Speed " + res.wind.speed + "m/s";
				wreport += "\n" + "Barometric Pressure: " + res.main.pressure + "hPa " + res.main.humidity + "% humidity";
				msg.channel.sendMessage(wreport);
			});
		} catch (e) { msg.channel.sendMessage("Weather Error: " + e); }
	}
},

"meme": {
	desc: "Custom command creation.\nUSAGE:\n-meme [COMMAND] [OUTPUT]: Adds custom command.\n-meme [COMMAND]: Deletes custom command.\n-meme -list: List server commands and sends to file.\n~[COMMAND]: Use custom command.",
	lvl: "all",
	func: (msg, cmd, bot) => {
		var msga = cmd.split(' ');
		if (!cmd) { module.exports["help"].func(msg, "meme", bot);  }
		else if (msga[0] === '-list' && msg.guild.id in pastaData) { msg.channel.sendFile(Buffer.from(Object.keys(pastaData[msg.guild.id]).join(', '), 'utf8'), 'commands.txt'); }
		else if (cmd[0] === '~' || cmd[0] === '-') { msg.channel.sendMessage("Invalid command format."); }
		else {
			if (!(msg.guild.id in pastaData)) pastaData[msg.guild.id] = { "echo": "echo" };
			var pastacmd = cmd.slice(cmd.indexOf(' ')+1);
			if (pastaData[msg.guild.id][msga[0]]) {
				if (pastacmd === cmd) {
					delete pastaData[msg.guild.id][msga[0]];
					jsonfile.writeFileSync('./pasta.json', pastaData, {spaces: 2});
					msg.channel.sendMessage(msga[0].code() + " cleared.");
				}
				else msg.channel.sendMessage(msga[0].code() + " already exists!");
			}
			else {
				pastaData[msg.guild.id][msga[0]] = pastacmd;
				jsonfile.writeFileSync('./pasta.json', pastaData, {spaces: 2});
				msg.channel.sendMessage(msga[0].code() + " added as custom command. Type `~" + msga[0] + "` to use it.");
			}
		}
	}
},

"chip": {
	desc: "Returns RE:RN Battlechip data.\nUSAGE: -chip [BATTLECHIP]\nEXAMPLE: -chip Cannon",
	lvl: "rern",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "chip", bot);  }
		else if (!(cmd in chipData)) { msg.channel.sendMessage("Chip not found."); }
		else {
			var chipmoji = bot.guilds.get("208498945343750144").emojis.get("265842020298391552");
			var ccontent = chipData[cmd].desc.replace(/<br>/g,'\n');
			var ctitle = msg.guild.id === "208498945343750144" ? chipmoji + ' ' + cmd : cmd;
			msg.channel.sendMessage(ctitle.markbold() + "\n" + ccontent.codeblock());
		}
	}
},

"trader": {
	desc: "Sacrifices a chip into the chip trader and prints out the result.\nUSAGE: -trader [BATTLECHIP]\nEXAMPLE: -trader Cannon",
	lvl: "rern",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "trader", bot);  }
		else msg.channel.sendMessage('\u{1f5f3} Result: ' + traderoll(cmd));
	}
},


"help": {
	desc: "Provides help on bot commands.\n-help: Lists all available commands.\nUSAGE: -help [COMMAND]: Prints information on specific command.",
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (!cmd) {
			var cmdlist = Object.keys(module.exports).filter(e => {
				switch (module.exports[e].lvl) {
					case "author": return msg.author.id === "91327883208843264";
					case "rern": return msg.guild.id === "208498945343750144";
					default: return true;
				}
			}).map(e => e.code());
			cmdlist.sort(); msg.channel.sendMessage("Available commands: " + cmdlist.join(", ") + ".\n\nUse `-help COMMAND` for more information.");
		}
		else msg.channel.sendMessage((cmd + ": " + module.exports[cmd].desc).codeblock());
	}
}

}

/* Miscellaneous Utility Functions */

String.prototype.markbold = function () { return "**" + this + "**"; }
String.prototype.markline = function () { return "__" + this + "__"; }
String.prototype.code = function () { return "`" + this + "`"; }
String.prototype.codeblock = function () { return "```\n" + this + "\n```"; }

function mention2id (str) {
	return str.slice(2,3) === '!' ? str.slice(3,-1) : str.slice(2,-1);
}

function getWeatherIcon (iconid) {
	switch (iconid)
	{
		case "01d": // clear sky day
			return "\u{2600} ";
		case "01n": // clear sky night
			return "\u{1f314} ";
		case "02d": // few clouds day
		case "03d": // scattered clouds day
		case "04d": // broken clouds day
			return "\u{1f324} ";
		case "02n": // few clouds night
		case "03n": // scattered clouds night
		case "04n": // broken clouds night
			return "\u{2601} ";
		case "09d": // shower rain day
			return "\u{1f326} ";
		case "09n": // shower rain night
			return "\u{1f327} ";
		case "10d": // rain day
		case "10n": // rain night
			return "\u{2602} ";
		case "11d": // thunderstorm day
		case "11n": // thunderstorm night
			return "\u{1f329} ";
		case "13d": // snow day
		case "13n": // snow night
			return "\u{2744} ";
		case "50d": // mist day
		case "50n": // mist night
			return "\u{1f4a6} ";
		default:
			return "";
	}
}

function traderoll (chip) {
	var tier = '';
	var restier = '';
	var resroll = 0;
	for (var key in traderData) {
		if (traderData[key].indexOf(chip) > -1) { tier = key; break; }
	}
	if (tier === '') { return 'Chip input invalid.'; }
	var resroll = d20.roll(20);
	switch (tier) {
		case 'E':
		case 'D': {
			if (resroll <= 7) return traderData.E[d20.roll(traderData.E.length)-1] + " (" + resroll + ")";
			else if (resroll >= 17) return traderData.C[d20.roll(traderData.C.length)-1] + " (" + resroll + ")";
			else return traderData.D[d20.roll(traderData.D.length)-1] + " (" + resroll + ")";
		}
		case 'C': {
			if (resroll <= 7) return traderData.D[d20.roll(traderData.D.length)-1] + " (" + resroll + ")";
			else if (resroll >= 17) return traderData.B[d20.roll(traderData.B.length)-1] + " (" + resroll + ")";
			else return traderData.C[d20.roll(traderData.C.length)-1] + " (" + resroll + ")";
		}
		case 'B':
		case 'A':
		case 'S': {
			if (resroll <= 7) return traderData.C[d20.roll(traderData.C.length)-1] + " (" + resroll + ")";
			else if (resroll >= 17) return traderData.A[d20.roll(traderData.A.length)-1] + " (" + resroll + ")";
			else return traderData.B[d20.roll(traderData.B.length)-1] + " (" + resroll + ")";
		}
	}
}

function timeCounter(tval) {
    var t = parseInt(tval);
    var years = parseInt(t / 31536000);
    t = t - (years * 31536000);
    var months = parseInt(t / 2592000);
    t = t - (months * 2592000);
    var days = parseInt(t / 86400);
    t = t - (days * 86400);
    var hours = parseInt(t / 3600);
    t = t - (hours * 3600);
    var minutes = parseInt(t / 60);
    t = t - (minutes * 60);
    var content = [];
		if (years) content.push(years + " year" + (years > 1 ? "s" : ""));
		if (months) content.push(months + " month" + (months > 1 ? "s" : ""));
		if (days) content.push(days + " day" + (days > 1 ? "s" : ""));
		if (hours) content.push(hours + " hour"  + (hours > 1 ? "s" : ""));
		if (minutes) content.push(minutes + " minute" + (minutes > 1 ? "s" : ""));
		if (t) content.push(t + " second" + (t > 1 ? "s" : ""));
		return content.slice(0,3).join(', ');
}
