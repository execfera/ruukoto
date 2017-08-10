module.exports = {
	desc: "Unsummons the bot from the voice channel in the current server.\nUSAGE: -unsummon",
	lvl: "all",
	func (msg, cmd, bot) {
        if (msg.guild.voiceConnection && (msg.author.id === "91327883208843264" || (msg.guild.id in bot.music && bot.music[msg.guild.id].np.reqid === bot.user.id) )) {
            msg.channel.send(`Disconnected from ${msg.guild.voiceConnection.channel.name}.`);
            bot.music[msg.guild.id] = {
				playing: false,
				loop: false,
				loopall: false,
				random: false,
				skip: [],
				clear: [],
				clearall: [],
				clearlast: [],
				np: {},
				songs: [],
				dispatcher: {}
			};
            msg.guild.voiceConnection.disconnect();
        }
	}
}