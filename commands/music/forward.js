module.exports = {
	desc: "Forwards the last song added into first place without affecting the queue.\nUSAGE: -forward",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {} || !bot.music[msg.guild.id].songs.length) return msg.channel.send(`\u{1f3b6} No song currently loaded.`);

        var temp = bot.music[msg.guild.id].songs.pop();
        bot.music[msg.guild.id].songs.unshift(temp);
        msg.channel.send(`\u{1f3b6} Forwarding the last song into first place.`);
    }
}