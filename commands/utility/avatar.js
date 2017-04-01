module.exports = {
	desc: "Prints out the high-quality version of user given. If none given, prints out command user's avatar.\nUSAGE: -avatar, -avatar [@USER_MENTION]",
	lvl: "all",
	func (msg, cmd, bot) {
		if (cmd) bot.fetchUser(cmd.mention2id()).then(usr => {msg.channel.sendMessage(usr.displayAvatarURL.replace(/\.jpg/,".png"))});
		else msg.channel.sendMessage(bot.users.get(msg.author.id).displayAvatarURL.replace(/\.jpg/,".png"));
	}
}