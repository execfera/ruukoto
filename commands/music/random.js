module.exports = {
	desc: "Randomizes playback of music queue.\nUSAGE: -random",
	lvl: "all",
	func (msg, cmd, bot) {
        if (!(msg.guild.id in bot.music) || bot.music[msg.guild.id].dispatcher === {}) return msg.channel.send(`\u{1f3b6} No song currently loaded.`);
        if (!msg.guild.voiceConnection) return msg.channel.send(`\u{1f3b6} Bot is not currently in a voice channel.`);
        if (msg.member.voiceChannel.id !== msg.guild.voiceConnection.channel.id) return msg.channel.send(`\u{1f3b6} You cannot toggle the playback randomizer without being in the music bot's channel.`);
 
        bot.music[msg.guild.id].random = bot.music[msg.guild.id].random ? false : true;
        msg.channel.send(bot.music[msg.guild.id].random ? `\u{1f3b6} Randomizing queue playback.` : `\u{1f3b6} Playlist randomizer toggled off.`); 
    }
}