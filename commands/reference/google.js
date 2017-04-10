var Discord = require("discord.js");
var google = require('googleapis');
var authData = require(__root + "/storage/auth.json");

module.exports = {
	desc: "Performs a Google search. Warning: Limited to 100 queries per day; please do not abuse.\nUSAGE: -google [SEARCH_TERM]\nALIAS: g\nEXAMPLE: -google Yahoo",
	alias: ["g"],
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendCode('', require('path').parse(__filename).name + ": " + this.desc); }
		else {
			var cs = google.customsearch('v1'), srcres = [], link;
			var srclen = 3;
			cs.cse.list({cx: authData.google_cx, auth: authData.google_apikey, q: cmd}, function (err, res) {
				if (err) msg.channel.sendMessage (err);
				else if (res.items && res.items.length > 0) {
					var reslen = res.items.length < srclen ? res.items.length : srclen;
					var srcres = new Discord.RichEmbed()
						.setAuthor(`Google Search for ${cmd}`, "https://cdn.discordapp.com/emojis/300609922155151362.png", `https://www.google.com/search?q=${encodeURIComponent(cmd)}`)
						.setColor(0x2196f3);
					for (let i = 0; i < reslen; i++) { 
						link = res.items[i].formattedUrl.replace(" ", "");
						link = link[link.length -1] === ")" ? link.slice(0,-1) + "%29" : link;
						srcres.addField(res.items[i].title, `[${res.items[i].snippet}](${link})`); 
					}
					msg.channel.sendMessage("", {embed: srcres});
				}
			});
		}
	}
}