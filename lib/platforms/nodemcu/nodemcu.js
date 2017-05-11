/**
 * NodeMCU Adaptor
 */
const http = require('http'),
	Adaptor = require('../../adaptor'),
	_ = require('lodash');

const NodeMCU = module.exports = class NodeMCU extends Adaptor {
	
	constructor(opts) {
		super(opts);
		this.host = opts.host;
		this.port = opts.port;
		this.MODES = {
			INPUT: 0,
			OUTPUT: 1,
			INT: 2,
			OPENDRAIN: 3
		};
	}

	connect(callback) {
		let req = http.request({
			host: this.host,
			port: this.port,
			path: '/connect',
			method: 'GET'
		}, (res) => {
			this._respond('connect', callback);
		});
		console.log('hi!');
		req.on('connect', () => {
			console.log('connected!');
		});
		req.on('error', (err) => {
			console.log(err);
		});
		req.end();
	}

	disconnect(callback) {
		// TODO
	}

	/**
	 * Set pin mode for gpio pins
	 */
	mode(pin, mode) {
		let params = {
			pin: pin,
			mode: mode
		}
		let req = http.request(this._requestOption('/mode', params), (res) => {
			console.log('mode!');
		});
		req.end();
	}

	/*
	 * Write a HIGH or a LOW value to a digital pin
	 * @param {Number} [pin] the number of the pin
	 * @param {Number} [value] 0 is LOW, non-zero is HIGH
	 * @return {void}
	 */
	digitalWrite(pin, value) {
		let params = {
			pin: pin,
			val: value
		}
		let req = http.request(this._requestOption('/dw', params), (res) => {
			console.log(pin, value);
		});
		req.end();
	}

	_requestOption(cmd, params) {
		let qs = '?';
		_.forEach(params, (val, key) => {
			qs += key + '=' + val + '&';
		});
		qs = qs.substring(0, qs.length-1);
		console.log(qs);
		return {
			host: this.host,
			port: this.port,
			method: 'GET',
			path: cmd + qs
		}
	}
}