var request = require('request');
var path = require('path');
var authData = require(__root + "/storage/auth.json");

module.exports = {
	desc: "Uploads any single given image to imgur. A linked image take priority over an uploaded image if both are sent at the same time.\nUSAGE: -imgur [IMAGE_URL], -imgur [IMAGE_EMBED]\nALIAS: i",
	alias: ["i"],
	lvl: "all",
	func (msg, cmd, bot) {
        var uplink;
		if (!cmd) { 
            if (msg.attachments.size === 0) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
            else {
                switch(path.extname(msg.attachments.first().filename)) {
                    case ".gif": case ".jpeg": case ".jpg": case ".png": uplink = msg.attachments.first().url;
                    default: break;
                }
            }
        } else {
            switch (path.extname(cmd)) {
                case ".gif": case ".jpeg": case ".jpg": case ".png": uplink = cmd;
                default: break;
            }
        }
        if (uplink) { 
            request({
                method: "POST",
                url: 'https://api.imgur.com/3/image',
                headers: {
                    'authorization': 'Client-ID ' + authData.imgur_key,
                    'content-type': 'application/json'
                },
                json: {
                    "image": uplink
                }
            }, (err, res, body) => {
                if (err) msg.channel.send(err);
                else msg.channel.send("Upload Success: <" + body.data.link + ">");
            });
        }
	}
}