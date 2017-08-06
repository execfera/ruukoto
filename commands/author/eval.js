module.exports = {
	desc: "Evaluates raw JavaScript.\nUSAGE: -eval [COMMAND]\nALIAS: e",
	alias: ["e"],
	lvl: "author",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true});  }
		else {
			try { 
				var evalres = eval(cmd); 
      			if (typeof evalres !== "string" && !(evalres instanceof Promise)) evalres = require("util").inspect(evalres, { depth: 0 });
			}
			catch (e) { var evalres = e; }
			finally { msg.channel.send(clean(evalres)); }
		}
	}
}

function clean(text) {
	let out = text === "string" ? text
    .replace(/`/g, `\`\u{200B}`)
    .replace(/@/g, `@\u{200B}`)
    .replace(/[\w\d]?[\w\d]{23}\.[\w\d]{6}\.[\w\d-_]{27}/g, "[REDACTED]")
	: text;
	return out === "" ? "null" : out;
}