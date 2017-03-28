var Discord = require("discord.js");
var google = require('googleapis');
var authData = require(__root + "/storage/auth.json");

module.exports = {
	desc: "Performs a Google search. Warning: Limited to 100 queries per day; please do not abuse.\nUSAGE: -google [SEARCH_TERM]\nALIAS: g\nEXAMPLE: -google Yahoo",
	alias: ["g"],
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendMessage(("google: " + this.desc).codeblock());   }
		else {
			var cs = google.customsearch('v1'), srcres = [];
			cs.cse.list({cx: authData.google_cx, auth: authData.google_apikey, q: cmd}, function (err, res) {
				if (err) msg.channel.sendMessage (err);
				else if (res.items && res.items.length > 0) {
					var reslen = res.items.length < 3 ? res.items.length : 3;
					var srcres = new Discord.RichEmbed({title: `Google Search for ${cmd}`, url: `https://www.google.com/search?q=${encodeURIComponent(cmd)}`, color: 0x2196f3});
					for (let i = 0; i < reslen; i++) { srcres.addField(res.items[i].title, `[${res.items[i].snippet}](${res.items[i].formattedUrl})`); }
					msg.channel.sendMessage("", {embed: srcres});
				}
			});
		}
	}
}