Function.prototype.customCall = function (context, ...args) {
	if (this === Function.prototype) {
		throw new TypeError('');
	}

	context = context || window;
	context.fn = this;

	const res = context.fn(...args);
	delete context.fn;

	return res;
};

Function.prototype.customApply = function (context, args) {
	if (this === Function.prototype) {
		throw new TypeError('');
	}

	context = context || window;
	context.fn = this;

	const res = args && Array.isArray(args) ? context.fn(...args) : context.fn();
	delete context.fn;

	return res;
};

Function.prototype.customBind = function (context) {
	if (this === Function.prototype) {
		throw new TypeError('Error');
	}

	const self = this;

	return function F(...ages) {
		if (self instanceof F) {
			return new self(...ages);
		}

		return self.apply(context, ages);
	};
};
