module.exports = {
	desc: "Skips a currently running song. If number is given, skips said amount of songs. Use 'skip all' to skip to the last song.\nUSAGE: -skip, -skip [NUMBER], -skip all\nEXAMPLE: -skip 9",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {}) return msg.channel.send(`\u{1f3b6} No song currently loaded.`);
        if (!cmd) {
            let np = bot.music[msg.guild.id].np;
            msg.channel.send(`\u{1f3b6} Skipping: **${np.title}** (${np.len}) requested by: **${np.req}**.`);
        }
        else if (cmd === "all") {
            bot.music[msg.guild.id].songs = bot.music[msg.guild.id].songs.slice(-1);
        }
        else if (isNaN(cmd)) {
            msg.channel.send(`\u{1f3b6} Not a number.`);    
        }
        else {
            bot.music[msg.guild.id].songs = bot.music[msg.guild.id].songs.slice(Number(cmd)-1);
            msg.channel.send(`\u{1f3b6} Skipping ${cmd} songs.`);
        }
        bot.music[msg.guild.id].dispatcher.end();
    }
}