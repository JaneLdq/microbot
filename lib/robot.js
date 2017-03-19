/**
 * A robot is consist of one or more components connected to one or more platforms
 * 
 * TODO
 *
 */
var EventEmitter = require('events').EventEmitter,
	Utils = require('./utils'),
	Service = require('./service/service'),
	_ = require('lodash');

var ROBOT_ID = 1;

var Robot = module.exports = function Robot(opts) {
	opts = opts || {};
	// TODO robot constructor
	this._initRobot(opts);
	this._initService(this.service);
};

Utils.inherits(Robot, EventEmitter);

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

Robot.prototype._initService = function(opts) {
	opts.robot = this;
	this.service = new Service(opts);
};

Robot.prototype.start = function(deliver) {
	this.emit('ready', this);

	this.run.call(this, this);

	if(deliver) {
		this.service.start();
	}
	console.log('[ROBOT] ' + this.name + " is running");
	return this;
};

Robot.prototype.stop = function() {

};

Robot.prototype.serve = function() {
	this.service.publish();
};

Robot.prototype.quit = function() {
	this.service.close();
}