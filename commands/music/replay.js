module.exports = {
	desc: "Replays the current song.\nUSAGE: -replay",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {}) return msg.channel.send(`\u{1f3b6} No song currently loaded.`);
        bot.music[msg.guild.id].songs.unshift(bot.music[msg.guild.id].np);
        msg.channel.send(`\u{1f3b6} Replaying the current song.`);
        bot.music[msg.guild.id].dispatcher.end();
    }
}