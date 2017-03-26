/**
 * Stub Driver for test
 *
 */

const Driver = require('../driver');

const StubDriver = module.exports = class StubDriver extends Driver {
	constructor(opts) {
		super(opts);
		this.name = 'Stub Driver';
	}

	start() {
		console.log('Stub driver start');
	}

	halt() {
		console.log('Stub driver halt');
	}
}