String.prototype.markbold = function () { return "**" + this + "**"; }
String.prototype.markline = function () { return "__" + this + "__"; }
String.prototype.code = function () { return "`" + this + "`"; }
String.prototype.codeblock = function (lang="") { return "```" + lang + "\n" + this + "\n```"; }
String.prototype.mention2id = function () { return this[2] === '!' ? this.slice(3,-1) : this.slice(2,-1); }
String.prototype.id2mention = function () { return "<@" + this + ">"; }
String.prototype.hms2sec = function () {
    var arr = this.split(':'), sec = 0, multi = 1;
    while (arr.length > 0) {
        sec += multi * parseInt(arr.pop(), 10);
        multi *= 60;
    }
    return sec;
}

Number.prototype.timeCounter = function (msecond=true) {
    var t = msecond ? Math.floor(this/1000) : this;
    var years = Math.floor(t / 31536000);
    t = t - (years * 31536000);
    var months = Math.floor(t / 2592000);
    t = t - (months * 2592000);
    var days = Math.floor(t / 86400);
    t = t - (days * 86400);
    var hours = Math.floor(t / 3600);
    t = t - (hours * 3600);
    var minutes = Math.floor(t / 60);
    t = t - (minutes * 60);
    var content = [];
	if (years) content.push(years + " year" + (years > 1 ? "s" : ""));
	if (months) content.push(months + " month" + (months > 1 ? "s" : ""));
	if (days) content.push(days + " day" + (days > 1 ? "s" : ""));
	if (hours) content.push(hours + " hour"  + (hours > 1 ? "s" : ""));
	if (minutes) content.push(minutes + " minute" + (minutes > 1 ? "s" : ""));
	if (t) content.push(t + " second" + (t > 1 ? "s" : ""));
	return content.slice(0,3).join(', ');
}

Number.prototype.sec2hms = function () {
	let sec = Math.floor(this);
	hrs = Math.floor(sec / 3600);
	sec %= 3600;
	min = Math.floor(sec / 60);
	sec %= 60;
	return (hrs?hrs+':':'') + (hrs?('0'+min).slice(-2):min) + ':' + ('0'+sec).slice(-2);
}