/**
 * Stub Adaptor for test
 *
 */

const Adaptor = require('../adaptor');

const StubAdaptor = module.exports = class StubAdaptor extends Adaptor {
	constructor(opts) {
		super(opts);
	}

	connect(callback) {
		callback();
	}

	disconnect(callback) {
		callback();
	}
}