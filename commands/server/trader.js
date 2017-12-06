var chipData = require(__root + "/storage/chip.json");
var d20 = require('d20');

module.exports = {
	desc: "Sacrifices a chip into the chip trader and prints out the result.\nUSAGE: -trader [BATTLECHIP]\nEXAMPLE: -trader Cannon",
	lvl: "rern",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
		else {
      var tier = '', restier = '', resroll = 0, reschip;
      var traderData = {
        "E": [],
        "D": [],
        "C": [],
        "B": [],
        "A": [],
        "S": []
      };

      for (chip in chipData) {
        let chiptier = chipData[chip].rank;
        traderData[chiptier].push(chip);
      }

			for (var key in traderData) {
				if (traderData[key].indexOf(cmd) > -1) { tier = key; break; }
			}
			if (tier === '') { reschip = 'Chip input invalid.'; }
			var resroll = d20.roll(20);
			switch (tier) {
				case 'E':
				case 'D': {
					if (resroll <= 7) reschip = traderData.E[d20.roll(traderData.E.length)-1] + " (d20: " + resroll + `, tier: ${tier} to E)`;
					else if (resroll >= 17) reschip = traderData.C[d20.roll(traderData.C.length)-1] + " (d20: " + resroll + `, tier: ${tier} to C)`;
					else reschip = traderData.D[d20.roll(traderData.D.length)-1] + " (d20: " + resroll + `, tier: ${tier} to D)`;
				} break;
				case 'C': {
					if (resroll <= 7) reschip = traderData.D[d20.roll(traderData.D.length)-1] + " (d20: " + resroll + `, tier: ${tier} to D)`;
					else if (resroll >= 17) reschip = traderData.B[d20.roll(traderData.B.length)-1] + " (d20: " + resroll + `, tier: ${tier} to B)`;
					else reschip = traderData.C[d20.roll(traderData.C.length)-1] + " (d20: " + resroll + `, tier: ${tier} to C)`;
				} break;
				case 'B':
				case 'A':
				case 'S': {
					if (resroll <= 7) reschip = traderData.C[d20.roll(traderData.C.length)-1] + " (d20: " + resroll + `, tier: ${tier} to C)`;
					else if (resroll >= 17) reschip = traderData.A[d20.roll(traderData.A.length)-1] + " (d20: " + resroll + `, tier: ${tier} to A)`;
					else reschip = traderData.B[d20.roll(traderData.B.length)-1] + " (d20: " + resroll + `, tier: ${tier} to B)`;
				} break;
			}
			msg.channel.send('\u{1f5f3} Result: ' + reschip);
		} 
	}
}