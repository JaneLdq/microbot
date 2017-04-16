/**
 * Adaptor is abstraction of hardware platforms
 * 
 * TODO
 *
 */
const EventEmitter = require('events').EventEmitter,
	MErrors = require('./errors'),
	_ = require('lodash');

const Adaptor = module.exports = class Adaptor extends EventEmitter {

	constructor(opts = {}) {
		super();
		
		if (!(opts.port || opts.port)) {
			throw MErrors.PropertyMissingError('Adaptor', 'port');
		}

		this.name = opts.name;
		this.robot = opts.robot;
		this.port = opts.port;
		this.details = {};

		_.forEach(opts, (value, key) => {
			if(!(key == 'robot' || key == 'name' || key == 'port' || key == 'adaptor')) {
				this.details[key] = value;
			}
		});
	}

	connect(callback) {
		throw new MErrors.InterfaceUnimplementedError('Adaptor', this.name, 'connect');
	}

	disconnect(callback) {
		throw new MErrors.InterfaceUnimplementedError('Adaptor', this.name, 'disconnect');
	}

	/**
	 * [Private] Triggers the provided callback, and emits an event with the provided data.
	 *
	 * If an error is provided, emits the 'error' event.
	 *
	 * @param {String} [event] what event to emit
	 * @param {Function} [callback] function to be invoked with error/data
	 * @param {*} [err] possible error value
	 * @param {...*} data data values to be passed to error/callback
	 * @return {void}
	 */
	_respond(event, callback, err) {
		let args = Array.prototype.slice.call(arguments, 3);
		if (err) {
			this.emit("error", err);
		} else {
			this.emit.apply(this, [event].concat(args));
		}

		if (typeof callback === "function") {
			callback.apply(this, [err].concat(args));
		}
	}

	toJSON() {
		let obj = {
			name: this.name,
			port: this.port,
			details: this.details
		};
		return obj;
	}
}
