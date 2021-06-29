import Eventbus from './eventbus';

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

function main() {
	eventbusMain();
}

export default main;
