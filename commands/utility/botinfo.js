module.exports = {
	desc: "Returns info about the current bot instance.\nUSAGE: -botinfo",
	lvl: "all",
	func (msg, cmd, bot) {
		var pack = require(__root + "/package.json");
		bot.fetchUser("91327883208843264").then(usr => {
			var content = "__**Ruukoto** (discord.js v" + pack.dependencies["discord.js"].slice(1) + ")__\n\n";
			content += "**Author: **" + usr.username + "#" + usr.discriminator + "\n";
			content += "**Guilds: **" + bot.guilds.size + "\n";
			content += "**Channels: **" + bot.channels.size + "\n";
			content += "**Users: **" + bot.users.size + "\n\n";
			content += "**Startup: **" + bot.readyAt.toUTCString() + "\n";
			content += "**Uptime: **" + bot.uptime.timeCounter() + "\n";
			content += "**Ping: **" + Math.trunc(bot.ping) + "ms";
			msg.channel.send(content);
		});
	}
}