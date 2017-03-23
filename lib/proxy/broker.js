/**
 * A MQTT broker, implemented by *mosca*
 *
 */
let mqtt = require('mqtt'),
	mosca = require('mosca'),
	BrokerConfig = require('../config'),
	Logger = require('../logger');

/**
 * Broker class
 * @constructor Borker
 * @return {Broker} new Broker instance
 */
let Broker = module.exports = class Broker {
	constructor() {
		let name = 'Borker';
		let settings = {
			type: 'mqtt',
			json: false,
			mqtt: mqtt,
			host: BrokerConfig.host,
			port: BrokerConfig.port
		};
		let broker = new mosca.Server(this.settings);	
		broker.on('ready', () => {
			Logger.info(name, 'is ready');
		});
		broker.on('clientConnected', (client) => {
			Logger.info(name, 'new client connected: ' + client.id);
		});
		this.broker = broker;
	}
};