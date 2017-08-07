module.exports = {
	desc: "Votes to skip a currently running song.\nOwner-only: If number is given, skips said amount of songs, or use 'skip all' to skip to the last song.\nUSAGE: -skip, -skip [NUMBER], -skip all",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {}) return msg.channel.send(`\u{1f3b6} No song currently loaded.`);
        if (!msg.guild.voiceConnection) return msg.channel.send(`\u{1f3b6} Bot is not currently in a voice channel.`);
        if (msg.member.voiceChannel.id !== msg.guild.voiceConnection.channel.id) return msg.channel.send(`\u{1f3b6} You cannot vote for a skip without being in the music bot's channel.`);
        
        var listeners = msg.guild.voiceConnection.channel.members.reduce((s,v)=>{ return (v.selfDeaf || v.serverDeaf || v.id === bot.user.id) ? s : ++s; }, 0);
        
        if (msg.author.id === "91327883208843264") {
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
            bot.music[msg.guild.id].skip = 0;
            bot.music[msg.guild.id].dispatcher.end();
        }
        else if ((++bot.music[msg.guild.id].skip >= (listeners < 3 ? listeners : 3)) || bot.music[msg.guild.id].np.reqid === msg.author.id)
        {
            let np = bot.music[msg.guild.id].np;
            msg.channel.send(`\u{1f3b6} Skipping: **${np.title}** (${np.len}) requested by: **${np.req}**.`);
            bot.music[msg.guild.id].skip = 0;
            bot.music[msg.guild.id].dispatcher.end();
        }
        else msg.channel.send(`Vote to skip now at ${bot.music[msg.guild.id].skip} votes, requires ${listeners < 3 ? listeners : 3}. Use \`-vote\` to vote.`);
    }
}