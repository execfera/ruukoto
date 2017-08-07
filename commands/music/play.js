var yt = require('ytdl-core');
var ytpl = require('ytpl');
var ytsr = require('ytsr');
var path = require('path');

module.exports = {
	desc: "Plays/queues a YouTube link to a voice channel, or a linked/attached song. You can also use a search term to search YouTube instead and play the first result obtained.\nUSAGE: -play [YT_LINK], -play [SONG_LINK], -play [SONG_UPLOAD], -play [YT_SEARCH_TERM]\nALIAS: add\nNOTE: \n- Must be in a voice channel. Queue length will be inaccurate if the queue contains a directly linked song.\n- Only the first file will be taken from a multiple file upload.\n- Links take priority over uploaded files.",
	lvl: "all",
	alias: ["add"],
	func (msg, cmd, bot) {
		(async () => {
			if (!(msg.guild.id in bot.music)) bot.music[msg.guild.id] = {
				playing: false,
				skip: 0,
				clear: 0,
				clearall: 0,
				clearlast: 0,
				np: {},
				songs: [],
				dispatcher: {}
			};

			if (!msg.member.voiceChannel) return msg.channel.send('Please join a voice channel first.');
			else if (!msg.guild.voiceConnection || msg.member.voiceChannel.id !== msg.guild.voiceConnection.channel.id) {
				try {
					await msg.member.voiceChannel.join();
					await msg.channel.send(`Connected to ${msg.member.voiceChannel.name}.`);
				} catch (err) { msg.channel.send('\u{1f3b6} Error: ' + err); }
			} 

			if (cmd && cmd[0] === "<" && cmd[cmd.length-1] === ">") cmd = cmd.slice(1,-1);

			if (!cmd) { 
				if (msg.attachments.size === 0) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
				else {
					switch(path.extname(msg.attachments.first().filename)) {
						case ".mp3": case ".flac": case ".ogg": case ".wav": {
							let eta = '';
							if(bot.music[msg.guild.id].playing) {
								let remain = Number(bot.music[msg.guild.id].songs.reduce((s,v)=>{ return s+v.lensec; }, 0)) + Number(bot.music[msg.guild.id].np.lensec) - Math.floor(bot.music[msg.guild.id].dispatcher.time/1000);
								eta = ` Estimated time until song playback: \`${remain.sec2hms()}\``;
							} 
							song = {type: "link", url: msg.attachments.first().url, title: path.basename(msg.attachments.first().url), len: '0:00', lensec: 0, req: msg.author.username, reqid: msg.author.id};
							bot.music[msg.guild.id].songs.push(song); 
							await msg.channel.send(`\u{1f3b6} Added **${song.title}** to the queue.${eta}`); break;
						} 
						default: await msg.channel.send(`\u{1f3b6} Error: Invalid format.`);
					}
				}
			} else if (cmd.indexOf('playlist?') > -1) {
				try { 
					let eta = '';
					if(bot.music[msg.guild.id].playing) {
						let remain = Number(bot.music[msg.guild.id].songs.reduce((s,v)=>{ return s+v.lensec; }, 0)) + Number(bot.music[msg.guild.id].np.lensec) - Math.floor(bot.music[msg.guild.id].dispatcher.time/1000);
						eta = ` Estimated time until song playback: \`${remain.sec2hms()}\``;
					}
					let info = await ytpl(cmd);
					info.items.forEach((e,i) => {
						song = {type: "yt", url: info.items[i].url, title: info.items[i].title, len: info.items[i].duration, lensec: info.items[i].duration.hms2sec(), req: msg.author.username, reqid: msg.author.id};
						bot.music[msg.guild.id].songs.push(song);
					});
					await msg.channel.send(`\u{1f3b6} Added playlist **${info.title}** (${info.total_items} songs) to the queue.${eta}`);
				} catch (err) { msg.channel.send('\u{1f3b6} Error: ' + err); }
			} else if (cmd.indexOf('youtu.be') > -1 || cmd.indexOf('youtube.com') > -1) { 
				try {
					let eta = '';
					if(bot.music[msg.guild.id].playing) {
						let remain = Number(bot.music[msg.guild.id].songs.reduce((s,v)=>{ return s+v.lensec; }, 0)) + Number(bot.music[msg.guild.id].np.lensec) - Math.floor(bot.music[msg.guild.id].dispatcher.time/1000);
						eta = ` Estimated time until song playback: \`${remain.sec2hms()}\``;
					}
					let info = await yt.getInfo(cmd);
					song = {type: "yt", url: cmd, title: info.title, len: Number(info.length_seconds).sec2hms(), lensec: Number(info.length_seconds), req: msg.author.username, reqid: msg.author.id};
					bot.music[msg.guild.id].songs.push(song);
					await msg.channel.send(`\u{1f3b6} Added **${song.title}** (${song.len}) to the queue at position \`${bot.music[msg.guild.id].songs.length}\`.${eta}`);
				} catch (err) { msg.channel.send('\u{1f3b6} Error: ' + err); }
			} else {
				switch (path.extname(cmd)) {
					case ".mp3": case ".flac": case ".ogg": case ".wav": {
						let eta = '';
						if(bot.music[msg.guild.id].playing) {
							let remain = Number(bot.music[msg.guild.id].songs.reduce((s,v)=>{ return s+v.lensec; }, 0)) + Number(bot.music[msg.guild.id].np.lensec) - Math.floor(bot.music[msg.guild.id].dispatcher.time/1000);
							eta = ` Estimated time until song playback: \`${remain.sec2hms()}\``;
						} 
						song = {type: "link", url: cmd, title: path.basename(cmd), len: '0:00', lensec: 0, req: msg.author.username, reqid: msg.author.id};
						bot.music[msg.guild.id].songs.push(song); 
						await msg.channel.send(`\u{1f3b6} Added **${song.title}** to the queue at position \`${bot.music[msg.guild.id].songs.length}\`.${eta}`); break;
					} 
					default: {
						try {
							let eta = '';
							if(bot.music[msg.guild.id].playing) {
								let remain = Number(bot.music[msg.guild.id].songs.reduce((s,v)=>{ return s+v.lensec; }, 0)) + Number(bot.music[msg.guild.id].np.lensec) - Math.floor(bot.music[msg.guild.id].dispatcher.time/1000);
								eta = ` Estimated time until song playback: \`${remain.sec2hms()}\``;
							} 
							info = await ytsr.search(cmd, {limit: 1});
							if (!info.items.length) return msg.channel.send('No video found.');
							else {
								let proxy = await yt.getInfo(info.items[0].link);
								let duration = proxy.length_seconds;
								song = {type: "yt", url: info.items[0].link, title: info.items[0].title, len: Number(duration).sec2hms(), lensec: Number(duration), req: msg.author.username, reqid: msg.author.id};
								bot.music[msg.guild.id].songs.push(song);
								await msg.channel.send(`\u{1f3b6} Added **${song.title}** (${song.len}) to the queue at position \`${bot.music[msg.guild.id].songs.length}\`.${eta}`);
							}
						} catch (err) { msg.channel.send(err); }
					}
				}
			}
			if (!bot.music[msg.guild.id].playing) {
				(function play(song) {
					if (song === undefined) {
						bot.music[msg.guild.id].playing = false;
						bot.music[msg.guild.id].np = {};
						return msg.guild.voiceConnection.disconnect();
					}
					bot.music[msg.guild.id].np = song;
					bot.music[msg.guild.id].playing = true;
					if (song.type === "yt") bot.music[msg.guild.id].dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), {passes: 3});
					else bot.music[msg.guild.id].dispatcher = msg.guild.voiceConnection.playArbitraryInput(song.url, {passes: 3});
					bot.music[msg.guild.id].dispatcher.on('start', () => {
						msg.channel.send(`\u{1f3b6} Now playing: **${song.title}** (${song.len}) requested by **${song.req}**.`);
					});
					bot.music[msg.guild.id].dispatcher.on('end', () => {
						/* Temporary Workaround for StreamDispatcher Race Condition 
						/- Track https://github.com/hydrabolt/discord.js/issues/1387 for progress.
						*/
						setTimeout(()=>{ play(bot.music[msg.guild.id].songs.shift()) },100);
					});
					bot.music[msg.guild.id].dispatcher.on('error', (err) => {
						return msg.channel.send('\u{1f3b6} Error: ' + err).then(() => {
							play(bot.music[msg.guild.id].songs.shift());
						});
					});
				})(bot.music[msg.guild.id].songs.shift());
			}
		})();
	}
}