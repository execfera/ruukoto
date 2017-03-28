var urban = require('urban');

module.exports = {
	desc: "Searches a term on Urban Dictionary.\nUSAGE: -urban [TERM]\nALIAS: u\nEXAMPLE: -urban headass",
	alias: ["u"],
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendMessage(("urban: " + this.desc).codeblock());  }
		else {
			urban(cmd).first((res) => {
				if (res) msg.channel.sendMessage("\u{1f4ac} " + res.definition + " (" + res.permalink + ")");
				else msg.channel.sendMessage("\u{1f4ac} No definition found.");
			});
		}
	}
}