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
	qs = require('querystring'),
	rp = require('request-promise-native'),
	_ = require('lodash');

var running = false;

var MessageProxy = module.exports = function MessageProxy (opts) {

	var that = this;


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
				that._mqttHandler(res, data);
			}
		});
	});
};

MessageProxy.prototype._httpHandler = function(res, data) {
	var uri = 'http://' + data.api,
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

MessageProxy.prototype._mqttHandler = function(res, data) {

};

MessageProxy.prototype.start = function(port) {
	if (!running) {
		port = port || "9090";
		this.server.listen(port);
		running = true;
	}
};