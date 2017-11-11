module.exports = {
	desc: "Exports conversation logs.\nUSAGE: -logs, -logs -dm [USER_ID], -logs -text [CHANNEL_ID]. Add a -limit parameter for message limit (default: 100 messages). Set limit as -1 to fetch the entire channel's history.",
	lvl: "all",
	func (msg, cmd, bot) {
		var location, contents = [];
		var args = cmd.split(' ');
		if (args.indexOf('-dm') > -1) location = bot.users.get(args[args.indexOf('-dm')+1]).dmChannel; 
		if (args.indexOf('-text') > -1) location = bot.channels.get(args[args.indexOf('-text')+1]);
		location = location ? location : msg.channel;
		var locationName = location.type === "dm" ? "DM_" + location.recipient.username : "Channel_" + location.name;
		var limit = args.indexOf('-limit') > -1 ? Number(args[args.indexOf('-limit')+1]) : 100;
		if (limit === -1) limit = Number.MAX_SAFE_INTEGER;
		function recFetch (lastid, cont) { 
			return location.fetchMessages({limit: 100, before: lastid}).then(messages => {
				var recId;
				messages.forEach(function(elem) { 
					cont.push(`[${elem.createdAt.toISOString().slice(0,-8)}] ${elem.author.username}: ${elem.content}`);
					recId = elem.id;
				});
				limit -= 100;
				return (limit <= 0 || messages.size < 100) ? cont : recFetch(recId, cont);
			})
			.catch(e => console.error(e));
		}
		recFetch(undefined, contents).then(contents => {
			msg.channel.send({file: {attachment: Buffer.from(contents.reverse().join('\n')), name: `Logs_${locationName}.txt`}});
		});			
	}
}