var traderData = require(__root + "/storage/trader.json");
var d20 = require('d20');

module.exports = {
	desc: "Sacrifices a chip into the chip trader and prints out the result.\nUSAGE: -trader [BATTLECHIP]\nEXAMPLE: -trader Cannon",
	lvl: "stub",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
		else {
			var tier = '', restier = '', resroll = 0, reschip;
			for (var key in traderData) {
				if (traderData[key].indexOf(cmd) > -1) { tier = key; break; }
			}
			if (tier === '') { reschip = 'Chip input invalid.'; }
			var resroll = d20.roll(20);
			switch (tier) {
				case 'E':
				case 'D': {
					if (resroll <= 7) reschip = traderData.E[d20.roll(traderData.E.length)-1] + " (" + resroll + ")";
					else if (resroll >= 17) reschip = traderData.C[d20.roll(traderData.C.length)-1] + " (" + resroll + ")";
					else reschip = traderData.D[d20.roll(traderData.D.length)-1] + " (" + resroll + ")";
				}
				case 'C': {
					if (resroll <= 7) reschip = traderData.D[d20.roll(traderData.D.length)-1] + " (" + resroll + ")";
					else if (resroll >= 17) reschip = traderData.B[d20.roll(traderData.B.length)-1] + " (" + resroll + ")";
					else reschip = traderData.C[d20.roll(traderData.C.length)-1] + " (" + resroll + ")";
				}
				case 'B':
				case 'A':
				case 'S': {
					if (resroll <= 7) reschip = traderData.C[d20.roll(traderData.C.length)-1] + " (" + resroll + ")";
					else if (resroll >= 17) reschip = traderData.A[d20.roll(traderData.A.length)-1] + " (" + resroll + ")";
					else reschip = traderData.B[d20.roll(traderData.B.length)-1] + " (" + resroll + ")";
				}
			}
			msg.channel.send('\u{1f5f3} Result: ' + reschip);
		} 
	}
}