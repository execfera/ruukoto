module.exports = {
	desc: "Kicks a specified user. Requires kick privileges on user and bot.\nUSAGE: -kick [@USER_MENTION]\nALIAS: k",
	alias: ["k"],
	lvl: "kick_mem",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true});  }
		else {
            if (msg.member.hasPermission("KICK_MEMBERS") && msg.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
                msg.guild.member(cmd.mention2id()).kick()
                    .then(u => msg.channel.send(`${u.user.username.markbold()} has been kicked.`));
            }
		}
	}
}