var virusData = Object.assign(require(__root + "/storage/virus1.json"), require(__root + "/storage/virus2.json"));
var reduceVirus = {};
for (var key in virusData) {
	for (var i = 0; i <= 6; i++) {
		reduceVirus[virusData[key].virus[i].name.toLowerCase()] = [key, i];
	}
}

module.exports = {
	desc: "Returns RE:RN virus data.\nUSAGE: -virus [VIRUSNAME]\nEXAMPLE: -virus CannonGuard2 EX",
	lvl: "rern",
	func (msg, cmd, bot) {
		if (msg.channel.id === "208746890932649995" || msg.channel.id === "268383263599493122") {
			var metool = bot.guilds.get("208498945343750144").emojis.get("278711463500316673");
			if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
			else if (cmd.toLowerCase() in reduceVirus) {
				var foundVirus = reduceVirus[cmd.toLowerCase()];
				msg.channel.send(metool + " " + foundVirus[0].markbold() + "\n" + virusData[foundVirus[0]].virus[foundVirus[1]].desc.replace(/<br>/g,'\n').codeblock());
			}
			else msg.channel.send("Virus not found.");
		}
	}
}