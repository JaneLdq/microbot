/**
 * A service is consist of one or more robots
 *
 */
const EventEmitter = require('events').EventEmitter,
	MessageProxy = require('../config').MessageProxy,
	MErrors = require('../errors'),
	Logger = require('../logger'),
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
let SERVICE_ID = 1;

const Service = module.exports = class Service extends EventEmitter {

	constructor(opts) {
		super();
		opts = opts || {};
		_validate.call(this, opts);

		this.name = opts.name || 'Service ' + SERVICE_ID++;
		this.port = opts.port;

		this.robots = opts.robots || [opts.robot];
		this.robot = opts.robot || opts.robots[0];

		this.protocol = opts.protocol ||  "http";
		this.broker = opts.broker;

		// server factory method
		_initServer.call(this, this.protocol, opts);

		// mqtt notification listener
		if (opts.subport)  {
			this.subport = opts.subport;
			_initMqttListener.call(this, opts.subport);
		}
	}

	/**
	 * Start the service
	 * @return {void}
	 */
	start() {
		try {
			this.server.start();
		} catch(err) {
			console.log(err);
		}
	}

	/**
	 * Close the service
	 * @return {void}
	 */
	close() {
		if (this.server) {
			this.server.close();
		}
	}

	/**
	 * Publish a MQTT service
	 * @param {Object} [message] message to publish
	 * @param {String} [message.topic] topic the message belongs to
	 * @param {String} [message.payload] content of the message
	 * @param {Number} [message.qos] QoS level, Number, default 0
	 * @param {Boolean} [message.retain] retain flag, Boolean, default false
	 * @param {Function} [callback] function (err), fired when the QoS handling completes, or at the next tick if QoS 0. An error occurs if client is disconnecting
	 * @exception {Error} a error occurs if calling method 'publish' with a non mqtt-based service 
	 * @return {void}
	 */
	publish(message, callback) {
		if (this.server.publish) {
			this.server.publish(message, callback);
		} else {
			throw new Error("The service doesn't support 'publish' interface.");
		}
	}

	/**
	 * Subscribe a MQTT service
	 * @param {String} [topic] topic to subscibe
	 * @param {Function} [callback] function (err, data), data is a JSON object contains message, fired when get a message. An Error occurs if sending request to proxy failed, or at a subscription error or an error that occurs when client is disconnecting
	 * @return {Object} the service instance
	 */
	subscribe(topic, callback) {
		this.on(topic, callback);
		_callProxy.call(this, 'mqtt', null, {topic: topic, port: this.subport}, callback);
		return this;	
	}

	/**
	 * Reqeust a HTTP service
	 * @param {String} [uri] path of the api
	 * @param {Object} [params] ordered parameters(key-value pairs) of the api
	 * @param {Function} [callback] function(err, data), fired when get the response. An Error occurs if request failed
	 * @return {Object} the service instance
	 */
	request(uri, params, callback) {
		_callProxy.call(this, 'http', uri, params, callback);
		return this;
	}

};

/**
 * [Private] Initialize a http or mqtt server and assigned to this.server
 * @param {String} [protocol] currently supports 'http' or 'mqtt'
 * @param {Object} [opts] service config options
 * @return {void}
 */
function _initServer(protocol, opts) {
	let Server = require('./' + protocol + '-server');
	this.server = new Server(opts, this);
}

/**
 * [Private] Initialize a httq server to listening mqtt published messages and assigned to this.listener
 * @param {Number} [port] listening port
 * @return {void}
 */
function _initMqttListener(port) {
	this.listener = http.createServer((req, res) => {
		let postData = "";
		req.on('data', (chunk) => {
			postData += chunk;
		});
		req.on('end', (res) => {
			let data = JSON.parse(postData);
			this.emit(data.topic, null, JSON.parse(data.message));
		});
		req.on('error', (err) => {
			this.emit(data.topic, err);
		})
		res.writeHead(204);
		res.end();
	}).listen(port);
};

/**
 * [Private] Call the message proxy for subscribe/request action
 * @param {String} [protocol] communicate protocol to use, 'http' or 'mqtt'
 * @param {String} [uri] if protocol is 'http', uri is the path ot the api.
 * @param {Object} [message] if protocol is 'http', message is the params of api, 
 * 		otherwise is a Object with properties below
 * @param {String} [message.topic] topic ot subscribe
 * @param {String} [message.port] port for message proxy to send message back to subscriber when a message is published
 * @param {Function} [callback] function(err, data), data is a JSON object, fired when get the response from a 'http' request. An Error occurs when request to proxy is failed, or response get from http service is 404, or subscribe a mqtt service failed
 */
function _callProxy(protocol, uri, message, callback) {
	let options = {
		host: MessageProxy.host,
		port: MessageProxy.port,
		path: '/',
		method: 'POST'
	};
	let postData = {
		protocol: protocol,
		uri: uri,
		message: JSON.stringify(message)
	};
	let content = qs.stringify(postData);

	let fnHttpRequestHandler = function(res) {
		res.setEncoding('utf-8');
		let data = '';
		res.on('data', (chunk) => {
			data += chunk;
		});
		res.on('end', () => {
			let result = JSON.parse(data);
			if (callback) callback(null, result);
		});
	};

	let fnMqttRequestHandler = function(res) {
		res.setEncoding('utf-8');
		let data = '';
		res.on('data', (chunk) => {
			data += chunk;
		});
		res.on('end', () => {
			if (res.statusCode === 503) {
				let err = JSON.parse(data);
				if (callback) callback(new Error(err.message));
			}
		});
	};

	let req = protocol === 'http' ? http.request(options, fnHttpRequestHandler) : 
				http.request(options, fnMqttRequestHandler);
	req.on('error', (err) => {
		if (callback) {
			callback(err);
		}
		Logger.error('Proxy sends request to service failed.');
	});
	req.write(content);
	req.end();
};

/**
 * [Private] Validate service options
 */
function _validate(opts) {
	if (!(opts.robots || opts.robot)) {
		throw MErrors.PropertyMissingError('Service', 'robots');
	}
	if (opts.protocol === 'http' && !opts.port) {
		throw new MErrors.PropertyMissingError('Service', 'port', 'HTTP service need a listening port');
	}
	if (opts.protocol === 'mqtt' && !opts.broker) {
		throw new MErrors.PropertyMissingError('Service', 'broker', 'MQTT service need a given broker.');
	}
}