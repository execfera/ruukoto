module.exports = {
	desc: "Postpones the next song into last place without affecting the queue.\nUSAGE: -postpone",
	lvl: "author",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {} || !bot.music[msg.guild.id].songs.length) return msg.channel.send(`\u{1f3b6} No song currently loaded.`);

        var temp = bot.music[msg.guild.id].songs.shift();
        bot.music[msg.guild.id].songs.push(temp);
        msg.channel.send(`\u{1f3b6} Postponing the next song into last place.`);
    }
}