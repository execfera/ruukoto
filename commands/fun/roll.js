var d20 = require('d20');

module.exports = {
	desc: "Rolls the dice.\nUSAGE: -roll [NUMBER], -roll [STANDARD_DICE], -roll[STANDARD_DICE]+[MODIFIER1]+[MODIFIER..]\nEXAMPLE: -roll 20, -roll 1d20, -roll 1d20 +0",
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true});;  }
		else msg.channel.send('\u{1f3b2} ' + d20.roll(cmd));
	}
}