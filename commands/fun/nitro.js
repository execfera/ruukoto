var Discord = require('discord.js');

module.exports = {
	desc: "Sends a Discord Nitro-only message.\nUSAGE: -nitro",
	lvl: "author",
	func (msg, cmd, bot) {
		var embed = new Discord.RichEmbed();
        embed.setAuthor(`Discord Nitro Message`, 'https://cdn.discordapp.com/emojis/264287569687216129.png')
         .setDescription('[Discord Nitro](https://discordapp.com/nitro) is **required** to view this message.')
         .setThumbnail('https://cdn.discordapp.com/attachments/194167041685454848/272617748876492800/be14b7a8e0090fbb48135450ff17a62f.png');
        msg.delete().then(m => m.channel.send({embed: embed}));
	}
}