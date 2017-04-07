module.exports = {
	desc: "Evaluates raw JavaScript.\nUSAGE: -eval [COMMAND]\nALIAS: e",
	alias: ["e"],
	lvl: "author",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendCode('', require('path').parse(__filename).name + ": " + this.desc);  }
		else {
			try { 
				var evalres = eval(cmd); 
      			if (typeof evalres !== "string" && !(evalres instanceof Promise)) evalres = require("util").inspect(evalres, { depth: 0 });
			}
			catch (e) { var evalres = e; }
			finally { msg.channel.sendMessage(clean(evalres)); }
		}
	}
}

function clean(text) {
    return typeof text === "string" ? text
    .replace(/`/g, `\`\u{200B}`)
    .replace(/@/g, `@\u{200B}`)
    .replace(/[\w\d]?[\w\d]{23}\.[\w\d]{6}\.[\w\d-_]{27}/g, "[REDACTED]")
    : text;
}