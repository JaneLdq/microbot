/**
 * Driver is abstraction of components that connected to hardware platforms
 * 
 * TODO
 *
 */
const EventEmitter = require('events').EventEmitter,
	MErrors = require('./errors');

const Driver = module.exports = class Driver extends EventEmitter {

	constructor() {
		super();
	}

	start() {
		throw new MErrors.InterfaceUnimplementedError('Driver', this.name, 'start');
	}

	halt() {
		throw new MErrors.InterfaceUnimplementedError('Driver', this.name, 'halt');
	}
	
}