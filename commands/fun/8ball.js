var eightball = require('8ball');

module.exports = {
	desc: "Asks the bot a question.\nUSAGE: -8ball [QUESTION]\nEXAMPLE: -8ball Will I ever become the little girl?",
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendMessage(("8ball: " + this.desc).codeblock());  }
		else msg.channel.sendMessage("Question: " + cmd.code() + "\nAnswer: " + eightball().code());
	}
}