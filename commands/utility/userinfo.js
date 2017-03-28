module.exports = {
	desc: "Returns info about the requested user. If no user is provided, returns info about the requester.\nUSAGE: -userinfo, -userinfo [@USER_MENTION]\nEXAMPLE: -userinfo @Ms. Prog#1162",
	lvl: "all",
	func (msg, cmd, bot) {
		var userid = cmd ? cmd.mention2id() : msg.author.id;
		bot.fetchUser(userid).then(usr => {
			var creatediff = new Date().getTime() - usr.createdTimestamp;
			var content = "User: `" + usr.username + "#" + usr.discriminator;
			if (msg.guild.members.get(userid)) {
				var guildusr = msg.guild.members.get(userid);
				var joinstamp = guildusr.joinedTimestamp;
				var joindiff = new Date().getTime() - joinstamp;
				content += guildusr.nickname ? ' (' + guildusr.nickname + ')`\n' : '`\n';
				content += "User ID: " + userid.code() +'\n';
				content += "Account joined: " + (new Date(joinstamp).toUTCString() + " (" + joindiff.timeCounter() + " ago)").code() + "\n";
			} else { content += "`\nUser ID: " + userid.code() + "\n"; }
			content += "Account created: " + (new Date(usr.createdTimestamp).toUTCString() + " (" + creatediff.timeCounter() + " ago)").code() + "\n";
			content += "Current status: " + usr.presence.status.code() + "\n";
			content += usr.displayAvatarURL.replace(/\.jpg/,".png");
			msg.channel.sendMessage(content);
		});
	}
}