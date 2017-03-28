module.exports = {
	desc: "Returns info about the current server.\nUSAGE: -serverinfo",
	lvl: "all",
	func (msg, cmd, bot) {
		var content = "", roles = [], txtchn = [], vchn = [], online = 0, idle = 0, dnd = 0, presencearr = [];
		var createstamp = msg.guild.createdTimestamp;
		var creatediff = new Date().getTime() - createstamp;
		for (var i = 0; i < msg.guild.roles.array().length; i++) {
			if (msg.guild.roles.array()[i].name !== "@everyone") roles.push(msg.guild.roles.array()[i].name.code());
		}
		for (var i = 0; i < msg.guild.channels.array().length; i++) {
			if (msg.guild.channels.array()[i].type === "text") txtchn.push(msg.guild.channels.array()[i].name.code());
			else vchn.push(msg.guild.channels.array()[i].name.code());
		}
		for (var i = 0; i < msg.guild.presences.array().length; i++) {
			switch (msg.guild.presences.array()[i].status) {
				case "online": online++; break;
				case "idle": idle++; break;
				case "dnd": dnd++; break;
			}
		}
		if (online) presencearr.push(online + " online");
		if (idle) presencearr.push(idle + " idle");
		if (dnd) presencearr.push(dnd + " silenced");
		content += "Name: " + (msg.guild.name + " (ID: " + msg.guild.id + ")").code() + "\n";
		content += "Owner: `" + msg.guild.owner.user.username + "#" + msg.guild.owner.user.discriminator;
		content += (msg.guild.owner.nickname ? " (" + msg.guild.owner.nickname + ")`\n" : "`\n");
		content += "Region: " + msg.guild.region.code() + "\n";
		content += "Created: " + (new Date(createstamp).toUTCString() + " (" + creatediff.timeCounter() + " ago)").code() + "\n";
		content += "User Count: " + (msg.guild.memberCount.toString() + " (" + presencearr.join(', ') + ")").code() + "\n";
		content += "Roles (" + roles.length + "): " + roles.join(', ') + "\n";
		content += "Text Channels (" + txtchn.length + "): " + txtchn.join(', ') + "\n";
		content += "Voice Channels (" + vchn.length + "): " + vchn.join(', ') + "\n";
		content += msg.guild.iconURL;
		msg.channel.sendMessage(content);
	}
}