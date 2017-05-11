if (!String.prototype.leftPad) {
	String.prototype.leftPad = function (length, str) {
		if (this.length >= length) {
			return this;
		}
		str = str || ' ';
		return (new Array(Math.ceil((length - this.length) / str.length) + 1).join(str)).substr(0, (length - this.length)) + this;
	};
}
if (!String.prototype.rightPad) {
	String.prototype.rightPad = function (length, str) {
		if (this.length >= length) {
			return this;
		}
		str = str || ' ';
		return this + (new Array(Math.ceil((length - this.length) / str.length) + 1).join(str)).substr(0, (length - this.length));
	};
}