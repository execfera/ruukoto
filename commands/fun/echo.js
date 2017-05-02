module.exports = {
	desc: "Makes the bot say the given statement.\nUSAGE: -echo [MESSAGE]\nEXAMPLE: -echo I'm talking through the bot!",
	alias: ["say"],
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true});  }
		else {
			var echo = cmd, target = msg.channel;
			if (msg.author.id === "91327883208843264" && cmd[0] === '-') {
				switch (cmd.split(' ')[0].slice(1)) {
					case "cheese": target = bot.channels.get("103851116512411648"); echo = cmd.slice(cmd.indexOf(' ')+1); break;
					case "rern": target = bot.channels.get("208498945343750144"); echo = cmd.slice(cmd.indexOf(' ')+1); break;
					case "debug": target = bot.channels.get("189911150001913856"); echo = cmd.slice(cmd.indexOf(' ')+1); break;
				}
			}
			target.send(echo);
		}
	}
}