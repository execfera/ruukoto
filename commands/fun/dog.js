var puppy = require('random-puppy');

module.exports = {
	desc: "Dog.\nUSAGE: -dog",
	lvl: "all",
	func (msg, cmd, bot) {
		puppy('puppy').then(url => { msg.channel.send("\u{1f415} " + url); });
	}
}