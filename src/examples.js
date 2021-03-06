import Eventbus from './eventbus.js';
import flatten from './flatten.js';
import deepClone from './deepClone.js';
import throttle from './throttle.js';
import debounce from './debounce.js';
import CustomPromise from './customPromise.js';
import fakeParseJSON from './fakeParseJSON.js';
import './call-apply-bind.js';
import './array/forEach.js';
import './array/map.js';

const log = (info, style) => {
	console.log(`%c ${info} ------------`, `color:${style ?? 'blue'}`);
};

const $root = document.getElementById('root');
const eventbus = new Eventbus();

function createElementAndBindEvent({ tagName, text, event }) {
	const element = document.createElement(tagName);
	const content = document.createTextNode(text);

	element.appendChild(content);

	element.onclick = () => {
		event && event();
	};

	return element;
}

function eventbusMain() {
	eventbus.on('a', (data) => {
		console.log({ data });
	});

	eventbus.once('b', () => {
		console.log('bbb');
	});

	const eventList = [
		{
			tagName: 'button',
			text: 'a event',
			event: () => {
				eventbus.emit('a', { a: 1 });
			},
		},
		{
			tagName: 'button',
			text: 'b event',
			event: () => {
				eventbus.emit('b', 'b');
			},
		},
	];

	eventList.forEach((event) => {
		const element = createElementAndBindEvent(event);
		$root.appendChild(element);
	});
}

function customCall() {
	function Product(name, price) {
		this.name = name;
		this.price = price;
	}

	function Food(name, price) {
		Product.customCall(this, name, price);
		this.category = 'food';
	}

	console.log(new Food('cheese', 5)); // expected output: {name: "cheese", price: 5, category: "food"}
}

function customApply() {
	const array = ['a', 'b'];
	const elements = [0, 1, 2];
	array.push.customApply(array, elements);
	console.info(array); // ["a", "b", 0, 1, 2]

	const numbers = [5, 6, 2, 3, 7];
	const max = Math.max.customApply(null, numbers);
	console.log(max); // expected output: 7

	const min = Math.min.customApply(null, numbers);
	console.log(min); // expected output: 2
}

function customBind() {
	const module = {
		x: 42,
		getX: function () {
			return this.x;
		},
	};

	const unboundGetX = module.getX;
	console.log(unboundGetX()); /// expected output: undefined

	const boundGetX = unboundGetX.customBind(module);
	console.log(boundGetX()); // expected output: 42
}

function main() {
	eventbusMain();

	log('fakeParseJSON');
	const json = JSON.stringify({
		id: '06606f7c1b2248dda9bb8abcc95ccb71',
		label: '??????/????????????',
		icon: '',
		key: 'DEL_STAFF',
		category: 'DEL_STAFF',
		pid: '',
		order: 1,
		active: 1,
		type: 'DEL_STAFF',
		referType: 'STAFF',
		referId: 'ff562f550c9d4ca5a9646786d5a12135',
		status: 1,
		createdBy: 'SYSTEM',
		createdAt: 1628470728396,
		updatedBy: 'SYSTEM',
		updatedAt: 1628470728396,
	});
	console.log(json);
	console.log(fakeParseJSON(json));

	log('debounce');
	function test(e, content) {
		console.log(e, content);
	}
	let testFn = debounce(test, 300);
	document.onclick = function (e) {
		testFn(e, 'debounce');
	};

	log('throttle');
	const fun = throttle(() => {
		console.error('throttle');
	});
	fun();
	fun();
	fun();

	log('deepClone');
	const mm = {
		a: 11,
		a1: null,
		b: [{ l: 5 }],
		c: (param) => {
			console.log({ param });
		},
	};

	const nn = deepClone(mm);
	mm.b[0].l = '000';
	console.log(mm);
	console.log(nn.c(123));

	log('flatten');
	console.log(flatten([[1, 2], 3, 5, [1, 2], [6, 7, [2, 3]]]));

	log('customCall');
	customCall();

	log('customApply');
	customApply();

	// log('customBind');
	// customBind(); //undefined

	log('CustomPromise');

	new CustomPromise((resolve, reject) => {
		console.log('?????????');

		resolve();
	})
		.then(() => {
			throw new Error('??????????????????');

			console.log('?????????????????????');
		})
		.catch(() => {
			console.log('??????????????????');
		})
		.then(() => {
			console.log('????????????????????????????????????????????????');
		});

	log('MyForEach');
	const list = ['a', 'b', 'c'];
	list.myForEach((cur, index, arr) => {
		console.log(cur, index, arr);
	});

	log('MyMap');
	const newArr = [1, 2, 3].myMap(
		function (item, index, arr) {
			console.log(this[index], item, index, arr);
			return item * 2;
		},
		[4, 5, 6],
	);

	console.log(newArr);
}

export default main;
