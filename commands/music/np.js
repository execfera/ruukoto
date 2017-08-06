module.exports = {
	desc: "Shows currently playing song.\nUSAGE: -np",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {}) return msg.channel.send(`\u{1f3b6} No song currently loaded.`);
        let np = bot.music[msg.guild.id].np;
        msg.channel.send(`\u{1f3b6} Now playing: ${np.title} (${np.len}) requested by ${np.req}.`);
    }
}