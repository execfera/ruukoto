module.exports = {
	desc: "Declares your intent to see some booty, or otherwise. Type in the next message exactly.\nUSAGE: -declare I am over the age of 18 and want to see some booty.: Adds 18+ role.\n-declare I don't want to see the booty anymore.: Removes 18+ role.",
	lvl: "stub",
	func (msg, cmd, bot) {
		if (msg.guild.id === "206956124237332480") {
			if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
			else switch (cmd){
				case "I am over the age of 18 and want to see some booty":
				case "I am over the age of 18 and want to see some booty.": msg.member.addRole("289910636199280640"); msg.channel.send("Please enjoy the booty."); break;
				case "I don't want to see the booty anymore":
				case "I don't want to see the booty anymore.": msg.member.removeRole("289910636199280640"); msg.channel.send("What a pure soul!"); break;
				default: msg.channel.send("Invalid declaration. Refer to `-help declare` for the appropriate ones.");
			}
		}
	}
}