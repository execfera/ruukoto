var jsonfile = require('jsonfile');
var d20 = require('d20');
var youData = require(__root + "/storage/user/you.json");

module.exports = {
	desc: "Autism simulator.\nUSAGE:\n-you: Provides a (You).\n-you rank: Displays top 10 (You) gatherers.\n-you count: Displays someone's (You)s. Without a name, displays your own.\n-you roulette [NUMBER]: Gambles a specific amount of (You)s. Use `all` instead of a number to all-in. The house always wins.",
	lvl: "cheese",
	func (msg, cmd, bot) {
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
					msg.channel.send(`${youji}conomy Rankings: \n${youRankDisp.join("\n").codeblock("css")}`); break;
				case "count":
					if (cmd.split(' ')[1]) {
						var queryid = cmd.split(' ')[1].mention2id();
						if (queryid in youData)	msg.channel.send(`${queryid.mention2id()} has ${youData[queryid][1].toString().code()} ${youji}s.`);
						else msg.channel.send(`Invalid ${youji} query.`);
					}
					else {
						if (msg.author.id in youData)	msg.channel.send(`${msg.author} has ${youData[msg.author.id][1].toString().code()} ${youji}s.`);
						else msg.channel.send(`${msg.author} has no ${youji}s.`);
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
				          jsonfile.writeFileSync(__root + "/storage/user/you.json", youData, {spaces: 2});
				          msg.channel.send(`\u{1f3b2} Victory! ${msg.author} now has ${youData[msg.author.id][1].toString().code()} ${youji}s.`);
				        }
				        else {
				            youData[msg.author.id][1] -= Number(bet);
										youData[msg.author.id][2] = new Date().getTime();
				            jsonfile.writeFileSync(__root + "/storage/user/you.json", youData, {spaces: 2});
				            msg.channel.send(`\u{1f3b2} Loser! ${msg.author} now has ${youData[msg.author.id][1].toString().code()} ${youji}s.`);
				        }
				      }
				      else msg.channel.send(`\u{1f3b2} ${msg.author} doesn't have enough ${youji}s to bet.`);
				    }
						else msg.channel.send(`\u{1f3b2} ${msg.author}, please wait ${(1800000 - new Date().getTime() + youData[msg.author.id][2]).timeCounter()} until your next ${youji}s roulette.`);
				  } break;
				case "gift":
					if (msg.author.id === "91327883208843264") {
						var gift = cmd.split(' ')[1] ? cmd.split(' ')[1] : 3;
						for (user in youData) {
							youData[user][1] += Number(gift);
						}
						jsonfile.writeFileSync(__root + "/storage/user/you.json", youData, {spaces: 2});
						msg.channel.send(`${msg.author} has gifted everyone ${gift} ${youji}s.`);
					} break;
				case "":
					if (msg.channel.id === "284733446029312000") {
						if (msg.author.id in youData) {
							if (youData[msg.author.id][0] <= (new Date().getTime() - new Date().getTime() % 86400000)) {
								youData[msg.author.id][0] = new Date().getTime();
								youData[msg.author.id][1] = youData[msg.author.id][1]+1;
								jsonfile.writeFileSync(__root + "/storage/user/you.json", youData, {spaces: 2});
								msg.channel.send(`${msg.author} now has ${youData[msg.author.id][1].toString().code()} ${youji}s.`);
							}
							else msg.channel.send(`${msg.author}, please wait until midnight UTC, in ${(86400000 - new Date().getTime() % 86400000).timeCounter()}, for your next ${youji}.`);
						}
						else {
							youData[msg.author.id] = [new Date().getTime(), 1, 0];
							jsonfile.writeFileSync(__root + "/storage/user/you.json", youData, {spaces: 2});
							msg.channel.send(`${msg.author} now has 1 ${youji}.`);
						}
					} break;
				default: msg.channel.send(`Invalid ${youji} query.`);
			}
		}
	}
}