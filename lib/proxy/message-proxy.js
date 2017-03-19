/**
 * Messaage Proxy is a built-in microservice that ecapsulates 
 * details of protocols (e.g. http and mqtt) and provides unified
 * RESTful interfaces for other services to communicate with each other.
 * 
 * TODO
 * 
 */
var http = require('http'),
	url = require('url'),
	mqtt = require('mqtt'),
	qs = require('querystring'),
	rp = require('request-promise-native'),
	_ = require('lodash');

var running = false;

var MessageProxy = module.exports = function MessageProxy (opts) {

	var that = this;
	this.clients = {};
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

	this.mqttAgent = mqtt.connect({
		host: '127.0.0.1',
		port: 1883
	});
	this.mqttAgent.on('connect', function() {
		console.log("<MESSAG-PROXY> conencted to broker");
	});
	this.mqttAgent.on('message', function(topic, message) {
		that._notifyClient(topic, message);
	});
};

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
			res.writeHead(404);
			res.write(JSON.stringify({code: "ERROR", error: err.error}));
			res.end();
		});
};

MessageProxy.prototype._mqttHandler = function(req, res, data) {
	var that = this;
		client = req.connection.remoteAddress.substring(7);
		msg = JSON.parse(data.message);
	this.mqttAgent.subscribe(msg.topic);
	this.clients[msg.topic] = {
		host: client,
		port: msg.port
	};
	res.writeHead(204);
	res.end();
};

MessageProxy.prototype._notifyClient = function(topic, message) {
	var client = this.clients[topic];
	if (client) {
		var opts = {
			host: client.host,
			port: client.port,
			method: "POST"
		};
		var req = http.request(opts);
		var content = {
			topic: topic,
			message: message.toString('utf-8')
		};
		req.write(JSON.stringify(content));
		req.end();
	}
};

MessageProxy.prototype.start = function(port) {
	if (!running) {
		port = port || "9090";
		this.server.listen(port);
		running = true;
	}
};