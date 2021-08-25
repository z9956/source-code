// https://www.cnblogs.com/bejamin/p/13443204.html
Array.prototype.myMap = function (fn, thisArg = this) {
	if (typeof fn !== 'function') throw new Error(`${fn} is not a function`);

	let arr = [];

	this.forEach((item, index) => {
		arr.push(fn.call(thisArg, item, index, this));
	});

	return arr;
};
