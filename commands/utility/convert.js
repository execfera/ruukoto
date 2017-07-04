var conv = require('easy-converter');
var c = new conv();

module.exports = {
	desc: "Converts one unit to another. Full list of units at: https://github.com/OussamaRomdhane/easy-converter Units are case-sensitive.\nUSAGE:\n-convert [AMOUNT] [INITIAL_UNIT] [FINAL_UNIT]: Converts given amount of first unit into the second.\n-convert [INITIAL_UNIT] [FINAL_UNIT]: Converts 1 amount of first unit into the second.\nALIAS: c\nEXAMPLE: -convert 1 m in, -convert m in",
	alias: ["c"],
	lvl: "all",
    func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true});  }
		else {
			var args = cmd.split(' ');
			if (isNaN(args[0])) {
				args = [1, args[0], args[1]];
			}
			var final = c.convert(args[0], args[1]).to(args[2]);
            if (isNaN(final)) msg.channel.send(`Invalid conversion.`);
            else msg.channel.send(`\u{1F500} ${args[0]}${args[1]} = ${final}${args[2]}`);
		}
	}
}