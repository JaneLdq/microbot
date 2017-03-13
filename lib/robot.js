/**
 * A robot is consist of one or more components connected to one or more platforms
 * 
 * TODO
 *
 */
var EventEmitter = require('events').EventEmitter;
var Utils = require('./utils');
var Service = require('./service');

var ROBOT_ID = 1;

var Robot = module.exports = function Robot(opts) {
	opts = opts || {};
	// TODO robot constructor
	this._initRobot(opts);
};

Utils.inherits(Robot, EventEmitter);

Robot.prototype._initRobot = function(opts) {
	this.name = opts.name || "Robot " + ROBOT_ID++;
	this.service = opts.service;
	this.run = opts.run;

	if (!this.run) {
		this.run = function() {
			console.log("No run job yet.");
		};
	}

};

Robot.prototype._initService = function(opts) {
	opts.robots = [this];
	this.service = new Service(opts);
	this.service.publish();
};

Robot.prototype.start = function(deliver) {
	this.emit('ready', this);

	this.run.call(this, this);

	if(deliver) {
		this._initService(this.service);
	}
	console.log('Robot ' + this.name + " is now running...");
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