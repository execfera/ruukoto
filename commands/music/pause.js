module.exports = {
	desc: "Pauses a currently running song.\nUSAGE: -pause",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {}) return msg.channel.send(`\u{1f3b6} No song currently loaded.`);
        if (bot.music[msg.guild.id].dispatcher.paused) return msg.channel.send(`\u{1f3b6} Song is already paused.`);
        bot.music[msg.guild.id].dispatcher.pause();
        msg.channel.send(`\u{1f3b6} Song paused.`);
    }
}