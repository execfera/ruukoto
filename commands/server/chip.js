var chipData = require(__root + "/storage/chip.json");

module.exports = {
	desc: "Returns RE:RN Battlechip data.\nUSAGE: -chip [BATTLECHIP]\nEXAMPLE: -chip Cannon",
	lvl: "rern",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendMessage(("chip: " + this.desc).codeblock());   }
		else if (!(cmd in chipData)) { msg.channel.sendMessage("Chip not found."); }
		else {
			var chipmoji = bot.guilds.get("208498945343750144").emojis.get("265842020298391552");
			var ccontent = chipData[cmd].desc.replace(/<br>/g,'\n');
			var ctitle = msg.guild.id === "208498945343750144" ? chipmoji + ' ' + cmd : cmd;
			msg.channel.sendMessage(ctitle.markbold() + "\n" + ccontent.codeblock());
		}
	}
}