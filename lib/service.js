/**
 * A service is consist of one or more robots
 * 
 * TODO
 * 
 */
var EventEmitter = require('events').EventEmitter;
var Utils = require('./utils');

var SERVICE_ID = 1;

var Service = module.exports = function Service(opts) {
	opts = opts || {};
	// TODO service constructor
	this._initService(opts);
};

Utils.inherits(Service, EventEmitter);

Service.prototype._initService = function(opts) {
	this.name = opts.name || "Service " + SERVICE_ID++;
	this.port = Utils.checkPort(opts.port) ? opts.port : Utils.getFreePort();
	this.protocol = opts.protocol || "http";
	this.robots = opts.robots;
	// TODO
};

Service.prototype.publish = function() {
	this.emit('publish', this.name, this.port);
};

Service.prototype.close = function() {
	this.emit('close', this.name);
};