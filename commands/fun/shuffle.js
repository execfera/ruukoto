module.exports = {
	desc: "Shuffles two or more given choices, separated by comma.\nUSAGE: -shuffle [CHOICE_A],[CHOICE_B],[...]\nALIAS: order\nEXAMPLE: -shuffle apple, banana, canteloupe",
	alias: ["order"],
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendCode('', require('path').parse(__filename).name + ": " + this.desc);  }
		else {
            var args = cmd.split(',');
			if (args.length < 2) msg.channel.sendMessage('\u{1f500} Please provide more than one choice, separated by comma.');
			else {
                var currentIndex = args.length, temporaryValue, randomIndex;
                while (0 !== currentIndex) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                    temporaryValue = args[currentIndex];
                    args[currentIndex] = args[randomIndex];
                    args[randomIndex] = temporaryValue;
                }
            msg.channel.sendMessage(`\u{1f500} ${args.join(', ')}`);
            }
		}
	}
}