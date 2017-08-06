module.exports = {
	desc: "Summons the bot to a voice channel.\nUSAGE: -summon",
	lvl: "all",
	func (msg, cmd, bot) {
                if (!(msg.guild.id in bot.music)) bot.music[msg.guild.id] = {
			playing: false,
			np: {},
			songs: [],
			dispatcher: {}
		};
		if (msg.member.voiceChannel) {
                        msg.member.voiceChannel.join()
                        .then(connection => { 
                        msg.channel.send(`Connected to ${msg.member.voiceChannel.name}.`);
                        })
                        .catch(console.log);
                } 
                else msg.channel.send('Please join a voice channel first.');
        }
}