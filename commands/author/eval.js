module.exports = {
	desc: "Evaluates raw JavaScript.\nUSAGE: -eval [COMMAND]\nALIAS: e",
	alias: ["e"],
	lvl: "author",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendMessage(("eval: " + this.desc).codeblock());  }
		else {
			try { var evalres = eval(cmd); }
			catch (e) { var evalres = e; }
			finally { msg.channel.sendMessage(evalres); }
		}
	}
}