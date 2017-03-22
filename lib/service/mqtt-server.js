/**
 * MqttServer belongs to a service that support 'mqtt' protocol, responsible for publish messages of specific topics
 *
 */
var mqtt = require('mqtt'),
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
var MqttServer = module.exports = function MqttServer(opts, service) {
	this.broker = opts.broker || Broker.host;
	this.service = service;
};

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
MqttServer.prototype.publish = function(message, callback) {
	this.server.publish(message.topic, JSON.stringify(message.payload), message.qos, message.retain, callback);
};

/**
 * Start the server
 * @return {void}
 */
MqttServer.prototype.start = function() {
	var that = this;
	this.server = mqtt.connect('mqtt://' + this.broker);
	this.server.on('connect', function() {
		Logger.info('SERVICE', 'new mqtt client start: ' + that.service.name);
	});
};

/**
 * Close the server
 * @return {void}
 */
MqttServer.prototype.close = function() {
	this.server.close();
};