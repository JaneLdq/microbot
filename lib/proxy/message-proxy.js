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
	_ = require('lodash');

var MessageProxy = module.exports = function MessageProxy (opts) {

	var that = this;

	this.server = http.createServer(function(req, res, callback) {
		var postData = "";
		req.on('data', function(chunk) {
			postData += chunk;
		});
		req.on('end', function() {
			var params = qs.parse(postData);
			// TODO 转发请求
			var content = "";
			if (params.protocol === 'http') {
				that.request(res, params.method, params.api, params.message, callback);
			} else {
				// TODO mqtt
			}
		});
	});
};

MessageProxy.prototype.start = function(port) {
	port = port || "9090";
	this.server.listen(port);
};

MessageProxy.prototype.request = function(method, api, msg, callback) {
	// TODO
	res.writeHead(200, {'Content-Type': "text/plain"});
	res.write(JSON.stringify(content));
	res.end();
};

MessageProxy.prototype.subscribe = function() {

};