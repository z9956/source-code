/**
 * 数组扁平化
 * */
const flatten = (arr) => {
	return arr.reduce((pre, cur) => {
		if (Array.isArray(cur)) {
			return pre.concat(flatten(cur));
		} else {
			pre.push(cur);
			return pre;
		}
	}, []);
};

export default flatten;
