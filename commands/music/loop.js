module.exports = {
	desc: "Causes the current song to loop, or vice versa.\nUSAGE: -loop",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {}) return msg.channel.send(`\u{1f3b6} No song currently loaded.`);
        if (!msg.guild.voiceConnection) return msg.channel.send(`\u{1f3b6} Bot is not currently in a voice channel.`);
        if (msg.member.voiceChannel.id !== msg.guild.voiceConnection.channel.id) return msg.channel.send(`\u{1f3b6} You cannot toggle the loop without being in the music bot's channel.`);

        bot.music[msg.guild.id].loop = bot.music[msg.guild.id].loop ? false : true;
        msg.channel.send(bot.music[msg.guild.id].loop ? `\u{1f3b6} Looping the currently playing song.` : `\u{1f3b6} Looping toggled off.`);
    }
}