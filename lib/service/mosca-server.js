var mqtt = require('mqtt');
var mosca = require('mosca');

var Server = module.exports = function Server(opts, service) {

	this.service = service;
	this.opts = opts;
	this.settings = {
		type: 'mqtt',
		json: false,
		mqtt: mqtt,
		host: '127.0.0.1',
		port: opts.port
	};
};

Server.prototype.publish = function(message, callback) {
	this.server.publish(message, callback);
};

Server.prototype.start = function() {
	this.server = new mosca.Server(this.settings);
	this.server.on('ready', function() {
		console.log("Mosca server is up and running...");
	});
	this.server.on('published', function(packet, client) {
		console.log('Published', packet.topic, packet.payload);
	});
	this.server.on('clientConnected', function(client) {
    	console.log('client connected', client.id);
	});
};

Server.prototype.close = function() {
	this.server.close();
};