const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class CustomPromise {
	constructor(executor) {
		this.state = PENDING;
		this.value = '';
		this.reason = null;
		this.onFulfilledCallbacks = [];
		this.onRejectedCallbacks = [];

		try {
			executor(this.resolve, this.reject);
		} catch (e) {
			this.reject(e);
		}
	}

	resolve = (value) => {
		if (this.state === PENDING) {
			this.state = FULFILLED;
			this.value = value;
			this.onFulfilledCallbacks.forEach((fn) => fn(value));
		}
	};

	reject = (reason) => {
		if (this.state === PENDING) {
			this.state = REJECTED;
			this.reason = reason;
			this.onRejectedCallbacks.forEach((fn) => fn(reason));
		}
	};

	resolvePromise = (bridgePromise, promise, resolve, reject) => {
		if (bridgePromise === promise) {
			return reject(new TypeError('error'));
		}

		let called = false;
		if (promise instanceof CustomPromise) {
			if (promise.state === PENDING) {
				promise.then(
					(onFulFilled) => {
						this.resolvePromise(bridgePromise, onFulFilled, resolve, reject);
					},
					(error) => {
						reject(error);
					},
				);
			}
		} else if (
			promise != null &&
			(typeof promise === 'object' || typeof promise === 'function')
		) {
			try {
				let then = promise.then;
				if (typeof then === 'function') {
					then.call(
						(onFulFilled, onRejected) => {
							if (called) return;
							called = true;
							this.resolvePromise(bridgePromise, onRejected, resolve, reject);
						},
						(error) => {
							if (called) return;
							called = true;
							reject(error);
						},
					);
				} else {
					resolve(promise);
				}
			} catch (e) {
				if (called) return;
				called = true;
				reject(e);
			}
		} else {
			resolve(promise);
		}
	};

	then = (onFulFilled, onRejected) => {
		let bridgePromise;
		if (typeof onFulFilled !== 'function') {
			onFulFilled = function (value) {
				return value;
			};
		}
		if (typeof onRejected !== 'function') {
			onRejected = function (reason) {
				throw reason;
			};
		}

		switch (this.state) {
			case PENDING: {
				return (bridgePromise = new CustomPromise((resolve, reject) => {
					this.onFulfilledCallbacks.push((value) => {
						try {
							let promise = onFulFilled(value);
							this.resolvePromise(bridgePromise, promise, resolve, reject);
						} catch (e) {
							reject(e);
						}
					});
					this.onRejectedCallbacks.push((reason) => {
						try {
							let promise = onRejected(reason);
							this.resolvePromise(bridgePromise, promise, resolve, reject);
						} catch (e) {
							reject(e);
						}
					});
				}));
			}
			case FULFILLED: {
				return (bridgePromise = new CustomPromise((resolve, reject) => {
					setTimeout(() => {
						try {
							let promise = onFulFilled(this.value);
							this.resolvePromise(bridgePromise, promise, resolve, reject);
						} catch (e) {
							reject(e);
						}
					}, 0);
				}));
			}
			case REJECTED: {
				return (bridgePromise = new CustomPromise((resolve, reject) => {
					setTimeout(() => {
						try {
							let promise = onRejected(this.reason);
							this.resolvePromise(bridgePromise, promise, resolve, reject);
						} catch (e) {
							reject(e);
						}
					}, 0);
				}));
			}
		}
	};

	catch = (onReject) => {
		return this.then(null, onReject);
	};

	finally = (fn) => {
		return this.then(
			(value) => {
				fn();
				return value;
			},
			(reason) => {
				fn();
				throw reason;
			},
		);
	};
}

export default CustomPromise;
