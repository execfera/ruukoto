module.exports = {
	desc: "Returns info about the requested user. If no user is provided, returns info about the requester.\nUSAGE: -userinfo, -userinfo [@USER_MENTION]\nEXAMPLE: -userinfo @Ms. Prog#1162",
	lvl: "all",
	func (msg, cmd, bot) {
		var userid = cmd ? cmd.mention2id() : msg.author.id;
		var content = "";
		(async () => {
    		usr = await bot.fetchUser(userid);
			var creatediff = new Date().getTime() - usr.createdTimestamp;
			content += "User: `" + usr.tag;
			if (msg.guild.members.get(userid)) {
				var guildusr = msg.guild.members.get(userid);
				var joinstamp = guildusr.joinedTimestamp;
				var joindiff = new Date().getTime() - joinstamp;
				content += guildusr.nickname ? ' (' + guildusr.nickname + ')`\n' : '`\n';
				content += "User ID: " + userid.code() +'\n';
				content += "Account joined: " + (new Date(joinstamp).toUTCString() + " (" + joindiff.timeCounter() + " ago)").code() + "\n";
			} else content += "`\nUser ID: " + userid.code() + "\n"; 
			content += "Account created: " + (new Date(usr.createdTimestamp).toUTCString() + " (" + creatediff.timeCounter() + " ago)").code() + "\n";
			var msgsrc = await msg.guild.search({author: usr, sortOrder: "asc"});
			var firstmsg = msgsrc.messages[0].find(m => m.hit).createdTimestamp;
			content += "First message: " + (new Date(firstmsg).toUTCString() + " (" + (new Date().getTime() - firstmsg).timeCounter() + " ago)").code() + "\n";
			content += "Server messages: `" + msgsrc.totalResults + " (" + (msgsrc.totalResults*86400000/(new Date().getTime() - firstmsg)).toFixed(2) + " per day)`\n";
			content += "Current status: " + usr.presence.status.code() + "\n";			
			content += usr.displayAvatarURL;
			msg.channel.send(content);
		})();
		
	}
}