/**
 * A service is consist of one or more robots
 * 
 * TODO
 * 
 */
var EventEmitter = require('events').EventEmitter,
	Utils = require('../utils'),
	http = require('http'),
	qs = require('querystring');

var Server;

var Service = module.exports = function Service(opts) {
	opts = opts || {};

	Utils.serviceValidate(opts);

	this.name = opts.name || 'Service Unknown';
	this.port = Utils.checkPort(opts.port) ? opts.port : Utils.getFreePort();
	this.robots = opts.robots;
	this.robot = opts.robot;
	this.protocol = opts.protocol ||  "http";
	if(this.protocol === "mqtt") {
		this.broker = opts.broker;
	}
	this.robots = opts.robots;

	var req = './' + this.protocol + '-server';
	Server = require(req);
	this.server = new Server(opts, this);
};

Utils.inherits(Service, EventEmitter);

Service.prototype.publish = function() {
	this.server.start();
};

Service.prototype.close = function() {
	this.server.close();
};

/**
 * For HTTP service request
 */
Service.prototype.request = function(method, api, message, callback) {
	var options = {
		host: '127.0.0.1',
		port: 9090,
		path: '/',
		method: 'POST'
	};
	var postData = {
		method: method,
		api: api,
		message: message ? message : "",
		protocol: "http"
	};

	var content = qs.stringify(postData);

	var req = http.request(options, function(res) {
		res.setEncoding('utf-8');
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			callback(JSON.parse(data));
		});
	});
	req.on('error', function(err) {
		console.log(err);
	});
	req.write(content);
	req.end();
};

/**
 * For MQTT service subscribe
 */
Service.prototype.subscribe = function() {
	// TODO
};