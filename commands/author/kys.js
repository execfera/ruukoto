module.exports = {
	desc: "Restarts the bot.\nUSAGE: -kys",
	lvl: "author",
	func (msg, cmd, bot) {
		msg.channel.send("\u{1f503} Restarting.").then(m => process.exit());
	}
}