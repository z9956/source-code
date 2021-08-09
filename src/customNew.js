const customNew = (Func, ...args) => {
	const obj = Object.create({}); //
	obj.__proto__ = Func.prototype;
	const res = Func.apply(obj, args);
	return res instanceof Object ? res : obj;
};

function A() {}

console.log(customNew(A));
