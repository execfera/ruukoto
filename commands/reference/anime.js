var	authData = require(__root + "/storage/auth.json");
var popura = require('popura')(authData.mal_user, authData.mal_pass);

module.exports = {
	desc: "Searches for an anime on MyAnimeList.\nUSAGE: -anime [SEARCH_TERM]\nALIAS: a\nEXAMPLE: -anime berserk (2017)",
	alias: ["a"],
	lvl: "all",
	func (msg, cmd, bot) {
        if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
		else {
            popura.searchAnimes(cmd)
                .then(res => {
                    if (!res[0]) msg.channel.send('Search returned no results.');
                    else {
                        var airing = res[0].start_date.slice(-2) === "00" ? res[0].start_date.slice(0,-3) : res[0].start_date;
                        if (res[0].status === "Finished Airing" && airing !== res[0].end_date) airing += ` - ${res[0].end_date}`;
                        var content = `**${res[0].title}**${res[0].english ? " (" + res[0].english + ")" : ''}: https://myanimelist.net/anime/${res[0].id}\n`
                        content += `**Status:** ${res[0].status} (${airing})\n`;
                        content += `**Episodes:** ${res[0].episodes} / **Score:** ${res[0].score}`;
                        msg.channel.send(content);
                    }
                })
		}
	}
}