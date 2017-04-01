module.exports = {
	desc: "Prints the given message in a code block.\nUSAGE: -raw [MESSAGE]",
	lvl: "author",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendCode('', require('path').parse(__filename).name + ": " + this.desc);  }
		msg.channel.sendMessage(cmd.codeblock());
	}
}