/**
 * A robot is consist of one or more components connected to one or more platforms
 * 
 * TODO
 *
 */
var EventEmitter = require('events').EventEmitter,
	Utils = require('./utils'),
	Service = require('./service/service'),
	Logger = require('./logger'),
	MError = require('./errors'),
	_ = require('lodash');

var ROBOT_ID = 1;

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
var Robot = module.exports = function Robot(opts) {
	opts = opts || {};
	// TODO robot constructor
	this._initRobot(opts);
	this._initService(this.service);
};

Utils.inherits(Robot, EventEmitter);

/**
 * Initializes all values for a new Robot.
 *
 * @param {Object} opts object passed to Robot constructor
 * @return {void}
 */
Robot.prototype._initRobot = function(opts) {
	opts.name = opts.name || "Robot " + ROBOT_ID++;

	var that = this;
	_.forEach(opts, function(value, key) {
		that[key] = value;
	});

	if (!this.run) {
		this.run = function() {
			console.log("No run job yet");
		};
	}

};

/**
 * Start a robot
 *
 * @param {Boolean} [deliver] if true, start service when starting a robot
 * @return {void}
 */
Robot.prototype.start = function(deliver) {
	this.run.call(this, this);
	if(deliver && this.service) {
		this.service.start();
	}
	Logger.info('ROBOT', this.name + ' is running');
	return this;
};

/**
 * TODO Halt
 */
Robot.prototype.halt = function() {

};

/**
 * Initializes a service for a robot with a 'service' property.
 *
 * @param {Object} opts object passed to Service constructor
 * @return {void}
 */
Robot.prototype._initService = function(opts) {
	opts.robot = this;
	this.service = new Service(opts);
};

/**
 * Start the service if has one
 *
 * @return {void}
 */
Robot.prototype.serve = function() {
	if (this.service) {
		this.service.start();
	} else {
		throw MError.PropertyMissingError('Robot', 'service', 'robot name: ' + this.name);
	}
};

/**
 * Stop the service if has one
 *
 * @return {void}
 */
Robot.prototype.quit = function() {
	if (this.service) {
		this.service.close();
	}
};