module.exports = {
	desc: "Prints the bot's invite link.\nUSAGE: -invite",
	lvl: "author",
	func (msg, cmd, bot) {
		bot.generateInvite().then(link => msg.channel.sendMessage(link));
	}
}