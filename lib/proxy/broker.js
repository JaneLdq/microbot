/**
 * A MQTT broker, implemented by *mosca*
 *
 */
var mqtt = require('mqtt'),
	mosca = require('mosca'),
	BrokerConfig = require('../config'),
	Logger = require('../logger');

/**
 * Broker class
 * @constructor Borker
 * @return {Broker} new Broker instance
 */
var Broker = module.exports = function Broker() {
	var name = 'Borker';
	var settings = {
		type: 'mqtt',
		json: false,
		mqtt: mqtt,
		host: BrokerConfig.host,
		port: BrokerConfig.port
	};
	var broker = new mosca.Server(this.settings);	
	broker.on('ready', function() {
		Logger.info(name, 'is ready');
	});
	broker.on('clientConnected', function(client) {
		Logger.info(name, 'new client connected: ' + client.id);
	});
	this.broker = broker;
};