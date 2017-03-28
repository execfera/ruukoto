module.exports = {
	desc: "Prunes the bot's last X messages. If no number is given, deletes all of the bot's messages in the last 50 messages.\nUSAGE: -prune, -prune [NUMBER]\nEXAMPLE: -prune, -prune 20",
	lvl: "all",
	func (msg, cmd, bot) {
		var limit = cmd || 50, count = 0;
		msg.channel.fetchMessages({limit: limit}).then(messages => {
			for (var i = 0; i < messages.array().length; i++) {
				if (messages.array()[i].author.id === bot.user.id) { messages.array()[i].delete(); count++; }
			}
			msg.channel.sendMessage("Deleted " + count + " message" + (count > 1 ? "s" : "")).then(m => m.delete(5000));
		});
	}
}