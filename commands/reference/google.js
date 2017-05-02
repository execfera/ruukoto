var Discord = require("discord.js");
var google = require('googleapis');
var authData = require(__root + "/storage/auth.json");

module.exports = {
	desc: "Performs a Google search. Warning: Limited to 100 queries per day; please do not abuse.\nUSAGE: -google [SEARCH_TERM]\nALIAS: g\nEXAMPLE: -google Yahoo",
	alias: ["g"],
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
		else {
			var cs = google.customsearch('v1'), srcres = [], link;
			var srclen = 3;
			cs.cse.list({cx: authData.google_cx, auth: authData.google_apikey, q: cmd}, function (err, res) {
				if (err) msg.channel.send (err);
				else if (res.items && res.items.length > 0) {
					var reslen = res.items.length < srclen ? res.items.length : srclen;
					var srcres = new Discord.RichEmbed()
						.setAuthor(`Google Search for ${cmd}`, "http://i.imgur.com/sxmXlBh.png", `https://www.google.com/search?q=${encodeURIComponent(cmd)}`)
						.setColor(0x2196f3)
						.setThumbnail(res.items[0].pagemap.cse_thumbnail[0].src || "");
					for (let i = 0; i < reslen; i++) { 
						link = res.items[i].link;
						link = link[link.length -1] === ")" ? link.slice(0,-1) + "%29" : link;
						srcres.addField(res.items[i].title, `[${res.items[i].snippet.replace(/\n/g,"")}](${link})`); 
					}
					msg.channel.send("", {embed: srcres});
				}
			});
		}
	}
}