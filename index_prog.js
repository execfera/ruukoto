var Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
var schedule = require('node-schedule');
var bot = new Discord.Client();

require("./strutil");
global.__root = require('path').resolve(__dirname);

var	commands = require("./commands").commands;
var checkLevel = require("./commands").checkLevel;
var	authData = require("./storage/auth.json");
var blacklist = require("./storage/blist.json");
var birthData = require("./storage/birthdays.json");
var pastaData = require("./storage/user/pasta.json");

var cleverbot = require("cleverbot"), clever = new cleverbot({key: authData.clever_key}), cleverstate;
var cleverbot2 = require("cleverbot.io"), clever2 = new cleverbot2(authData.clever2_user,authData.clever2_key);
clever2.setNick("RUUKOTO_DISCBOT");
clever2.create(function (err, session) {});

var msprog;

bot.login(authData.token_prog);
bot.music = {};
bot.schedules = {'208498945343750144': {}};

bot.on("ready", () => {
	console.log("ms prog online");
	bot.user.setGame("with Mr. Prog");
	msprog = bot.guilds.get("208498945343750144").emojis.get("264615769285984256");
	birthData['208498945343750144'].forEach(usr => {
		if (bot.schedules['208498945343750144'][usr[0]]) bot.schedules['208498945343750144'][usr[0]].cancel();
		bot.schedules['208498945343750144'][usr[0]] = schedule.scheduleJob({ hour: 0, minute: 5, month: usr[2]-1, date: usr[3]}, function(){
			if (bot.channels.get('208498945343750144').members.has(usr[0])) bot.channels.get('208498945343750144').send(`${msprog} Happy birthday, <@${usr[0]}>!`);
		});
	});
});

bot.on("message", (msg) => {
	var msgc = msg.content;
	var msga = msgc.split(' ');
	if (msg.author.id !== bot.user.id) {
		/* RE:RN Thread Title Parser
		-- Ensure that it doesn't parse webhooks.
		*/
		if (msgc.indexOf('zetaboards.com/RockmanChaosNetwork') > -1 && !msg.webhookID) {
			var exurl = msgc.match(/http:\/\/s10.zetaboards.com\/RockmanChaosNetwork\/topic\/[^ \n]*/i);
			if (exurl && exurl[0]) {
				request(exurl[0], function(err, res, body) {
					if (!err && res.statusCode == 200) {
						var $ = cheerio.load(body); var match = $('li','#nav').eq(-3).text();
						if($('title').text() && $('title').text() !== "Error") {
							if (msg.guild.id === "208498945343750144") msg.channel.send(msprog + " Thread: " + $('title').text() + " (" + match + ")");
							else msg.channel.send("Thread: " + $('title').text() + " (" + match + ")");
						}
					}
				});
			}
		}
		/* Main Command Parser
		-- TODO: Implement prefix configs.
		*/
		if (msgc[0] === '-') {
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
			var clrern = msg.channel.type != 'dm' && msg.guild.id === "208498945343750144";
			if (cleverstate) {
				clever.query(msgc, {cs: cleverstate})
				.then(res => {msg.channel.send(stutter(res.output, clrern));})
				.catch(e => {
					clever2.ask(msgc, function (err, res) {
  					msg.channel.send(stutter(res, clrern));
					});
				});
			} else {
				clever.query(msgc)
				.then(res => {msg.channel.send(stutter(res.output, clrern)); cleverstate = res.cs;})
				.catch(e => {
					clever2.ask(msgc, function (err, res) {
  					msg.channel.send(stutter(res, clrern));
					});
				});
			}
		}
	}

});

/* Greet/Leave Module
-- Don't greet Bomber, because he's a dum.
*/

bot.on("guildMemberAdd", (newUser) => {
	if (newUser.guild.id === "208498945343750144") {
		if (newUser.user.username === "Bomber") {
			newUser.guild.members.find(val => val.roles.has('265271322832142336')).kick();
			newUser.addRole('265271322832142336');
		} 
		else newUser.guild.defaultChannel.send(msprog + " Welcome to the RE:RN chat, " + newUser.user.username + "!");
	}
});

bot.on("voiceStateUpdate", (oldUser, newUser) => {
	var debug;
	switch (oldUser.guild.id) {
		case "208498945343750144": debug = bot.channels.get("268383263599493122"); break;	
	}
	if (debug) {
		if (!(oldUser.voiceChannel) && newUser.voiceChannel) debug.send((newUser.nickname || newUser.user.username) + ' has joined ' + newUser.voiceChannel.name + ".");
		else if (!(newUser.voiceChannel) && oldUser.voiceChannel) debug.send((oldUser.nickname || oldUser.user.username) + ' has left ' + oldUser.voiceChannel.name + ".");
		else if (oldUser.voiceChannel.name !== newUser.voiceChannel.name) {
			debug.send((oldUser.nickname || oldUser.user.username) + ' has moved from ' + oldUser.voiceChannel.name + " to " + newUser.voiceChannel.name + ".");
		}
	}	
});

function stutter(res, clrern){
	var result = res[0] === '*' ? '' : res[0] + '-' + res;
	return clrern ? msprog + " " + result : result;
}
