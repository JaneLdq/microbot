/**
 * A service is consist of one or more robots
 *
 */
var EventEmitter = require('events').EventEmitter,
	MessageProxy = require('../config').MessageProxy,
	Utils = require('../utils'),
	http = require('http'),
	qs = require('querystring');

/**
 * Server class
 *
 * @constructor Server
 * @param {Object} [opts] service options
 * @param {String} [opts.name] the service's name
 * @param {String} [opts.port] port to listen client requests
 * @param {String} [opts.protocol=http] communicate protocol, now support only 'http' and 'mqtt'
 * @param {Number} [opts.subport] optional, port to listen published mqtt messages
 * @param {Function} [opts.broker] optional, host of mqtt borker, if protocol == 'mqtt', then borker is needed
 * @param {Robot[]} [opts.robots] robots the service can access
 * @param {Robot} [opts.robot] the only one robot the service can access
 * @return {Service} new Service instance
 */
var Service = module.exports = function Service(opts) {
	var that = this;
	opts = opts || {};

	// TODO service option values validation
	Utils.serviceValidate(opts);

	this.name = opts.name || 'Service Unknown';
	this.port = Utils.checkPort(opts.port) ? opts.port : Utils.getFreePort();
	this.robots = opts.robots || [opts.robot];
	this.robot = opts.robot || opts.robots[0];

	this.protocol = opts.protocol ||  "http";
	if(this.protocol === "mqtt") {
		this.broker = opts.broker;
	}
	this.robots = opts.robots;

	var req = './' + this.protocol + '-server';
	var Server = require(req);
	this.server = new Server(opts, this);
	// mqtt notification listener
	if (opts.subport)  {
		this.subport = opts.subport;
		this.listener = http.createServer(function(req, res) {
			var postData = "";
			req.on('data', function(chunk) {
				postData += chunk;
			});
			req.on('end', function(res) {
				var data = JSON.parse(postData);
				that.emit(data.topic, JSON.parse(data.message));
			});
			res.writeHead(200);
			res.end();

		}).listen(opts.subport);
	}
};

Utils.inherits(Service, EventEmitter);

/**
 * Start the service
 * @return {void}
 */
Service.prototype.start = function() {
	this.server.start();
};

/**
 * Close the service
 * @return {void}
 */
Service.prototype.close = function() {
	this.server.close();
};

/**
 * Publish a MQTT service
 * @param {Object} [message] message to publish
 * @param {String} [message.topic] topic the message belongs to
 * @param {String} [message.payload] content of the message
 * @param {Number} [message.qos] QoS level, Number, default 0
 * @param {Boolean} [message.retain] retain flag, Boolean, default false
 * @param {Function} [callback] function (err), fired when the QoS handling completes, or at the next tick if QoS 0. An error occurs if client is disconnecting
 * @return {void}
 */
Service.prototype.publish = function(message, callback) {
	if (this.protocol === "mqtt") {
		this.server.publish(message, callback);
	} else {
		console.log("[WARNING] Non mqtt-based service doesn't support 'publish' interface.");
	}
};

/**
 * Subscribe a MQTT service
 * @param {String} [broker] host of mqtt broker to connect
 * @param {String} [topic] topic to subscibe
 * @param {Function} [callback] callback funtion when get a message
 * @param {Function} [errorHandler] callback function when subscribe failed
 * @return {Object} the service instance
 */
Service.prototype.subscribe = function(topic, callback, errorHandler) {
	this.on(topic, callback);
	this._callProxy('mqtt', null, {topic: topic, port: this.subport}, errorHandler);
	return this;	
};

/**
 * Reqeust a HTTP service
 * @param {String} [uri] path of the api
 * @param {Object} [params] ordered parameters(key-value pairs) of the api
 * @param {Function} [callback] callback function when get the response
 * @param {Function} [errorHandler] callback function when request failed
 * @return {Object} the service instance
 */
Service.prototype.request = function(uri, params, callback, errorHandler) {
	this._callProxy('http', uri, params, callback, errorHandler);
	return this;
};

/**
 * [PRIVATE] call the message proxy for subscribe/request action
 * @param {String} [protocol] communicate protocol to use, 'http' or 'mqtt'
 * @param {String} [uri] if protocol is 'http', uri is the path ot the api.
 * @param {Object} [message] if protocol is 'http', message is the params of api, 
 * 		otherwise is a Object with properties below
 * @param {String} [message.topic] topic ot subscribe
 * @param {String} [message.port] port for message proxy to send message back to subscriber when a message is published
 * @param {Function} [callback] callback function for 'http' request when get the response
 * @param {Function} [errorHandler] callback function when request to proxy failed
 */
Service.prototype._callProxy = function(protocol, uri, message, callback, errorHandler) {
	var that = this;
	var options = {
		host: MessageProxy.host,
		port: MessageProxy.port,
		path: '/',
		method: 'POST'
	};
	var postData = {
		protocol: protocol,
		uri: uri,
		message: JSON.stringify(message)
	};
	var content = qs.stringify(postData);

	var req = http.request(options, function(res) {
		res.setEncoding('utf-8');
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			var result = null;
			if (res.statusCode != 204) {
				result = JSON.parse(data);
			}
			if (callback) callback(result);
		});
	});
	req.on('error', function(err) {
		if (errorHandler) {
			errorHandler(err);
		}
		console.log('[ERROR] service request error happened!');
	});
	req.write(content);
	req.end();
};