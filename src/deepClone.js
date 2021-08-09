const deepClone = (obj, cache = new WeakMap()) => {
	if (cache.get(obj)) return cache.get(obj);

	let res;
	if (typeof obj === 'function') {
		res = function () {
			return obj.apply(this, arguments);
		};
		cache.set(obj, res);
		return res;
	}

	if (typeof obj === 'object') {
		if (obj instanceof RegExp) {
			/**
			 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/source
			 *
			 * source 属性返回一个值为当前正则表达式对象的模式文本的字符串，该字符串不会包含正则字面量两边的斜杠以及任何的标志字符
			 * flags 属性返回一个字符串，由当前正则表达式对象的标志组成
			 * */
			res = new RegExp(obj.source, obj.flags);
		} else if (obj instanceof Date) {
			res = new Date(res);
		} else if (obj === null) {
			//不能使用null作为key
			//Uncaught TypeError: Invalid value used as weak map key
			obj = {};
			res = null;

			//Set Map....
		} else {
			if (obj instanceof Array) {
				res = [];
			} else {
				res = {};
			}

			for (let prop in obj) {
				res[prop] = deepClone(obj[prop], cache);
			}
		}
		cache.set(obj, res);
		return res;
	}

	return obj;
};

export default deepClone;
