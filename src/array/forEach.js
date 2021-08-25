Array.prototype.myForEach = function (cb) {
	if (typeof cb !== 'function') throw new Error(`${cb} is not a function`);

	for (let i = 0; i < this.length; i++) {
		cb(this[i], i, this);
	}
};
