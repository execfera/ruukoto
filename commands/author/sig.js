var fs = require('fs');
var gm = require('gm');
var request = require('request');
var math = require('mathjs');
var authData = require(__root + "/storage/auth.json");

module.exports = {
	desc: "Generates RE:RN signature.\nUSAGE: -sig [CHAR_ID:0-3] [ZENNY] [BUGFRAG]",
	lvl: "author",
	func (msg, cmd, bot) {
		if (!cmd) { msg.channel.send(require('path').parse(__filename).name + ": " + this.desc, {code: true}); }
		else {
            var args = cmd.split(' ');
            args[1] = math.eval(args[1]);            
            args[2] = math.eval(args[2]);
            var color = ["283c7d", "46712d", "512d71", "4b3024"]; // Eternalis, Terra, Scourge, Slice
            var nrarray = args[1].toString().split('').map(x => __root + '/storage/sig/number' + x + '.png').reverse();
            var gms = gm(nrarray[0]);
            for (let i = 1; i < nrarray.length; i++) gms.append(nrarray[i], true);
            gms.antialias(false)
                .fill("#" + color[args[0]])
                .draw("color 4,1 replace")
                .transparent("#ffffff")
                .rotate("#000", 180)
                .write('./numbersout1.png', e => {});
            nrarray = args[2].toString().split('').map(x => __root + '/storage/sig/number' + x + '.png').reverse();
            gms = gm(nrarray[0]);
            for (let i = 1; i < nrarray.length; i++) gms.append(nrarray[i], true);
            gms.antialias(false)
                .fill("#" + color[args[0]])
                .draw("color 4,1 replace")
                .transparent("#ffffff")
                .rotate("#000", 180)
                .write('./numbersout2.png', e => {});
            gm(__root + '/storage/sig/sig' + args[0] + '.png')
                .rotate("#000", -90)
                .fill("#" + color[args[0]])
                .draw("image Over 199,6 0,0 numbersout1.png")
                .draw("image Over 130,6 0,0 numbersout2.png")
                .rotate("#000", 90)
                .toBuffer('PNG',function (err, buf) {
                    if (err) msg.channel.send(err);
                    else {
                        fs.unlink(__root + "/numbersout1.png"); 
                        fs.unlink(__root + "/numbersout2.png"); 
                        request({
                            method: "POST",
                            url: 'https://api.imgur.com/3/image',
                            headers: {
                                'authorization': 'Client-ID ' + authData.imgur_key,
                                'content-type': 'application/json'
                            },
                            json: {
                                "image": buf.toString('base64')
                            }
                        }, (err, res, body) => {
                            if (err) msg.channel.send(err);
                            else { 
                                msg.channel.send("Success: " + body.data.link + "\nBBCode: " + ("[imgur=" + body.data.id + "]").code()); 
                            }
                        });
                    }
                });
        }
	}
}