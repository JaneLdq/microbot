/**
 * Adaptor is abstraction of hardware platforms
 * 
 * TODO
 *
 */
const EventEmitter = require('events').EventEmitter,
	MErrors = require('./errors');

const Adaptor = module.exports = class Adaptor extends EventEmitter {

	constructor() {
		super();
	}

	connect() {
		throw new MErrors.InterfaceUnimplementedError('Adaptor', this.name, 'connect');
	}

	disconnect() {
		throw new MErrors.InterfaceUnimplementedError('Adaptor', this.name, 'disconnect');
	}

}