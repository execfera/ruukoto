var weather = require('openweather-apis');
var authData = require(__root + "/storage/auth.json");

weather.setAPPID(authData.openweatherkey);
weather.setLang('en');
weather.setUnits('metric');

module.exports = {
	desc: "Shows current weather for the given area.\nUSAGE: -weather [AREA]\nALIAS: w\nEXAMPLE: -weather New York",
	alias: ["w"],
	lvl: "all",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendMessage(("weather: " + this.desc).codeblock());  }
		else {
			var wreport;
			weather.setCity(cmd);
			weather.getAllWeather(function(err, res){
				if (res) {
					wreport = getWeatherIcon(res.weather[0].icon) + "__**Weather** for " + res.name + ", " + res.sys.country + "__ :flag_" + res.sys.country.toLowerCase() + ":";
					wreport += "\n" + res.main.temp + "°C / " + (res.main.temp*1.8+32).toFixed(2) + "°F, " + res.weather[0].description;
					wreport += "\n" + res.clouds.all + "% Clouds, Wind Speed " + (res.wind.speed*3.6).toFixed(2) + "km/h / " + (res.wind.speed*2.2369).toFixed(2) + "mph";
					wreport += "\n" + "Barometric Pressure: " + res.main.pressure + "hPa " + res.main.humidity + "% humidity";
					msg.channel.sendMessage(wreport);
				}
				else msg.channel.sendMessage(err);
			});
		}
	}
}

function getWeatherIcon (iconid) {
	switch (iconid)
	{
		case "01d": // clear sky day
			return "\u{2600} ";
		case "01n": // clear sky night
			return "\u{1f314} ";
		case "02d": // few clouds day
		case "03d": // scattered clouds day
		case "04d": // broken clouds day
			return "\u{1f324} ";
		case "02n": // few clouds night
		case "03n": // scattered clouds night
		case "04n": // broken clouds night
			return "\u{2601} ";
		case "09d": // shower rain day
			return "\u{1f326} ";
		case "09n": // shower rain night
			return "\u{1f327} ";
		case "10d": // rain day
		case "10n": // rain night
			return "\u{2602} ";
		case "11d": // thunderstorm day
		case "11n": // thunderstorm night
			return "\u{1f329} ";
		case "13d": // snow day
		case "13n": // snow night
			return "\u{2744} ";
		case "50d": // mist day
		case "50n": // mist night
			return "\u{1f4a6} ";
		default:
			return "";
	}
}