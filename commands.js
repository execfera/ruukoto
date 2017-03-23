var Discord = require("discord.js");
var request = require('request');
var d20 = require('d20');
var puppy = require('random-puppy');
var jsonfile = require('jsonfile');
var eightball = require('8ball');
var weather = require('openweather-apis');
var urban = require('urban');
var fx = require('money');
var math = require('mathjs');
var google = require('googleapis');

var authData = require('./auth.json');
var chipData = require("./chip.json");
var traderData = require("./trader.json");
var pastaData = require("./pasta.json");
var virusData = Object.assign(require("./virus1.json"), require("./virus2.json"));
var youData = require("./you.json");

weather.setAPPID(authData.openweatherkey);
weather.setLang('en');
weather.setUnits('metric');

module.exports = {

"eval": {
	desc: "Evaluates raw JavaScript.\nUSAGE: -eval [COMMAND]\nALIAS: e",
	alias: ["e"],
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
		msg.channel.sendMessage("\u{1f503} Restarting.").then(m => process.exit());
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

"invite": {
	desc: "Prints the bot's invite link.\nUSAGE: -invite",
	lvl: "author",
	func: (msg, cmd, bot) => {
		bot.generateInvite().then(link =>{
			msg.channel.sendMessage(link);
		});
	}
},

"botinfo": {
	desc: "Returns info about the current bot instance.\nUSAGE: -botinfo",
	lvl: "all",
	func: (msg, cmd, bot) => {
		var pack = require("./package.json");
		bot.fetchUser("91327883208843264").then(usr => {
			var content = "__**Ruukoto** (discord.js v" + pack.dependencies["discord.js"].slice(1) + ")__\n\n";
			content += "**Author: **" + usr.username + "#" + usr.discriminator + "\n";
			content += "**Guilds: **" + bot.guilds.size + "\n";
			content += "**Channels: **" + bot.channels.size + "\n";
			content += "**Users: **" + bot.users.size + "\n\n";
			content += "**Startup: **" + bot.readyAt.toUTCString() + "\n";
			content += "**Uptime: **" + timeCounter(bot.uptime/1000) + "\n";
			content += "**Ping: **" + Math.trunc(bot.ping) + "ms";
			msg.channel.sendMessage(content);
		});
	}
},

"echo": {
	desc: "Makes the bot say the given statement.\nUSAGE: -echo [MESSAGE]\nEXAMPLE: -echo I'm talking through the bot!",
	alias: ["say"],
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
	desc: "Chooses one of two or more given choices, separated by comma.\nUSAGE: -choose [CHOICE_A],[CHOICE_B],[...]\nALIAS: choice, c\nEXAMPLE: -choose apple, banana, canteloupe",
	alias: ["choice", "c"],
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "choose", bot);  }
		else {
			if (cmd.split(',').length < 2) msg.channel.sendMessage('\u{1f5f3} Please provide more than one choice, separated by comma.');
			else msg.channel.sendMessage('\u{1f5f3} I choose ' + cmd.split(',')[Math.floor(Math.random() * cmd.split(',').length)].trim() + '!');
		}
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
		if (cmd) bot.fetchUser(mention2id(cmd)).then(usr => {msg.channel.sendMessage(usr.displayAvatarURL.replace(/\.jpg/,".png"))});
		else msg.channel.sendMessage(bot.users.get(msg.author.id).displayAvatarURL.replace(/\.jpg/,".png"));
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
			content += usr.displayAvatarURL.replace(/\.jpg/,".png");
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
		if (!cmd) { module.exports["help"].func(msg, "8ball", bot);  }
		else msg.channel.sendMessage("Question: " + cmd.code() + "\nAnswer: " + eightball().code());
	}
},

"urban": {
	desc: "Searches a term on Urban Dictionary.\nUSAGE: -urban [TERM]\nEXAMPLE: -urban headass",
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "urban", bot);  }
		else {
			urban(cmd).first((res) => {
				if (res) msg.channel.sendMessage("\u{1f4ac} " + res.definition + " (" + res.permalink + ")");
				else msg.channel.sendMessage("\u{1f4ac} No definition found.");
			});
		}
	}
},

"fx": {
	desc: "Converts one denomination of currency to another.\nUSAGE:\n-fx [AMOUNT] [INITIAL_CURRENCY] [RESULT_CURRENCY]: Converts given amount of first currency into the second.\n-fx [AMOUNT] [CURRENCY]: Converts given amount of currency into US Dollars.\n-fx [INITIAL_CURRENCY] [RESULT_CURRENCY]: Converts 1 unit of first currency into the second.\n-fx [CURRENCY]: Converts 1 US Dollar into the given currency.\nEXAMPLE: -fx 1 eur usd, -fx 1 eur, -fx eur usd, -fx eur",
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "fx", bot);  }
		else {
			var args = cmd.split(' ');
			if (isNaN(args[0])) {
				if (args[1]) args = [1, args[0], args[1]];
				else args = [1, "USD", args[0]];
			}
			if (!(args[2])) args[2] = "USD";
			args = [args[0], args[1].toUpperCase(), args[2].toUpperCase()];
			request(`http://www.apilayer.net/api/live?access_key=${authData.currencylayer_key}&currencies=${args[1]},${args[2]}`, function(err, res, body) {
				if (!err && res.statusCode == 200) {
					fx.rates["USD"] = 1;
					fx.rates[args[1]] = JSON.parse(body).quotes["USD"+args[1]];
					fx.rates[args[2]] = JSON.parse(body).quotes["USD"+args[2]];
					try { var rate = fx(args[0]).from(args[1]).to(args[2]);
					msg.channel.sendMessage("\u{1f4b5} " + args[1] + args[0] + " = " + args[2] + rate.toLocaleString(undefined, { minimumFractionDigits: rate<0.01?4:2, maximumFractionDigits: rate<0.01?4:2 })); }
					catch (e) { msg.channel.sendMessage("\u{1f4b5} Invalid exchange query."); }
				}
				else request(`http://api.fixer.io/latest?symbols=${args[1]},${args[2]}`, function(err, res, body) {
					if (!err && res.statusCode == 200) {
						fx.rates["EUR"] = 1;
						fx.rates = JSON.parse(body).rates;
						try { var rate = fx(args[0]).from(args[1]).to(args[2]);
						msg.channel.sendMessage("\u{1f4b5} " + args[1] + args[0] + " = " + args[2] + rate.toLocaleString(undefined, { minimumFractionDigits: rate<0.01?4:2, maximumFractionDigits: rate<0.01?4:2 })); }
						catch (e) { msg.channel.sendMessage("\u{1f4b5} Invalid exchange query."); }
					}
				});
			});
		}
	}
},

"weather": {
	desc: "Shows current weather for the given area.\nUSAGE: -weather [AREA]\nALIAS: w\nEXAMPLE: -weather New York",
	alias: ["w"],
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "weather", bot);  }
		else {
			var wreport;
			weather.setCity(cmd);
			weather.getAllWeather(function(err, res){
				if (res) {
					wreport = getWeatherIcon(res.weather[0].icon) + "__**Weather** for " + res.name + ", " + res.sys.country + "__ :flag_" + res.sys.country.toLowerCase() + ":";
					wreport += "\n" + res.main.temp + "°C / " + (res.main.temp*1.8+32).toFixed(2) + "°F, " + res.weather[0].description;
					wreport += "\n" + res.clouds.all + "% Clouds, Wind Speed " + (res.wind.speed*3.6).toFixed(2) + "km/h / " + (res.wind.speed*2.2369).toFixed(2) + "mph";
					wreport += "\n" + "Barometric Pressure: " + res.main.pressure + "hPa " + res.main.humidity + "% humidity";
					msg.channel.sendMessage(wreport);
				}
				else msg.channel.sendMessage(err);
			});
		}
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
				if (pastacmd === cmd) msg.channel.sendMessage(msga[0].code() + " does not exist!");
				else {
					pastaData[msg.guild.id][msga[0]] = pastacmd;
					jsonfile.writeFileSync('./pasta.json', pastaData, {spaces: 2});
					msg.channel.sendMessage(msga[0].code() + " added as custom command. Type `~" + msga[0] + "` to use it.");
				}
			}
		}
	}
},

"math": {
	desc: "Evaluates a mathematical expression. Refer to http://mathjs.org/docs/expressions/index.html for more details.\nUSAGE: -math [EXPRESSION]\nEXAMPLE: -math 1.2 * (2 + 4.5), -math 5.08 cm to inch, -math sin(45 deg) ^ 2, -math 9 / 3 + 2i, -math det([-1, 2; 3, 1])",
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "math", bot);  }
		else {
			msg.channel.sendMessage(math.eval(cmd));
		}
	}
},

"google": {
	desc: "Performs a Google search. Warning: Limited to 100 queries per day; please do not abuse.\nUSAGE: -google [SEARCH_TERM]\nALIAS: g\nEXAMPLE: -google Yahoo",
	alias: ["g"],
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (!cmd) { module.exports["help"].func(msg, "google", bot);  }
		else {
			var cs = google.customsearch('v1'), srcres = [];
			cs.cse.list({cx: authData.google_cx, auth: authData.google_apikey, q: cmd}, function (err, res) {
				if (err) msg.channel.sendMessage (err);
				else if (res.items && res.items.length > 0) {
					var reslen = res.items.length < 3 ? res.items.length : 3;
					var srcres = new Discord.RichEmbed({title: `Google Search for ${cmd}`, url: `https://www.google.com/search?q=${encodeURIComponent(cmd)}`, color: 0x2196f3});
					for (let i = 0; i < reslen; i++) { srcres.addField(res.items[i].title, `[${res.items[i].snippet}](${res.items[i].formattedUrl})`); }
					msg.channel.sendMessage("", {embed: srcres});
				}
			});
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

"virus": {
	desc: "Returns RE:RN virus data.\nUSAGE: -virus [VIRUSNAME]\nEXAMPLE: -virus CannonGuard2 EX",
	lvl: "rern",
	func: (msg, cmd, bot) => {
		if (msg.channel.id === "208746890932649995" || msg.channel.id === "268383263599493122") {
			var metool = bot.guilds.get("208498945343750144").emojis.get("278711463500316673");
			if (!cmd) { module.exports["help"].func(msg, "virus", bot);  }
			else {
				var found = false, foundkey = "", foundidx = 0;
				for (var key in virusData) {
					for (var i = 0; i <= 6; i++) {
						if (virusData[key].virus[i].name === cmd) {
							found = true; foundkey = key;	foundidx = i;
							break;
						}
					}
				}
				if (found) msg.channel.sendMessage(metool + " " + cmd.markbold() + "\n" + virusData[foundkey].virus[foundidx].desc.replace(/<br>/g,'\n').codeblock());
			}
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

"you": {
	desc: "Autism simulator.\nUSAGE:\n-you: Provides a (You).\n-you rank: Displays top 10 (You) gatherers.\n-you count: Displays someone's (You)s. Without a name, displays your own.\n-you roulette [NUMBER]: Gambles a specific amount of (You)s. Use `all` instead of a number to all-in. The house always wins.",
	lvl: "cheese",
	func: (msg, cmd, bot) => {
		if (msg.guild.id === "103851116512411648") {
			var youji = bot.guilds.get("103851116512411648").emojis.get("248962540837535745");
			switch (cmd.split(' ')[0]) {
				case "rank":
					var youRank = [], youRankDisp = [];
					for (var rankid in youData) youRank.push([youData[rankid][0], youData[rankid][1], rankid]);
					youRank.sort(function(a, b) { return b[1] - a[1];	});
					youRank = youRank.slice(0,9);
					for (let i = 0; i < youRank.length; i++){
						var rankname = msg.guild.members.get(youRank[i][2]).nickname ? msg.guild.members.get(youRank[i][2]).nickname : msg.guild.members.get(youRank[i][2]).user.username;
						youRankDisp.push(`[${i+1}] ${rankname}: ${youRank[i][1]}`);
					}
					msg.channel.sendMessage(`${youji}conomy Rankings: \n${youRankDisp.join("\n").codeblock("css")}`); break;
				case "count":
					if (cmd.split(' ')[1]) {
						var queryid = mention2id(cmd.split(' ')[1]);
						if (queryid in youData)	msg.channel.sendMessage(`${id2mention(queryid)} has ${youData[queryid][1].toString().code()} ${youji}s.`);
						else msg.channel.sendMessage(`Invalid ${youji} query.`);
					}
					else {
						if (msg.author.id in youData)	msg.channel.sendMessage(`${msg.author} has ${youData[msg.author.id][1].toString().code()} ${youji}s.`);
						else msg.channel.sendMessage(`${msg.author} has no ${youji}s.`);
					} break;
				case "roulette":
				  if (msg.channel.id === "284733446029312000" && cmd.split(' ')[1] && msg.author.id in youData) {
				    var bet = cmd.split(' ')[1];
				    if (new Date().getTime() - youData[msg.author.id][2] > 1800000) {
				      if (bet === "all") bet = youData[msg.author.id][1];
				      if (youData[msg.author.id][1] > 0 && bet > 0 && youData[msg.author.id][1] >= bet) {
				        if (d20.roll(10) > 6) {
				          youData[msg.author.id][1] += Number(bet);
									youData[msg.author.id][2] = new Date().getTime();
				          jsonfile.writeFileSync('./you.json', youData, {spaces: 2});
				          msg.channel.sendMessage(`\u{1f3b2} Victory! ${msg.author} now has ${youData[msg.author.id][1].toString().code()} ${youji}s.`);
				        }
				        else {
				            youData[msg.author.id][1] -= Number(bet);
										youData[msg.author.id][2] = new Date().getTime();
				            jsonfile.writeFileSync('./you.json', youData, {spaces: 2});
				            msg.channel.sendMessage(`\u{1f3b2} Loser! ${msg.author} now has ${youData[msg.author.id][1].toString().code()} ${youji}s.`);
				        }
				      }
				      else msg.channel.sendMessage(`\u{1f3b2} ${msg.author} doesn't have enough ${youji}s to bet.`);
				    }
						else msg.channel.sendMessage(`\u{1f3b2} ${msg.author}, please wait ${timeCounter((1800000 - new Date().getTime() + youData[msg.author.id][2])/1000)} until your next ${youji}s roulette.`);
				  } break;
				case "gift":
					if (msg.author.id === "91327883208843264") {
						var gift = cmd.split(' ')[1] ? cmd.split(' ')[1] : 3;
						for (user in youData) {
							youData[user][1] += Number(gift);
						}
						jsonfile.writeFileSync('./you.json', youData, {spaces: 2});
						msg.channel.sendMessage(`${msg.author} has gifted everyone ${gift} ${youji}s.`);
					} break;
				case "":
					if (msg.channel.id === "284733446029312000") {
						if (msg.author.id in youData) {
							if (youData[msg.author.id][0] <= (new Date().getTime() - new Date().getTime() % 86400000)) {
								youData[msg.author.id][0] = new Date().getTime();
								youData[msg.author.id][1] = youData[msg.author.id][1]+1;
								jsonfile.writeFileSync('./you.json', youData, {spaces: 2});
								msg.channel.sendMessage(`${msg.author} now has ${youData[msg.author.id][1].toString().code()} ${youji}s.`);
							}
							else msg.channel.sendMessage(`${msg.author}, please wait until midnight UTC, in ${timeCounter((86400000 - new Date().getTime() % 86400000)/1000)}, for your next ${youji}.`);
						}
						else {
							youData[msg.author.id] = [new Date().getTime(), 1, 0];
							jsonfile.writeFileSync('./you.json', youData, {spaces: 2});
							msg.channel.sendMessage(`${msg.author} now has 1 ${youji}.`);
						}
					} break;
				default: msg.channel.sendMessage(`Invalid ${youji} query.`);
			}
		}
	}
},

"declare": {
	desc: "Declares your intent to see some booty, or otherwise. Type in the next message exactly.\nUSAGE: -declare I am over the age of 18 and want to see some booty.: Adds 18+ role.\n-declare I don't want to see the booty anymore.: Removes 18+ role.",
	lvl: "zed",
	func: (msg, cmd, bot) => {
		if (msg.guild.id === "206956124237332480") {
			if (!cmd) { module.exports["help"].func(msg, "declare", bot);  }
			else switch (cmd){
				case "I am over the age of 18 and want to see some booty":
				case "I am over the age of 18 and want to see some booty.": msg.member.addRole("289910636199280640"); msg.channel.sendMessage("Please enjoy the booty."); break;
				case "I don't want to see the booty anymore":
				case "I don't want to see the booty anymore.": msg.member.removeRole("289910636199280640"); msg.channel.sendMessage("What a pure soul!"); break;
				default: msg.channel.sendMessage("Invalid declaration. Refer to `-help declare` for the appropriate ones.");
			}
		}
	}
},

"help": {
	desc: "Provides help on bot commands.\nUSAGE: -help: Lists all available commands to this user.\n-help [COMMAND]: Prints information on specific command.",
	lvl: "all",
	func: (msg, cmd, bot) => {
		if (!cmd) {
			var cmdlist = Object.keys(module.exports).filter(e => {
				switch (module.exports[e].lvl) {
					case "author": return msg.author.id === "91327883208843264";
					case "rern": return msg.guild.id === "208498945343750144";
					case "cheese": return msg.guild.id === "103851116512411648";
					case "zed": return msg.guild.id === "206956124237332480";
					default: return true;
				}
			}).map(e => e.code());
			msg.channel.sendMessage("Available commands: " + cmdlist.sort().join(", ") + ".\n\nUse `-help COMMAND` for more information.");
		}
		else msg.channel.sendMessage((cmd + ": " + module.exports[cmd].desc).codeblock());
	}
}

}

/* Miscellaneous Utility Functions */

String.prototype.markbold = function () { return "**" + this + "**"; }
String.prototype.markline = function () { return "__" + this + "__"; }
String.prototype.code = function () { return "`" + this + "`"; }
String.prototype.codeblock = function (lang="") { return "```" + lang + "\n" + this + "\n```"; }

function mention2id (str) {
	return str[2] === '!' ? str.slice(3,-1) : str.slice(2,-1);
}
function id2mention (str) {
	return "<@" + str + ">";
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
    var t = Math.floor(tval);
    var years = Math.floor(t / 31536000);
    t = t - (years * 31536000);
    var months = Math.floor(t / 2592000);
    t = t - (months * 2592000);
    var days = Math.floor(t / 86400);
    t = t - (days * 86400);
    var hours = Math.floor(t / 3600);
    t = t - (hours * 3600);
    var minutes = Math.floor(t / 60);
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
