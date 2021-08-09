import Eventbus from './eventbus.js';
import './call-apply-bind.js';

const log = (info, style) => {
	console.log(`%c${info}%c ------------`, `color:${style ?? 'blue'}`);
	// console.log(
	// 	`%c ${info} %c, 'color:${
	// 		style ?? 'blue'
	// 	}','','color:orange;font-weight:bold'`,
	// );
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
	log('eventbus');
	eventbusMain();

	log('customCall');
	customCall();

	log('customApply');
	customApply();

	log('customBind');
	customBind();
}

export default main;
