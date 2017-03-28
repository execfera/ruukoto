module.exports = {
	desc: "Prints the given message in a code block.\nUSAGE: -raw [MESSAGE]",
	lvl: "author",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendMessage(("raw: " + this.desc).codeblock());  }
		msg.channel.sendMessage(cmd.codeblock());
	}
}