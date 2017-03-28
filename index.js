var Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
require("./strutil");
var bot = new Discord.Client();

global.__root = require('path').resolve(__dirname);

var	commands = require("./commands");
var	authData = require("./storage/auth.json");
var pastaData = require("./storage/user/pasta.json");

var cleverbot = require("cleverbot"), clever = new cleverbot({key: authData.clever_key}), cleverstate;
var cleverbot2 = require("cleverbot.io"), clever2 = new cleverbot2(authData.clever2_user,authData.clever2_key);
clever2.setNick("RUUKOTO_DISCBOT");
clever2.create(function (err, session) {});

var msprog;

bot.login(authData.token);

bot.on("ready", () => {
	console.log("freliabot online");
	bot.user.setGame("with Mr. Prog");
	msprog = bot.guilds.get("208498945343750144").emojis.get("264615769285984256");
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
						if($('title').text() && $('title').text() !== "Error"){
							if (msg.guild.id === "208498945343750144") msg.channel.sendMessage(msprog + " Thread: " + $('title').text() + " (" + match + ")");
							else msg.channel.sendMessage("Thread: " + $('title').text() + " (" + match + ")");
						}
					}
				});
			}
		}
		/* Main Command Parser
		-- Backwards compatibility prefix for Cheesebox.
		-- Weather alias.
		*/
		if (msgc[0] === '-' || (msgc[0] === '.' && msg.guild.id === "103851116512411648")) {
			var msgcmd = msgc.indexOf(' ') > -1 ? msgc.slice(msgc.indexOf(' ')+1) : '';
			var msgtype = msgc.split(' ')[0].slice(1);
			if (msgtype in commands) {
				if (commands[msgtype].lvl !== "author" || msg.author.id === "91327883208843264") 
				{ 
					commands[msgtype].func(msg, msgcmd, bot);
				}
			} else {
				for (cmd in commands) {
					if ("alias" in commands[cmd]) {
						for (let i = 0; i < commands[cmd].alias.length; i++) {
							if (msgtype === commands[cmd].alias[i] && (commands[cmd].lvl !== "author" || msg.author.id === "91327883208843264")) commands[cmd].func(msg, msgcmd, bot);
						}
					}
				}
			}
		}
		/* Custom Command Parser
		-- Ensure that strikethroughs aren't parsed.
		*/
		else if (msgc[0] === '~' && msgc[1] && msgc[1] !== '~') {
			if (msg.guild.id in pastaData && msga[0].slice(1) in pastaData[msg.guild.id]) { msg.channel.sendMessage(pastaData[msg.guild.id][msga[0].slice(1)]); }
			else msg.channel.sendMessage(msga[0].slice(1).code() + " does not exist! If you were trying to use a command, use a hyphen `-` instead.").then(m => m.delete(5000));
		}
		/* Cleverbot Module
		-- Stuttering text with asterisk fix.
		-- Use Cleverbot.com with Cleverbot.io fallback.
		*/
		else if (msg.isMentioned(bot.user) || msg.channel.type == 'dm') {
			var clrern = msg.channel.type != 'dm' && msg.guild.id === "208498945343750144";
			if (cleverstate) {
				clever.query(msgc, {cs: cleverstate})
				.then(res => {msg.channel.sendMessage(stutter(res.output, clrern));})
				.catch(e => {
					clever2.ask(msgc, function (err, res) {
  					msg.channel.sendMessage(stutter(res, clrern));
					});
				});
			}	else {
				clever.query(msgc)
				.then(res => {msg.channel.sendMessage(stutter(res.output, clrern)); cleverstate = res.cs;})
				.catch(e => {
					clever2.ask(msgc, function (err, res) {
  					msg.channel.sendMessage(stutter(res, clrern));
					});
				});
			}
		}
	}

});

/* Bomber Autokick
-- Make bot a little nicer.
*/

bot.on("presenceUpdate", (oldUser, newUser) => {
	if (oldUser.guild.id === "208498945343750144" && oldUser.user.username === "Bomber" && newUser.user.presence.status === "offline") {
		newUser.kick();
		newUser.guild.defaultChannel.sendMessage(msprog + " See you later, Bomber!");
	}
});

/* Greet/Leave Module
-- Don't greet Bomber, because he's a dum.
*/

bot.on("guildMemberAdd", (newUser) => {
	if (newUser.guild.id === "208498945343750144") {
		if (newUser.user.username === "Bomber") newUser.addRole('265271322832142336');
		else newUser.guild.defaultChannel.sendMessage(msprog + " Welcome to the RE:RN chat, " + newUser.user.username + "!");
	}
	if (newUser.guild.id === "103851116512411648") newUser.guild.defaultChannel.sendMessage("Welcome to the Cheesebox, " + newUser.user.username + "!");
	if (newUser.guild.id === "206956124237332480") {
		newUser.guild.defaultChannel.sendMessage("Welcome to Zedart, " + newUser.user.username + "!");
		newUser.addRole('276871780352917504');
	}
});

bot.on("guildMemberRemove", (oldUser) => {
	if (oldUser.guild.id === "103851116512411648") oldUser.guild.defaultChannel.sendMessage(oldUser.user.username + " didn't fly so good. Who wants to try next?").then(m => m.react("\u{1f1eb}"));
});

/* Voice Channel Tracker
-- Restrict to Cheesebox for now.
*/

bot.on("voiceStateUpdate", (oldUser, newUser) => {
	if (oldUser.guild.id === "103851116512411648") {
		var cheesedebug = bot.channels.get("211941895729971200");
		if (!(oldUser.voiceChannel) && newUser.voiceChannel) cheesedebug.sendMessage((newUser.nickname || newUser.user.username) + ' has joined ' + newUser.voiceChannel.name + ".");
		else if (!(newUser.voiceChannel) && oldUser.voiceChannel) cheesedebug.sendMessage((oldUser.nickname || oldUser.user.username) + ' has left ' + oldUser.voiceChannel.name + ".");
		else if (oldUser.voiceChannel.name !== newUser.voiceChannel.name) {
			cheesedebug.sendMessage((oldUser.nickname || oldUser.user.username) + ' has moved from ' + oldUser.voiceChannel.name + " to " + newUser.voiceChannel.name + ".");
		}
	}
});

function stutter(res, clrern){
	var result = res[0] === '*' ? '*' + res[1] + '-' + res.slice(1) : res[0] + '-' + res;
	return clrern ? msprog + " " + result : result;
}
