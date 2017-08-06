module.exports = {
	desc: "Randomly reorders two or more given choices, separated by comma.\nUSAGE: -order [CHOICE_A],[CHOICE_B],[...]\nALIAS: randomize\nEXAMPLE: -shuffle apple, banana, canteloupe",
	alias: ["randomize"],
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
		else {
            var args = cmd.split(',');
			if (args.length < 2) msg.channel.send('\u{1f500} Please provide more than one choice, separated by comma.');
			else {
                var currentIndex = args.length, temporaryValue, randomIndex;
                while (0 !== currentIndex) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                    temporaryValue = args[currentIndex];
                    args[currentIndex] = args[randomIndex];
                    args[randomIndex] = temporaryValue;
                }
            msg.channel.send(`\u{1f500} ${args.join(', ')}`);
            }
		}
	}
}