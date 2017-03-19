var mqtt = require('mqtt');

var Server = module.exports = function Server(opts, service) {

	this.service = service;
	this.broker = opts.broker || '127.0.0.1';
	this.opts = opts;
};

Server.prototype.publish = function(message, callback) {
	this.server.publish(message.topic, message.payload, message.qos, message.retain, callback);
};

Server.prototype.start = function() {
	var that = this;
	this.server = mqtt.connect('mqtt://' + this.broker);
	this.server.on('connect', function() {
		console.log('[SERVICE] ' + that.service.name + ' is connected to broker');
	});
};

Server.prototype.close = function() {
	this.server.close();
};