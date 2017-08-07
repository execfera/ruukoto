module.exports = {
	desc: "Lists the current queue of songs.\nUSAGE: -queue",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {}) return msg.channel.send(`\u{1f3b6} No songs currently loaded.`);
        let np = bot.music[msg.guild.id].np;
        let currtime = (bot.music[msg.guild.id].dispatcher.time/1000).sec2hms();
        var content = `\u{1f3b6} Now playing: **${np.title}** (${currtime}/${np.len}) requested by **${np.req}**.\n\n`;
        var contqueue = "";
        if (bot.music[msg.guild.id].songs.length > 0) {
            for (let i = 0; i < (bot.music[msg.guild.id].songs.length > 10 ? 10 : bot.music[msg.guild.id].songs.length); i++) {
                contqueue += `\`[${i<9?'0':''}${i+1}]\` **${bot.music[msg.guild.id].songs[i].title}** (${bot.music[msg.guild.id].songs[i].len}) by **${bot.music[msg.guild.id].songs[i].req}**\n`;
            }
            if (bot.music[msg.guild.id].songs.length > 10) {
                contqueue += `\nNot shown: ${bot.music[msg.guild.id].songs.length - 10} more. `;
            }
        }
        let remain = Number(bot.music[msg.guild.id].songs.reduce((s,v)=>{ return s+v.lensec; }, 0)) + Number(bot.music[msg.guild.id].np.lensec) - Math.floor(bot.music[msg.guild.id].dispatcher.time/1000);
        msg.channel.send(`${content}${contqueue}Estimated playback time remaining: ${Number(remain).sec2hms()}`);
    }
}