var emote = require(__root + "/storage/user/emote.json");

module.exports = {
	desc: "Japanese emoji.\nUSAGE: -emote [COMMAND]\nALIAS: emoji",
	alias: ["emoji"],
	lvl: "author",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true});  }
		else {
            msg.delete().then(m => m.channel.send(emote[cmd]));
		}
	}
}