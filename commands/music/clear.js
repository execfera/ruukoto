module.exports = {
	desc: "Votes to clear the next song from the queue without skipping current song. Use \"clear last\" to remove the last added song, or \"clear all\" to remove all songs from the queue. Owner-only: If a number is given, clears said amount of songs.\nUSAGE: -clear, -clear all, -clear last, -clear [NUMBER]",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {}) return msg.channel.send(`\u{1f3b6} No song currently loaded.`);
        if (!msg.guild.voiceConnection) return msg.channel.send(`\u{1f3b6} Bot is not currently in a voice channel.`);
        if (msg.member.voiceChannel.id !== msg.guild.voiceConnection.channel.id) return msg.channel.send(`\u{1f3b6} You cannot vote for a clear without being in the music bot's channel.`);

        var listeners = msg.guild.voiceConnection.channel.members.reduce((s,v)=>{ return (v.selfDeaf || v.serverDeaf || v.id === bot.user.id) ? s : ++s; }, 0);

        if (!cmd && (msg.author.id === "91327883208843264" || 
            msg.author.id === bot.music[msg.guild.id].songs[0].reqid || 
            ++bot.music[msg.guild.id].clear >= (listeners < 3 ? listeners : 3))) 
            {
            bot.music[msg.guild.id].songs.shift();
            bot.music[msg.guild.id].clear = 0;
            msg.channel.send(`\u{1f3b6} Cleared out the next song from the queue.`);
        }
        else if (cmd === "last" && (msg.author.id === "91327883208843264" ||
            msg.author.id === bot.music[msg.guild.id].songs.slice(-1)[0].reqid ||  
            ++bot.music[msg.guild.id].clearlast >= (listeners < 3 ? listeners : 3))) {
            bot.music[msg.guild.id].songs.pop();
            bot.music[msg.guild.id].clearlast = 0;
            msg.channel.send(`\u{1f3b6} Cleared out the last-added song from the queue.`);
        }
        else if (cmd === "all" && (msg.author.id === "91327883208843264" ||
            ++bot.music[msg.guild.id].clearall >= (listeners < 3 ? listeners : 3))) {
            bot.music[msg.guild.id].songs= [];
            bot.music[msg.guild.id].clearall = 0;
            msg.channel.send(`\u{1f3b6} Cleared out all songs from the queue.`);
        }
        else if (msg.author.id === "91327883208843264" && isNaN(cmd)) {
            msg.channel.send(`\u{1f3b6} Not a number.`);
        }
        else {
            if (msg.author.id === "91327883208843264") {
                bot.music[msg.guild.id].songs = bot.music[msg.guild.id].songs.slice(Number(cmd));
                msg.channel.send(`\u{1f3b6} Cleared out ${cmd} songs from the queue.`);
            }
            else {
                if (!cmd) { msg.channel.send(`Vote to clear now at ${bot.music[msg.guild.id].clear} votes, requires ${listeners < 3 ? listeners : 3} Use \`-clear\` to vote.`); }
                else if (cmd === "last") { msg.channel.send(`Vote to clear the last-added song now at ${bot.music[msg.guild.id].clearlast} votes, requires ${listeners < 3 ? listeners : 3} Use \`-clear last\` to vote.`); }
                else if (cmd === "all") { msg.channel.send(`Vote to clear all songs now at ${bot.music[msg.guild.id].clearall} votes, requires ${listeners < 3 ? listeners : 3} Use \`-clear all\` to vote.`); }
                else msg.channel.send(`\u{1f3b6} Invalid clear command.`);
            }
        }
    }
}