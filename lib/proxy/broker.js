var mqtt = require('mqtt');
var mosca = require('mosca');

var Broker = module.exports = function Broker() {

	var settings = {
		type: 'mqtt',
		json: false,
		mqtt: mqtt,
		host: '127.0.0.1',
		port: 1883
	};

	var broker = new mosca.Server(this.settings);	
	broker.on('ready', function() {
		console.log("<BROKER> is ready");
	});
	broker.on('clientConnected', function(client) {
    	console.log('<BROKER> client connected: ', client.id);
	});
};