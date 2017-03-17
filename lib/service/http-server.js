/**
 *
 */

var Router = require('./router'),
	http = require('http'),
	url = require('url');
	_ = require('lodash');

var HttpServer = module.exports = function HttpServer(opts, service) {
	var that = this;
	this.service = service;
	this.port = opts.port;
	this.router = this._initRouter(opts);
	this.server = http.createServer(function(req, res) {
		var content = that.router.route(url.parse(req.url).pathname, that.service);
		content = content ? content : {};
		res.writeHead(200, {'Content-Type': "text/plain"});
		res.write(JSON.stringify(content));
		res.end();
	});

};

HttpServer.prototype._initRouter = function(opts) {
	var routes = {};
	_.forEach(opts, function(value, key) {
		if (typeof value === 'function') {
			routes[key] = value;
		}
	});
	return new Router(routes);
};

HttpServer.prototype.start = function() {
	this.server.listen(this.port)
};

HttpServer.prototype.close = function() {
	this.server.close();
};