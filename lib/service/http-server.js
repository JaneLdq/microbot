/**
 * HttpServer belongs to a service that support 'http' protocol, listening to service clients' requests
 *
 */
let Router = require('./router'),
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
let HttpServer = module.exports = class HttpServer {

	constructor(opts, service) {
		this.service = service;
		this.port = opts.port;
		this.router = _initRouter.call(this, opts);
		this.server = http.createServer((req, res) => {
			let content;
			try {
				content = {
					status: "SUCCESS",
					result: this.router.route(url.parse(req.url).pathname, this.service)
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
	}

	/**
	 * Start the service class
	 * @return {void}
	 */
	start() {
		this.server.listen(this.port);
		this.server.on('error', (err) => {
			throw err;
		});
		Logger.info('SERVICE', 'new http service start: ' + this.service.name);
	}


	/**
	 * Close the service class
	 * @return {void}
	 */
	close() {
		this.server.close();
	}

};

/**
 * [PRIVATE] Initializes router
 * @return {void}
 */
function _initRouter(opts) {
	let routes = {};
	_.forEach(opts, (value, key) => {
		if (typeof value === 'function') {
			routes[key] = value;
		}
	});
	return new Router(routes);
};