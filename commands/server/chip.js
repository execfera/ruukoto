var chipData = require(__root + "/storage/chip.json");
var reduceChip = Object.keys(chipData).reduce(function (keys, k) { 
	keys[k.toLowerCase()] = k; 
	return keys;
}, {});

module.exports = {
	desc: "Returns RE:RN Battlechip data.\nUSAGE: -chip [BATTLECHIP]\nEXAMPLE: -chip Cannon",
	lvl: "rern",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
		else if (!(cmd.toLowerCase() in reduceChip)) { msg.channel.send("Chip not found."); }
		else {
			var chipmoji = bot.guilds.get("208498945343750144").emojis.get("265842020298391552");
			var ccontent = chipData[reduceChip[cmd.toLowerCase()]].desc.replace(/<br>/g,'\n');
			var ctitle = msg.guild.id === "208498945343750144" ? chipmoji + ' ' + reduceChip[cmd.toLowerCase()] : reduceChip[cmd.toLowerCase()];
			msg.channel.send(ctitle.markbold() + "\n" + ccontent.codeblock());
		}
	}
}