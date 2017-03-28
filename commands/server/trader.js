var traderData = require(__root + "/storage/trader.json");

module.exports = {
	desc: "Sacrifices a chip into the chip trader and prints out the result.\nUSAGE: -trader [BATTLECHIP]\nEXAMPLE: -trader Cannon",
	lvl: "rern",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendMessage(("trader: " + this.desc).codeblock());   }
		else msg.channel.sendMessage('\u{1f5f3} Result: ' + traderoll(cmd));
	}
}

function traderoll (chip) {
	var tier = '';
	var restier = '';
	var resroll = 0;
	for (var key in traderData) {
		if (traderData[key].indexOf(chip) > -1) { tier = key; break; }
	}
	if (tier === '') { return 'Chip input invalid.'; }
	var resroll = d20.roll(20);
	switch (tier) {
		case 'E':
		case 'D': {
			if (resroll <= 7) return traderData.E[d20.roll(traderData.E.length)-1] + " (" + resroll + ")";
			else if (resroll >= 17) return traderData.C[d20.roll(traderData.C.length)-1] + " (" + resroll + ")";
			else return traderData.D[d20.roll(traderData.D.length)-1] + " (" + resroll + ")";
		}
		case 'C': {
			if (resroll <= 7) return traderData.D[d20.roll(traderData.D.length)-1] + " (" + resroll + ")";
			else if (resroll >= 17) return traderData.B[d20.roll(traderData.B.length)-1] + " (" + resroll + ")";
			else return traderData.C[d20.roll(traderData.C.length)-1] + " (" + resroll + ")";
		}
		case 'B':
		case 'A':
		case 'S': {
			if (resroll <= 7) return traderData.C[d20.roll(traderData.C.length)-1] + " (" + resroll + ")";
			else if (resroll >= 17) return traderData.A[d20.roll(traderData.A.length)-1] + " (" + resroll + ")";
			else return traderData.B[d20.roll(traderData.B.length)-1] + " (" + resroll + ")";
		}
	}
}