var math = require('mathjs');

module.exports = {
	desc: "Evaluates a mathematical expression. Refer to http://mathjs.org/docs/expressions/index.html for more details.\nUSAGE: -math [EXPRESSION]\nEXAMPLE: -math 1.2 * (2 + 4.5), -math 5.08 cm to inch, -math sin(45 deg) ^ 2, -math 9 / 3 + 2i, -math det([-1, 2; 3, 1])",
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
		else {
			msg.channel.send(math.eval(cmd));
		}
	}
}