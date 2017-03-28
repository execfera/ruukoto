module.exports = {
	desc: "Prints out the bot's pings and time offset.\nUSAGE: -ping",
	lvl: "all",
	func (msg, cmd, bot) {
		var sent = new Date().getTime();
		msg.channel.sendMessage("\u{1f493} Heartbeat OK: " + Math.trunc(bot.ping) + "ms.")
			.then(m => m.edit(`${m.content} Ping OK: ${new Date().getTime() - sent} ms. Discord Time Offset: ${Math.abs(m.createdTimestamp - new Date().getTime()).timeCounter()}.`));
	}
}