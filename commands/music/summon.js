var playlist = require(__root + "/storage/playlist.json");
var yt = require('ytdl-core');

module.exports = {
        desc: "Summons the bot to a voice channel.\nUSAGE: -summon",
	lvl: "all",
	func (msg, cmd, bot) {
                (async () => {
                        if (!(msg.guild.id in bot.music)) bot.music[msg.guild.id] = {
                                playing: false,
                                loop: false,
                                np: {},
                                skip: [],
                                clear: [],
                                clearall: [],
                                clearlast: [],
                                songs: [],
                                dispatcher: {}
                        };
                        if (msg.member.voiceChannel) {
                                await msg.member.voiceChannel.join();
                                await msg.channel.send(`Connected to ${msg.member.voiceChannel.name}.`);
                                if (!bot.music[msg.guild.id].playing) {
                                        (function play(song) {
                                                if (song === undefined) {
                                                        let defsong;
                                                        if (msg.guild.id in playlist) defsong = playlist[msg.guild.id][Math.floor(Math.random()*playlist[msg.guild.id].length)]; 
                                                        else defsong = playlist.default[Math.floor(Math.random()*playlist.default.length)];
                                                        if (bot.music[msg.guild.id].loop && bot.music[msg.guild.id].np !== {}) defsong = np;
                                                        return play(defsong);
                                                } else {
                                                        bot.music[msg.guild.id].np = song;
                                                        bot.music[msg.guild.id].playing = true;
                                                        if (song.type === "yt") bot.music[msg.guild.id].dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), {passes: 2});
                                                        else bot.music[msg.guild.id].dispatcher = msg.guild.voiceConnection.playArbitraryInput(song.url, {passes: 2});
                                                        bot.music[msg.guild.id].dispatcher.on('start', () => {
                                                                msg.channel.send(`\u{1f3b6} Now ${bot.music[msg.guild.id].loop?'looping':'playing'}: **${song.title}** (${song.len}) requested by **${song.req}**.`);
                                                        });
                                                        bot.music[msg.guild.id].dispatcher.on('end', () => {
                                                                /* Temporary Workaround for StreamDispatcher Race Condition 
                                                                /- Track https://github.com/hydrabolt/discord.js/issues/1387 for progress.
                                                                */
                                                                setTimeout(()=>{ 
								        if (bot.music[msg.guild.id].loop && bot.music[msg.guild.id].np !== {}) play(bot.music[msg.guild.id].np);
								        else play(bot.music[msg.guild.id].songs.shift());
							        },100);
                                                        });
                                                        bot.music[msg.guild.id].dispatcher.on('error', (err) => {
                                                                return msg.channel.send('\u{1f3b6} Error: ' + err).then(() => {
                                                                        play(bot.music[msg.guild.id].songs.shift());
                                                                });
                                                        });
                                                        bot.on("voiceStateUpdate", (oldUser, newUser) => {
                                                                if (msg.guild.voiceConnection && msg.guild.voiceConnection.channel.members.size === 1) {
                                                                        bot.music[msg.guild.id] = {
                                                                                playing: false,
                                                                                loop: false,
                                                                                skip: [],
                                                                                clear: [],
                                                                                clearall: [],
                                                                                clearlast: [],
                                                                                np: {},
                                                                                songs: [],
                                                                                dispatcher: {}
                                                                        };
                                                                        msg.guild.voiceConnection.disconnect();
                                                                }
                                                        });
                                                }
                                        })(bot.music[msg.guild.id].songs.shift());
                                }
                        } 
                        else msg.channel.send('Please join a voice channel first.');
                
                })();
        }
}