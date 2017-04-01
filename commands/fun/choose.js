module.exports = {
	desc: "Chooses one of two or more given choices, separated by comma.\nUSAGE: -choose [CHOICE_A],[CHOICE_B],[...]\nALIAS: choice, c\nEXAMPLE: -choose apple, banana, canteloupe",
	alias: ["choice", "c"],
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendCode('', require('path').parse(__filename).name + ": " + this.desc);  }
		else {
			if (cmd.split(',').length < 2) msg.channel.sendMessage('\u{1f5f3} Please provide more than one choice, separated by comma.');
			else msg.channel.sendMessage('\u{1f5f3} I choose ' + cmd.split(',')[Math.floor(Math.random() * cmd.split(',').length)].trim() + '!');
		}
	}
}