module.exports = {
	desc: "Bans a specified user. Requires ban privileges on user and bot.\nUSAGE: -ban [@USER_MENTION]\nALIAS: b",
	alias: ["b"],
	lvl: "ban_mem",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendCode('', require('path').parse(__filename).name + ": " + this.desc);  }
		else {
            if (msg.member.hasPermission("BAN_MEMBERS") && msg.guild.member(bot.user).hasPermission("BAN_MEMBERS")) {
                msg.guild.member(cmd.mention2id()).ban()
                    .then(u => msg.channel.sendMessage(`${u.user.username.markbold()} has been banned.`));
            }
		}
	}
}