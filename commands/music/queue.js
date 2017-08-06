module.exports = {
	desc: "Lists the current queue of songs.\nUSAGE: -queue",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {}) return msg.channel.send(`\u{1f3b6} No songs currently loaded.`);
        var content = `\u{1f3b6} Now playing: ${np.title} (${np.len}) requested by ${np.req}.\n`;
        var contqueue = "";
        if (bot.music[msg.guild.id].songs.length > 0) {
            for (let i = 0; i < 10; i++) {
                contqueue += `[${i+1}] **${bot.music[msg.guild.id].songs[i].title}** (${bot.music[msg.guild.id].songs[i].len}) by **${bot.music[msg.guild.id].songs[i].req}**\n`;
            }
            if (bot.music[msg.guild.id].songs.length > 10) {
                contqueue += `_... and ${bot.music[msg.guild.id].songs.length - 10} more._`;
            }
        }
        msg.channel.send(`${content}${contqueue}`);
    }
}