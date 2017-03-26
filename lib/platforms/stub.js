/**
 * Stub Adaptor for test
 *
 */

const Adaptor = require('../adaptor');

const StubAdaptor = module.exports = class StubAdaptor extends Adaptor {
	constructor(opts) {
		super(opts);
		this.name = 'Stub Adaptor';
	}

	connect() {
		console.log('Stub adaptor connect');
	}

	disconnect() {
		console.log('Stub adaptor disconnect');
	}
}