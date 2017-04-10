var Discord = require('discord.js');
var request = require('request');
var cheerio = require('cheerio');
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

var msprog;

bot.login(authData.token_prog);

bot.on("ready", () => {
	console.log("ms prog online");
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
						if($('title').text() && $('title').text() !== "Error") {
							if (msg.guild.id === "208498945343750144") msg.channel.sendMessage(msprog + " Thread: " + $('title').text() + " (" + match + ")");
							else msg.channel.sendMessage("Thread: " + $('title').text() + " (" + match + ")");
						}
					}
				});
			}
		}
		/* Main Command Parser
		-- Backwards compatibility prefix for Cheesebox. TODO: Implement prefix configs.
		*/
		if (msgc[0] === '-' || (msgc[0] === '.' && msg.guild.id === "103851116512411648")) {
			var msgcmd = msgc.indexOf(' ') > -1 ? msgc.slice(msgc.indexOf(' ')+1) : '';
			var msgtype = msgc.split(' ')[0].slice(1);
			if (msgtype in commands) {
				if (checkLevel(msgtype, msg, bot)) commands[msgtype].func(msg, msgcmd, bot);
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
		/* Custom Command Parser
		-- Ensure that strikethroughs aren't parsed.
		*/
		else if (msgc[0] === '~' && msgc[1] && msgc[1] !== '~') {
			if (msg.guild.id in pastaData && 
			msga[0].slice(1) in pastaData[msg.guild.id] &&
			checkLevel("meme", msg, bot)) msg.channel.sendMessage(pastaData[msg.guild.id][msga[0].slice(1)]);
			else msg.channel.sendMessage(msga[0].slice(1).code() + " does not exist! If you were trying to use a command, use a hyphen `-` instead.").then(m => m.delete(5000));
		}
		/* Cleverbot Module
		-- Stuttering text with asterisk fix.
		-- Use Cleverbot.com with Cleverbot.io fallback.
		*/
		else if ((msg.isMentioned(bot.user) || msg.channel.type == 'dm') && blacklist.indexOf(msg.author.id) === -1) {
			var clrern = msg.channel.type != 'dm' && msg.guild.id === "208498945343750144";
			if (cleverstate) {
				clever.query(msgc, {cs: cleverstate})
				.then(res => {msg.channel.sendMessage(stutter(res.output, clrern));})
				.catch(e => {
					clever2.ask(msgc, function (err, res) {
  					msg.channel.sendMessage(stutter(res, clrern));
					});
				});
			} else {
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
});

/* Temporary Random Disconnect Workaround 
-- Track https://github.com/hydrabolt/discord.js/issues/1233 for issue resolution.
*/

bot.on("disconnect", (ev) => {
	if (ev.code === 1000) bot.destroy().then(() => bot.login(authData.token_prog));
});

function stutter(res, clrern){
	var result = res[0] === '*' ? '*' + res[1] + '-' + res.slice(1) : res[0] + '-' + res;
	return clrern ? msprog + " " + result : result;
}
