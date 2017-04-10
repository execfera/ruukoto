var blacklist = require(__root + "/storage/blist.json");
var jsonfile = require('jsonfile');

module.exports = {
	desc: "Blacklists a specified user from this bot's commands, or removes them from the blacklist if they're already on it. Requires message management privileges on user.\nUSAGE: -blacklist [@USER_MENTION]\nALIAS: blist",
	alias: ["blist"],
	lvl: "man_msg_usr",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.sendCode('', require('path').parse(__filename).name + ": " + this.desc);  }
		else {
            if (msg.member.hasPermission("MANAGE_MESSAGES") || msg.author.id === "91327883208843264") {
                if (blacklist.indexOf(cmd.mention2id()) === -1) {
                    blacklist.push(cmd.mention2id());
                    jsonfile.writeFileSync(__root + "/storage/blist.json", blacklist, {spaces: 2});
                    msg.channel.sendMessage(`${cmd} added to command blacklist.`);
                } else {
                    blacklist.splice(blacklist.indexOf(cmd.mention2id()), 1);
                    jsonfile.writeFileSync(__root + "/storage/blist.json", blacklist, {spaces: 2});
                    msg.channel.sendMessage(`${cmd} removed from command blacklist.`)
                }
            } 
		}
	}
}