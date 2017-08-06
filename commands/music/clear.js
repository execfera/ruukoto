module.exports = {
	desc: "Clears the queue without skipping current song. If a number is given, clears said amount of songs.\nUSAGE: -clear, -clear [NUMBER]",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {}) return msg.channel.send(`\u{1f3b6} No song currently loaded.`);
        if (!cmd) {
            bot.music[msg.guild.id].songs = [];
            msg.channel.send(`\u{1f3b6} Cleared out all songs from the queue.`);
        }
        else if (isNaN(cmd)) {
            msg.channel.send(`\u{1f3b6} Not a number.`);    
        }
        else {
            bot.music[msg.guild.id].songs = bot.music[msg.guild.id].songs.slice(Number(cmd));
            msg.channel.send(`\u{1f3b6} Cleared out ${cmd} songs from the queue.`);
        }
    }
}