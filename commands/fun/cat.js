var request = require('request');

module.exports = {
	desc: "Cat.\nUSAGE: -cat",
	lvl: "all",
	func (msg, cmd, bot) {
		request("http://random.cat/meow", function(err, res, body) {
			if (!err && res.statusCode == 200) msg.channel.send("\u{1f408} " + JSON.parse(body).file);
		});
	}
}