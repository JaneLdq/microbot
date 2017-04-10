/**
 * Driver is abstraction of components that connected to hardware platforms
 * 
 * TODO
 *
 */
const EventEmitter = require('events').EventEmitter,
	MErrors = require('./errors'),
	_ = require('lodash');

const Driver = module.exports = class Driver extends EventEmitter {

	constructor(opts) {
		super();
		this.robot = opts.robot;
		this.name = opts.name;
		this.connection = opts.connection;

		this.details = {};

		let reserved = ['robot', 'name', 'connection', 'driver'];
		_.forEach(opts, (value, key) => {
			if(!(key == 'robot' || key == 'name' || key == 'connection' || key == 'driver')) {
				this.details[key] = value;
			}
		});

	}

	start() {
		throw new MErrors.InterfaceUnimplementedError('Driver', this.name, 'start');
	}

	halt() {
		throw new MErrors.InterfaceUnimplementedError('Driver', this.name, 'halt');
	}

	toJSON() {
		let obj = {
			name: this.name,
			connection: this.connection.toJSON(),
			details: this.details
		}
		return obj;
	}
	
}