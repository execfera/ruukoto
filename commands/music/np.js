module.exports = {
	desc: "Shows currently playing song.\nUSAGE: -np",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {}) return msg.channel.send(`\u{1f3b6} No song currently loaded.`);
        let np = bot.music[msg.guild.id].np;
        let currtime = (bot.music[msg.guild.id].dispatcher.time/1000).sec2hms();
        msg.channel.send(`\u{1f3b6} Now ${bot.music[msg.guild.id].loop?'looping':'playing'}: **${np.title}** (${currtime}/${np.len}) requested by **${np.req}**.`);
    }
}