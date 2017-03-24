/**
 * MqttServer belongs to a service that support 'mqtt' protocol, responsible for publish messages of specific topics
 *
 */
const mqtt = require('mqtt'),
	MServer = require('./server'),
	Broker = require('../config').MqttBroker,
	Logger = require('../logger');

/**
 * MqttServer class
 * @constructor MqttServer
 * @param {Object} [opts] mqtt server options
 * @param {String} [broker] host of mqtt broker
 * @param {Object} [service] the service this server belongs to
 * @return {MqttServer} new MqttServer instance
 */
const MqttServer = module.exports = class MqttServer extends MServer {
	
	constructor(opts, service) {
		super(service);
		this.broker = opts.broker || Broker.host;
	}

	/**
	 * Publish a message
	 * @param {Ojbect} [message] message need to publish
	 * @param {String} [message.topic] topic of the message
	 * @param {String} [message.payload] content of the message
	 * @param {Number} [message.qos] QoS level, Number, default 0
	 * @param {Boolean} [message.retain] retain flag, Boolean, default false
	 * @param {Function} [callback] callback function when pubished
	 * @return {void}
	 */
	publish(message, callback) {
		if (this.server) {
			this.server.publish(message.topic, JSON.stringify(message.payload), message.qos, message.retain, callback);
		} else {
			throw Error('Mqtt server is not running.');
		}
	}

	/**
	 * Start the server
	 * @return {void}
	 */
	start() {
		this.server = mqtt.connect('mqtt://' + this.broker);
		this.server.on('connect', () => {
			Logger.info('SERVICE', 'new mqtt client start: ' + this.service.name);
		});
	};

	/**
	 * Close the server
	 * @return {void}
	 */
	close() {
		if (this.server) {
			this.server.close();
		}
	}
};
