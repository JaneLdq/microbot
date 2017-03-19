/**
 * A service is consist of one or more robots
 * 
 * TODO
 * 
 */
var EventEmitter = require('events').EventEmitter,
	Utils = require('../utils'),
	http = require('http'),
	qs = require('querystring');

var Server;

var Service = module.exports = function Service(opts) {
	var that = this;
	opts = opts || {};

	Utils.serviceValidate(opts);

	this.name = opts.name || 'Service Unknown';
	this.port = Utils.checkPort(opts.port) ? opts.port : Utils.getFreePort();
	this.robots = opts.robots;
	this.robot = opts.robot;
	this.protocol = opts.protocol ||  "http";
	if(this.protocol === "mqtt") {
		this.broker = opts.broker;
	}
	this.robots = opts.robots;

	var req = './' + this.protocol + '-server';
	Server = require(req);
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
				that.emit(data.topic, data.message);
			});
			res.writeHead(200);
			res.end();

		}).listen(opts.subport);
	}
};

Utils.inherits(Service, EventEmitter);

Service.prototype.start = function() {
	this.server.start();
};

Service.prototype.close = function() {
	this.server.close();
};

/**
 * For MQTT service publish
 */
Service.prototype.publish = function(message, callback) {
	if (this.protocol === "mqtt") {
		this.server.publish(message, callback);
	} else {
		throw Error("non mqtt-based service doesn't support 'publish' interface.");
	}
};

/**
 * For MQTT service subscribe
 */
Service.prototype.subscribe = function(uri, topic, callback, errorHandler) {
	this.on(topic, callback);
	this._callProxy('mqtt', uri, {topic: topic, port: this.subport});
	return this;	
};

/**
 * For HTTP service request
 */
Service.prototype.request = function(uri, params, callback, errorHandler) {
	this._callProxy('http', uri, params, callback, errorHandler);
	return this;
};

Service.prototype._callProxy = function(protocol, uri, message, callback, errorHandler) {
	var that = this;
	// TODO proxy config
	var options = {
		host: '127.0.0.1',
		port: 9090,
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
			if (!data) {
				if (callback) callback();
				return;
			}
			var result = JSON.parse(data);
			if (res.statusCode === 404 && result.code === "ERROR")  {
				if(errorHandler) {
					errorHandler(result.error);
				} else {
					console.log("[ERROR] service request error happened: " + result.error);
				}
				return;
			}
			if (callback) callback(result);
		});
	});
	req.on('error', function(err) {
		console.log('[ERROR] service request error happened!');
	});
	req.write(content);
	req.end();
};