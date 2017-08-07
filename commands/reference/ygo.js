var request = require('request');
var cheerio = require('cheerio');

module.exports = {
	desc: "Searches for a Yu-Gi-Oh card and returns its card image.\nUSAGE: -ygo [CARD_NAME]",
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
        else { 
            var content = "";
            request(`http://yugioh.wikia.com/wiki/Special:Search?search=${cmd}&ns100=1`, function(err, res, body) {
                if (!err && res.statusCode == 200) {
                    var $ = cheerio.load(body); 
                    if ($('a.result-link').length > 0) {
                        request($('a.result-link').attr('href').replace('Card_Gallery:',''), function(err1, res1, body1) {
                            var $$ = cheerio.load(body1);
                            if ($$('td.cardtable-cardimage a').length > 0) content = $$('td.cardtable-cardimage a').attr('href');
                            else if ($$('div.cardtable-main_image-wrapper img').length > 0) content = $$('div.cardtable-main_image-wrapper img').attr('src');
                            else content = 'Not a card!';
                        });
                    }
                    else content = 'Card not found.';
                    content = content.startsWith("data:image") ? 'Card not found.' : content;
                    msg.channel.send(content);
                }
            });    
        }        
    }
}