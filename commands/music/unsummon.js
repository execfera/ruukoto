module.exports = {
	desc: "Unsummons the bot from the voice channel in the current server.\nUSAGE: -unsummon",
	lvl: "all",
	func (msg, cmd, bot) {
        if (msg.guild.voiceConnection) {
            msg.channel.send(`Disconnected from ${msg.guild.voiceConnection.channel.name}.`);
            bot.music[msg.guild.id].playing = false;
            bot.music[msg.guild.id].np = {}; 
            msg.guild.voiceConnection.disconnect();
        }
        else msg.channel.send('No voice channel to be disconnected from.');
	}
}