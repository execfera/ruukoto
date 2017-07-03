module.exports = {
	desc: "Exports conversation logs.\nUSAGE: -logs, -logs -dm [USER_ID], -logs -text [CHANNEL_ID]. Add a limit number after the ID for message limit.",
	lvl: "all",
	func (msg, cmd, bot) {
		var location, contents = [];
		var args = cmd.split(' ');
		if (!cmd) location = msg.channel;
		else if (args[0][0] === '-' && args[1]) {
			if (args[0].slice(1) === "dm") location = bot.users.get(args[1]).dmChannel; 
			else if (args[0].slice(1) === "text") location = bot.channels.get(args[1]);
			var limit = args[2] ? args[2] : 100;
		}
		var locationName = location.type === "dm" ? "DM_" + location.recipient.username : "Channel_" + location.name;
		if (limit <= 100) { 
			location.fetchMessages({limit: limit}).then(messages => {
				messages.forEach(function(elem) { contents.push(`[${elem.createdAt.toString().split(' ')[4]}] ${elem.author.username}: ${elem.content}`); });
				msg.channel.send({file: {attachment: Buffer.from(contents.reverse().join('\n')), name: `Logs_${locationName}.txt`}});
			});
		}
		else {
			function recFetch (lastid, cont) { 
				return location.fetchMessages({limit: limit <= 100 ? limit : 100, before: lastid}).then(messages => {
					var recId;
					messages.forEach(function(elem) { 
						cont.push(`[${elem.createdAt.toString().split(' ')[4]}] ${elem.author.username}: ${elem.content}`);
						recId = elem.id;
					});
					limit -= 100;
					return limit > 0 ? recFetch(recId, cont) : cont;
				})
				.catch(e => console.error(e));
			}
			recFetch(undefined, contents).then(contents => {
				msg.channel.send({file: {attachment: Buffer.from(contents.reverse().join('\n')), name: `Logs_${locationName}.txt`}});
			})
			
		}
	}
}