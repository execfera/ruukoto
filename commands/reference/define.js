var request = require('request');
var cheerio = require('cheerio');

module.exports = {
	desc: "Defines a word through Google.\nUSAGE: -define [WORD]",
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true});  }
		else {
			request(`https://www.google.com/search?q=define:${encodeURIComponent(cmd)}&gl=us&hl=en`, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(body);
                    var defelem = $(".g").first().find("ol"), defs = [];
                    for (let i = 0; i < defelem.length; i++){
                        defs.push((defelem.eq(i).prev().text() + ":\n- " + defelem.eq(i).text().replace(/\s+/g, " ").replace(/\./g, "\n- ")).slice(0,-2));
                    }
                    if (defs.join('\n')) msg.channel.send(`Definition of **${cmd}**:\n${defs.join('\n').codeblock("diff")}`);
                    else msg.channel.send(`No definitions found for **${cmd}**.`);
                } else {
                    msg.channel.send(error);
                }
            });
		}
	}
}