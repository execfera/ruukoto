module.exports = {
	desc: "Prints the given message in a code block.\nUSAGE: -raw [MESSAGE]",
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true});  }
		else msg.channel.send(cmd.codeblock());
	}
}