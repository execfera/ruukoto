var request = require('request');
var cheerio = require('cheerio');

module.exports = {
	desc: "Returns a random superpower.\nUSAGE: -quirk",
	lvl: "all",
	func (msg, cmd, bot) {
        request("http://powerlisting.wikia.com/wiki/Special:Random", function(err, res, body) {
            if (!err && res.statusCode == 200) {
                var $ = cheerio.load(body); 
                msg.channel.send($('link').eq(0).attr('href'));
            }
		});            
    }
}