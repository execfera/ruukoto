var fx = require('money');
var request = require('request');
var authData = require(__root + "/storage/auth.json");

module.exports = {
	desc: "Converts one denomination of currency to another.\nUSAGE:\n-fx [AMOUNT] [INITIAL_CURRENCY] [RESULT_CURRENCY]: Converts given amount of first currency into the second.\n-fx [AMOUNT] [CURRENCY]: Converts given amount of currency into US Dollars.\n-fx [INITIAL_CURRENCY] [RESULT_CURRENCY]: Converts 1 unit of first currency into the second.\n-fx [CURRENCY]: Converts 1 US Dollar into the given currency.\nEXAMPLE: -fx 1 eur usd, -fx 1 eur, -fx eur usd, -fx eur",
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
		else {
			var args = cmd.split(' ');
			if (isNaN(args[0])) {
				if (args[1]) args = [1, args[0], args[1]];
				else args = [1, "USD", args[0]];
			}
			if (!(args[2])) args[2] = "USD";
			args = [args[0], args[1].toUpperCase(), args[2].toUpperCase()];
			request(`http://www.apilayer.net/api/live?access_key=${authData.currencylayer_key}&currencies=${args[1]},${args[2]}`, function(err, res, body) {
				if (!err && res.statusCode == 200) {
					fx.rates["USD"] = 1;
					fx.rates[args[1]] = JSON.parse(body).quotes["USD"+args[1]];
					fx.rates[args[2]] = JSON.parse(body).quotes["USD"+args[2]];
					try { var rate = fx(args[0]).from(args[1]).to(args[2]);
					msg.channel.send("\u{1f4b5} " + args[1] + args[0] + " = " + args[2] + rate.toLocaleString(undefined, { minimumFractionDigits: rate<0.01?4:2, maximumFractionDigits: rate<0.01?4:2 })); }
					catch (e) { msg.channel.send("\u{1f4b5} Invalid exchange query."); }
				}
				else request(`http://api.fixer.io/latest?symbols=${args[1]},${args[2]}`, function(err, res, body) {
					if (!err && res.statusCode == 200) {
						fx.rates["EUR"] = 1;
						fx.rates = JSON.parse(body).rates;
						try { var rate = fx(args[0]).from(args[1]).to(args[2]);
						msg.channel.send("\u{1f4b5} " + args[1] + args[0] + " = " + args[2] + rate.toLocaleString(undefined, { minimumFractionDigits: rate<0.01?4:2, maximumFractionDigits: rate<0.01?4:2 })); }
						catch (e) { msg.channel.send("\u{1f4b5} Invalid exchange query."); }
					}
				});
			});
		}
	}
}