module.exports = {
	desc: "Shuffles the current queue.\nUSAGE: -reorder",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {}) return msg.channel.send(`\u{1f3b6} No songs currently loaded.`);
        if (bot.music[msg.guild.id].songs.length >= 2) {
            var currentIndex = bot.music[msg.guild.id].songs.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = args[currentIndex];
                bot.music[msg.guild.id].songs[currentIndex] = args[randomIndex];
                bot.music[msg.guild.id].songs[randomIndex] = temporaryValue;
            }
        }
        msg.channel.send(`\u{1f3b6} Song queue shuffled.`);
	}
}