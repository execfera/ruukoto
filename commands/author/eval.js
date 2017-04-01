module.exports = {
	desc: "Evaluates raw JavaScript.\nUSAGE: -eval [COMMAND]\nALIAS: e",
	alias: ["e"],
	lvl: "author",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendCode('', require('path').parse(__filename).name + ": " + this.desc);  }
		else {
			try { var evalres = eval(cmd); }
			catch (e) { var evalres = e; }
			finally { msg.channel.sendMessage(evalres); }
		}
	}
}