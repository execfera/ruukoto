var Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio'); 
var cleverbot = require('cleverbot-node');
var d20 = require('d20');
var puppy = require('random-puppy');
var localip = require('local-ip');
var weather = require('openweather-apis');
var jsonfile = require('jsonfile');

var bot = new Discord.Client();
var clever = new cleverbot;

var rern, cheesebox; 
var mrprog; 
var rernmain, frfroverlord, cheesegen, cheesedebug; 

var authData = require('./auth.json');
var chipData = require('./chip.json');
var traderData = require('./trader.json');
var pastaData = require('./pasta.json');

bot.login(authData.token);
weather.setAPPID(authData.openweatherkey);
weather.setLang('en');
weather.setUnits('metric');
cleverbot.prepare(function(){});

bot.on("ready", () => {	
	console.log('freliabot online');
	bot.user.setGame('with Mr. Prog');
	setTimeout(function() {	kickBomber(); }, 5000);
	/*guild hardcode*/
	rern = bot.guilds.get("208498945343750144");
	cheesebox = bot.guilds.get("103851116512411648");
	/*emoji hardcode*/
	mrprog = rern.emojis.find("name", "MsProg");
	chipmoji = rern.emojis.find("name", "BattleChip");
	/*channel hardcode*/
	frfroverlord = bot.channels.get('189911150001913856');
	rernmain = bot.channels.get("208498945343750144");
	cheesegen = bot.channels.get("103851116512411648");
	cheesedebug = bot.channels.get("211941895729971200");
});

bot.on("message", (msg) => { 
	var msgc = msg.content; 
	if (msg.author != bot.user) {
		
		/* RE:RN Thread Title Parser */
		if (msgc.indexOf('zetaboards.com/RockmanChaosNetwork') > -1 && !msg.webhookID) { 
			var exurl = msgc.match(/http:\/\/s10.zetaboards.com\/RockmanChaosNetwork\/topic\/[^ \n]*/i); 
			if (exurl && exurl[0]) { 
				request(exurl[0], function(err, res, body) { 
					if (!err && res.statusCode == 200) { 
						var $ = cheerio.load(body); var match = $('li','#nav').eq(-3).text();
						if($('title').text()){ 
							if (msg.guild == rern) msg.channel.sendMessage(mrprog + " Thread: " + $('title').text() + " (" + match + ")");
							else msg.channel.sendMessage("Thread: " + $('title').text() + " (" + match + ")"); 
						} 
					} 
				}); 
			} 	
		} 

		var msga = msgc.split(' '); 
		if (msga[0].slice(0,1) === '-' || (msga[0].slice(0,1) === '.' && msg.guild.id === '103851116512411648') { 
			var msgcmd = msgc.slice(msgc.indexOf(' ')+1); 
			if (msg.author.id === '91327883208843264') {
				switch (msga[0].slice(1)){ 
				/* Author Commands */
					case 'ec-debug': frfroverlord.sendMessage('Debug: ' + msgcmd); break; 
					case 'ec-rern': rernmain.sendMessage(mrprog + ' ' + msgcmd); break;
					case 'ec-cheese': cheesegen.sendMessage(msgcmd); break;
					case 'duel': try {
						var id1 = mention2id(msga[1]);
						var id2 = mention2id(msga[2]);
						var winner, loser;
						if (id1 == id2) throw true;
						if (Math.floor(Math.random()*2) == 0) { winner = id1; loser = id2; }
						else { winner = id2; loser = id1; }
						msg.channel.sendMessage('Basic coinflip duel test: \nWinner: ' + bot.users.get(winner).username + '\nLoser: ' + bot.users.get(loser).username);
						break;	}
					catch (e) { msg.channel.sendMessage('Invalid duel participants! Please use @ mentions and two different members.'); break; }
					case 'raw': msg.channel.sendMessage("```\n" + msgcmd + "\n```"); break;
					case 'eval': try { var evalres = eval(msgcmd); } 
						catch (e) { var evalres = e; } 
						finally { msg.channel.sendMessage(evalres); break; }
					case 'kys': msg.channel.sendMessage("\u{1f503} Restarting."); bot.destroy(); break;
					case 'ip': { localip('wlan0', function(err, res) {
									msg.channel.sendMessage('\u{1f50c} Local IP address on wlan0: ' + res); 
								}); break; }
				}
			}
			switch (msga[0].slice(1)){
			/* Public Commands */
					case 'choose': {
						var choices = msgcmd.split(',');
						msg.channel.sendMessage('\u{1f5f3} I choose ' + choices[Math.floor(Math.random() * choices.length)].trim() + '!'); break;
					}
					case 'ping': msg.channel.sendMessage("\u{1f493} Heartbeat OK: " + Math.trunc(bot.ping) + "ms"); break;
					case 'echo': msg.channel.sendMessage(msgcmd); break;
					case 'roll': msg.channel.sendMessage('\u{1f3b2} ' + d20.roll(msgcmd)); break;
					case 'roll+': msg.channel.sendMessage('\u{1f3b2} ' + d20.roll(msgcmd, true).join(', ')); break;
					case 'avatar': { if (msga[1]) msg.channel.sendMessage(bot.users.get(mention2id(msga[1])).displayAvatarURL); 
					else msg.channel.sendMessage(bot.users.get(msg.author.id).displayAvatarURL); } break;
					case 'chip': { 
						var ccontent = chipData[msgcmd].desc.replace(/<br>/g,'\n')/*.replace(/([^:\n].*:)/g, function (m,p1) { return '**' + p1 + '**';})*/;
						var ctitle = msg.guild == rern ? chipmoji + ' ' + msgcmd : msgcmd;
						msg.channel.sendMessage('**' + ctitle + '**\n```\n' + ccontent + '```'); break; 
					}
					case 'trader': msg.channel.sendMessage('\u{1f5f3} Result: ' + traderoll(msgcmd)); break;
					case 'dog': puppy().then(url => { msg.channel.sendMessage('\u{1f415} ' + url);	}); break;
					case 'w':
					case 'weather': try {
						var wreport;
						weather.setCity(msgcmd);
						weather.getAllWeather(function(err, res){
							wreport = getWeatherIcon(res.weather[0].icon) + "__**Weather** for " + res.name + ", " + res.sys.country + "__ :flag_" + res.sys.country.toLowerCase() + ":";
							wreport += "\n" + res.main.temp + "°C / " + (res.main.temp*1.8+32).toFixed(2) + "°F, " + res.weather[0].description;
							wreport += "\n" + res.clouds.all + "% Clouds, Windspeed " + res.wind.speed + "m/s";
							wreport += "\n" + "Barometric pressure: " + res.main.pressure + "hpa " + res.main.humidity + "% humidity";
							msg.channel.sendMessage(wreport);
						});
					} catch (e) { msg.channel.sendMessage("Weather error: " + e); } break;
					case 'meme': {
						if (!(msga[1])) { msg.channel.sendMessage("```\nUsage:\n-meme COMMAND OUTPUT: Adds custom command.\n-meme COMMAND: Deletes custom command.\n-meme -list: List server commands and sends to file.\n~COMMAND: Use custom command.```"); break; }
						if (msga[1] === '-list' && msg.guild.id in pastaData) { msg.channel.sendFile(Buffer.from(Object.keys(pastaData[msg.guild.id]).join(', '), 'utf8'), 'commands.txt'); break; }
						else if (msga[1][0] === '~' || msga[1][0] === '-') { msg.channel.sendMessage("Invalid command format."); }
						else {	
							if (!(msg.guild.id in pastaData)) pastaData[msg.guild.id] = { "echo": "echo" };
							var pastacmd = msgcmd.slice(msgcmd.indexOf(' ')+1);
							if (pastaData[msg.guild.id][msga[1]]) { 
								if (pastacmd === msgcmd) { 
									delete pastaData[msg.guild.id][msga[1]];
									jsonfile.writeFileSync('./pasta.json', pastaData, {spaces: 2}); 
									msg.channel.sendMessage("`" + msga[1] + "` cleared."); break;
								}
								msg.channel.sendMessage("`" + msga[1] + "` already exists!"); break; 
							}
							pastaData[msg.guild.id][msga[1]] = pastacmd;
							jsonfile.writeFileSync('./pasta.json', pastaData, {spaces: 2});
							msg.channel.sendMessage("`" + msga[1] + "` added as custom command. Type `~" + msga[1] + "` to use it.");
						}
					} break;
			}
		}
		else if (msga[0][0] === '~' && msga[0][1] !== '~') { 
			if (msg.guild.id in pastaData && msga[0].slice(1) in pastaData[msg.guild.id]) { msg.channel.sendMessage(pastaData[msg.guild.id][msga[0].slice(1)]); }
			else msg.channel.sendMessage("`" + msga[0].slice(1) + "` does not exist!");
		}
		/* Cleverbot */
		else if (msg.isMentioned(bot.user) || msg.channel.type == 'dm') {
			try { clever.write(msgc, function(res){
				if (msg.channel.type != 'dm' && msg.guild.id === "208498945343750144") msg.channel.sendMessage(mrprog + " " + res.message);
				else { 
					if (res.message[0] === '*') msg.channel.sendMessage('*' + res.message[1] + '-' + res.message.slice(1));
					else msg.channel.sendMessage(res.message[0] + '-' + res.message);
				}
			});
			} catch (e) { frfroverlord.sendMessage(e); }
		}
	}
});

/* Bomber Autokick/Automod */

function kickBomber () { 
	bot.guilds.get("208498945343750144").members.forEach(function (memObj, memKey) { 
		if (memObj.user.presence.status === "offline" && memObj.user.username === "Bomber") { 
		memObj.kick(); 
		rernmain.sendMessage(mrprog + " Good night, Bomber!"); } 
	});
}

bot.on("presenceUpdate", (oldUser, newUser) => { 
	if (oldUser.guild == rern && oldUser.user.username === "Bomber" && newUser.user.presence.status === "offline") kickBomber();
});

bot.on("guildMemberAdd", (newUser) => { 
	if (newUser.guild == rern) {
		if (newUser.user.username === "Bomber") newUser.addRole('265271322832142336');
		else rernmain.sendMessage(mrprog + " Welcome to the RE:RN chat, " + newUser.user.username + "!");
	}
	if (newUser.guild == cheesebox) cheesegen.sendMessage("Welcome to the Cheesebox, " + newUser.user.username + "!");
});

bot.on("guildMemberRemove", (oldUser) => { 
	if (oldUser.guild == cheesebox) cheesegen.sendMessage(oldUser.user.username + " didn't fly so good. Who wants to try next?");
});

/* Voice Channel Tracker */

bot.on("voiceStateUpdate", (oldUser, newUser) => { 
	if (oldUser.guild == cheesebox) {
		if (!(oldUser.voiceChannel) && newUser.voiceChannel) cheesedebug.sendMessage((newUser.nickname || newUser.user.username) + ' has joined ' + newUser.voiceChannel.name + ".");
		else if (!(newUser.voiceChannel) && oldUser.voiceChannel) cheesedebug.sendMessage((oldUser.nickname || oldUser.user.username) + ' has left ' + oldUser.voiceChannel.name + ".");
		else if (oldUser.voiceChannel.name !== newUser.voiceChannel.name) {
			cheesedebug.sendMessage((oldUser.nickname || oldUser.user.username) + ' has moved from ' + oldUser.voiceChannel.name + " to " + newUser.voiceChannel.name + ".");
		}
	}
});

/* Misc Functions */

function mention2id (str) {
	return str.slice(2,3) === '!' ? str.slice(3,-1) : str.slice(2,-1);
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

function sendRich (content, channel, color = 0x222222, title = '', thumbnail = '') {
	channel.sendMessage("", { embed: new Discord.RichEmbed({ title: title, description: content, thumbnail: thumbnail, color: color, fields: [] }) });
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