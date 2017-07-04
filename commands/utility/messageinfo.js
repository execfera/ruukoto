module.exports = {
	desc: "Returns message info about the requested user. If no user is provided, returns info about the requester. Use '-all' parameter to display a leaderboard of highest message counts and '-full' to display all message counts in a file.\nUSAGE: -messageinfo, -messageinfo [@USER_MENTION]\nEXAMPLE: -messageinfo @Ms. Prog#1162",
	lvl: "all",
	func (msg, cmd, bot) {
		var userid;
		if (!cmd) userid = msg.author.id;
		else if (cmd === '-all' || cmd === '-full') userid = 0;
		else userid = cmd.mention2id();
		var content = "";
		(async () => {
    		if (userid === 0) {
				if (msg.guild.members.size !== msg.guild.memberCount) await msg.guild.fetchMembers();
				var uarray = msg.guild.members.keyArray();
				var utotals = [], urates = [], utrank = [], urrank = [];
				for (let i = 0; i < uarray.length; i++) {
					utrank.push(i); urrank.push(i);
				}
				for (let i = 0; i < msg.guild.members.size; i++) {
					let msgsrc = await msg.guild.search({author: uarray[i], sortOrder: "asc", limit: 1});
					let firstmsg = msgsrc.totalResults ? msgsrc.messages[0].find(m => m.hit).createdTimestamp : 0;
					utotals.push(msgsrc.totalResults);
					urates.push((msgsrc.totalResults*86400000/(new Date().getTime() - firstmsg)).toFixed(2));
				}
				var compare = function(arr) {
					return function(a, b) {
						return ((Number(arr[a]) < Number(arr[b])) ? 1 : ((Number(arr[a]) > Number(arr[b])) ? -1 : 0));
					};
				};
				utrank = utrank.sort(compare(utotals));
				urrank = urrank.sort(compare(urates));
				var ranklimit = cmd === '-all' ? 10 : uarray.length;
				content += "Total Messages:\n";
				for (let i = 0; i < ranklimit; i++) {
					if (utotals[utrank[i]]) {
						let rankname = msg.guild.members.get(uarray[utrank[i]]).nickname ? `${msg.guild.members.get(uarray[utrank[i]]).user.username} (${msg.guild.members.get(uarray[utrank[i]]).nickname})` : msg.guild.members.get(uarray[utrank[i]]).user.username;
						content += `[${i+1}] ${rankname}: ${utotals[utrank[i]]}\n`;
					}
				}
				content += "\nMessages Per Day:\n";
				for (let i = 0; i < ranklimit; i++) {
					if (urates[urrank[i]]) {
						let rankname = msg.guild.members.get(uarray[urrank[i]]).nickname ? `${msg.guild.members.get(uarray[urrank[i]]).user.username} (${msg.guild.members.get(uarray[urrank[i]]).nickname})` : msg.guild.members.get(uarray[urrank[i]]).user.username;
						content += `[${i+1}] ${rankname}: ${urates[urrank[i]]}\n`;
					}
				}
				if (cmd === '-all' || content.length <= 1900) msg.channel.send(content.codeblock("css"));
				else msg.channel.send({file: {attachment: Buffer.from(content), name: 'msgrank.txt'}});
			}
			else {
				var msgsrc = await msg.guild.search({author: userid, sortOrder: "asc", limit: 1});
				var firstmsg = msgsrc.totalResults ? msgsrc.messages[0].find(m => m.hit).createdTimestamp : 0;
				content += `Server messages for ${msg.guild.members.get(userid).user.tag}: \`${msgsrc.totalResults} (${(msgsrc.totalResults*86400000/(new Date().getTime() - firstmsg)).toFixed(2)} per day since ${firstmsg ? new Date(firstmsg).toUTCString() : 'never'})\`\n`;
				msg.channel.send(content);
			}
		})();
		
	}
}