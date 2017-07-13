var request = require('request');
var cheerio = require('cheerio');

module.exports = {
	desc: "Returns a random Pokemon fusion.\nUSAGE: -pokemon",
	lvl: "all",
	func (msg, cmd, bot) {
        request("http://pokemon.alexonsager.net/", function(err, res, body) {
            if (!err && res.statusCode == 200) {
                var $ = cheerio.load(body); 
                msg.channel.send($('#pk_name').text() + "\n" + $('#pk_img').attr('src'));
            }
		});            
    }
}