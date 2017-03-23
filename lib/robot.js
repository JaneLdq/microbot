/**
 * A robot is consist of one or more components connected to one or more platforms
 * 
 * TODO
 *
 */
let EventEmitter = require('events').EventEmitter,
	Service = require('./service/service'),
	Logger = require('./logger'),
	MError = require('./errors'),
	_ = require('lodash');

let ROBOT_ID = 1;

/**
 * Robot class
 *
 * @constructor Robot
 * @param {Object} [opts] robot options
 * @param {String} [opts.name] the robot's name
 * @param {Object} [opts.connections] object containing connection info for the Robot
 * @param {Object} [opts.devices] object containing device information for the Robot
 * @param {Object} [opts.sevice] the service the robot published
 * @param {Function} [opts.run] the main thread while the robot is running
 * @returns {Robot} new Robot instance
 */
let Robot = module.exports = class Robot extends EventEmitter {

	constructor(opts) {
		super();
		opts = opts || {};
		opts.name = opts.name || "Robot " + ROBOT_ID++;

		let that = this;

		// assign robot's options
		_.forEach(opts, (value, key) => {
			that[key] = value;
		});

		if (!this.run) {
			this.run = function() {
				console.log("No run job yet");
			};
		}

		// init service
		if (opts.service) {
			opts.service.robot = this;
			this.service = new Service(opts.service);
		}
	}

	/**
	 * Start a robot
	 *
	 * @param {Boolean} [deliver] if true, start service when starting a robot
	 * @return {void}
	 */
	start(deliver) {
		this.run.call(this, this);
		if(deliver && this.service) {
			this.service.start();
		}
		Logger.info('ROBOT', this.name + ' is running');
		return this;
	}

	/**
	 * TODO halt
	 */
	halt() {

	}

	/**
	 * Start the service if has one
	 *
	 * @return {void}
	 */
	serve() {
		if (this.service) {
			this.service.start();
		} else {
			throw MError.PropertyMissingError('Robot', 'service', 'robot name: ' + this.name);
		}
	}

	/**
	 * Stop the service if has one
	 *
	 * @return {void}
	 */
	quit() {
		if (this.service) {
		this.service.close();
		}
	}
};