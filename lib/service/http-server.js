/**
 * HttpServer belongs to a service that support 'http' protocol, listening to service clients' requests
 *
 */
var Router = require('./router'),
	MErrors = require('../errors'),
	Logger = require('../logger'),
	http = require('http'),
	url = require('url');
	_ = require('lodash');

/**
 * HttpServer class
 * @constructor HttpServer
 * @param {Object} [opts] http server options
 * @param {String} [opts.port] port to listen client requests
 * @param {Object} [service] the service this server belongs to
 * @return {HttpServer} new HttpService instance
 */
var HttpServer = module.exports = function HttpServer(opts, service) {
	var that = this;
	this.service = service;
	this.port = opts.port;
	this.router = this._initRouter(opts);
	this.server = http.createServer(function(req, res) {
		var content;
		try {
			content = {
				status: "SUCCESS",
				result: that.router.route(url.parse(req.url).pathname, that.service)
			};
		} catch(err) {
			content = {
				status: "FAIL",
				detail: err.toString()
			};
		}
		res.writeHead(200, {'Content-Type': "text/plain"});
		content = content ? content : {};
		res.write(JSON.stringify(content));
		res.end();
	});

};

/**
 * [PRIVATE] Initializes router
 * @return {void}
 */
HttpServer.prototype._initRouter = function(opts) {
	var routes = {};
	_.forEach(opts, function(value, key) {
		if (typeof value === 'function') {
			routes[key] = value;
		}
	});
	return new Router(routes);
};

/**
 * Start the service class
 * @return {void}
 */
HttpServer.prototype.start = function() {
	this.server.listen(this.port);
	this.server.on('error', function(err) {
		throw err;
	});
	Logger.info('SERVICE', 'new http service start: ' + this.service.name);
};

/**
 * Close the service class
 * @return {void}
 */
HttpServer.prototype.close = function() {
	this.server.close();
};