/**
 * A MQTT broker, implemented by *mosca*
 *
 */
var mqtt = require('mqtt'),
	mosca = require('mosca'),
	BrokerConfig = require('../config');

/**
 * Broker class
 * @constructor Borker
 * @return {Broker} new Broker instance
 */
var Broker = module.exports = function Broker() {
	var settings = {
		type: 'mqtt',
		json: false,
		mqtt: mqtt,
		host: BrokerConfig.host,
		port: BrokerConfig.port
	};
	var broker = new mosca.Server(this.settings);	
	broker.on('ready', function() {
		console.log("<BROKER> is ready");
	});
	broker.on('clientConnected', function(client) {
    	console.log('<BROKER> client connected: ', client.id);
	});
	this.broker = broker;
};