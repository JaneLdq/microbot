/**
 * A MQTT broker, implemented by *mosca*
 *
 */
const mqtt = require('mqtt'),
	mosca = require('mosca'),
	BrokerConfig = require('../config'),
	Logger = require('../logger');

/**
 * Broker class
 * @constructor Borker
 * @return {Broker} new Broker instance
 */
const Broker = module.exports = class Broker {
	constructor() {
		this.name = 'Borker';
		let settings = {
			type: 'mqtt',
			json: false,
			mqtt: mqtt,
			host: BrokerConfig.host,
			port: BrokerConfig.port
		};
		this.settings = settings;
	}

	start() {
		let broker = new mosca.Server(this.settings);
		broker.on('ready', () => {
			Logger.info(this.name, 'is ready');
		});
		broker.on('clientConnected', (client) => {
			Logger.info(this.name, 'new client connected: ' + client.id);
		});
		this.broker = broker;
	}
};