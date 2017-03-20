/**
 * Messaage Proxy is a built-in microservice that ecapsulates 
 * details of protocols (e.g. http and mqtt) and provides unified
 * RESTful interfaces for other services to communicate with each other.
 * 
 */
var MqttBroker = require('../config').MqttBroker,
	ProxyConfig = require('../config').MessageProxy,
	http = require('http'),
	url = require('url'),
	mqtt = require('mqtt'),
	qs = require('querystring'),
	rp = require('request-promise-native'),
	_ = require('lodash');

var running = false;

/**
 * MessageProxy Class
 * @constructor MessageProxy
 * @return {MessageProxy} a new MessageProxy instance
 */
var MessageProxy = module.exports = function MessageProxy () {
	var that = this;
	// this.clients collects mqtt clients that call proxy for subscritions
	this.clients = {};
	// listening for subscribe/request from clients
	this.server = http.createServer(function(req, res) {
		var postData = "";
		req.on('data', function(chunk) {
			postData += chunk;
		});
		req.on('end', function() {
			var data = qs.parse(postData);
			if (data.protocol === 'http') {
				that._httpHandler(res, data);
			} else {
				that._mqttHandler(req, res, data);
			}
		});
	});

	// initialize mqtt agent
	this.mqttAgent = mqtt.connect({
		host: MqttBroker.host,
		port: MqttBroker.port
	});
	this.mqttAgent.on('connect', function() {
		console.log("<MESSAG-PROXY> conencted to broker");
	});
	this.mqttAgent.on('message', function(topic, message) {
		that._notifyClient(topic, message);
	});
};

/**
 * handle REST GET service request
 * @param {Response} [res] http response
 * @param {Object} [data] http service request content
 * @param {String} [data.uri] uri of rest api
 * @param {Object} [data.message] key-value pairs of the api's parameters
 * @return {void}
 */
MessageProxy.prototype._httpHandler = function(res, data) {
	var uri = 'http://' + data.uri,
		msg = JSON.parse(data.message);
	var fnGETOptions = function(uri, msg) {
		_.forEach(msg, function(value, key) {
			uri += '\/' + key + '\/' + value;
		});
		return {method: "GET", uri: uri};
	}

	var opts = fnGETOptions(uri, msg);
	rp(opts)
		.then(function (parsedBody) {
			res.writeHead(200, {'Content-Type': "text/plain"});
			res.write(parsedBody);
			res.end();
		})
		.catch(function (err) {
			// if request fails, set response status 404 and send back the error
			res.writeHead(404);
			res.write(JSON.stringify({code: "ERROR", error: err.error}));
			res.end();
		});
};

/**
 * handle mqtt service subscribe request
 * @param {HttpRequest} [req] http request
 * @param {HTTPResponse} [res] http response
 * @param {Object} [data] http service request content
 * @param {String} [data.message.port] mqtt client's listen port for published messages
 * @param {String} [data.message.topic] topic the mqtt client want to subscribe
 * @return {void}
 */
MessageProxy.prototype._mqttHandler = function(req, res, data) {
	var that = this;
		client = req.connection.remoteAddress.substring(7);
		msg = JSON.parse(data.message);
	this.mqttAgent.subscribe(msg.topic);
	var clientArr = this.clients[msg.topic] || new Array();
	if (_.indexOf(clientArr, client + ":" + msg.port) == -1) {
		clientArr.push(client + ":" + msg.port);
	}
	if (!this.clients[msg.topic]) {
		this.clients[msg.topic] = clientArr;
	}
	res.writeHead(204);
	res.end();
};

/**
 * Send notification to clients who subscribe a specific topic when get a message from broker
 * @param {String} [topic] topic of the message
 * @param {Buffer} [message] message get from broker
 * @return {void}
 */
MessageProxy.prototype._notifyClient = function(topic, message) {
	var clients = this.clients[topic];
	if (clients) {
		_.forEach(clients, function(value) {
			var opts = {
				host: value.split(':')[0],
				port: value.split(':')[1],
				method: "POST"
			};
			var req = http.request(opts);
			var content = {
				topic: topic,
				message: message.toString('utf-8')
			};
			req.write(JSON.stringify(content));
			req.end();
		});
	}
};

/**
 * Start the proxy
 * @return {void}
 */
MessageProxy.prototype.start = function() {
	if (!running) {
		this.server.listen(ProxyConfig.port);
		running = true;
	}
};