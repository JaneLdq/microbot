/**
 * Stub Driver for test
 *
 */

const Driver = require('../driver');

const StubDriver = module.exports = class StubDriver extends Driver {
	constructor(opts) {
		super(opts);
	}

	start(callback) {
		if(callback) callback();
	}

	halt(callback) {
		if(callback) callback();
	}

	setRGB(color) {
		console.log('I am on ' + color + ' now.');
	}

	celsius(callback) {
		return Math.floor((Math.random(0,1) * 40));
	}
}