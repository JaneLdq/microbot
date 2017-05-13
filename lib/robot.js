/**
 * A robot is consist of one or more components connected to one or more platforms
 *
 * TODO
 *
 */
const EventEmitter = require('events').EventEmitter,
	Service = require('./service/service'),
	SocketIO= require('./socketio/api'),
	Logger = require('./logger'),
	MError = require('./errors'),
	Tools = require('./tools'),
	Factory = require('./factory'),
	_ = require('lodash');

let ROBOT_ID = 1;

/**
 * Robot class
 *
 * @constructor Robot
 * @param {Object} [opts] robot options
 * @param {String} [opts.name] the robot's name
 * @param {Object} [opts.connections] object containing connection info for the Robot
 * @param {Object} [opts.devices] object containing device information for the Robot
 * @param {Object} [opts.sevice] the service the robot published
 * @param {Function} [opts.run] the main thread while the robot is running
 * @returns {Robot} new Robot instance
 */
const Robot = module.exports = class Robot extends EventEmitter {

	constructor(opts) {
		super();
		opts = opts || {};
		opts.name = opts.name || "Robot " + ROBOT_ID++;
		this.connections = {};
		this.devices = {};
		// initialize connections
		_.forEach(opts.connections, (conn, key) => {
			conn.name = conn.name || key;
			if (conn.devices) {
				opts.devices = opts.devices || {};
				_.forEach(conn.devices, (dev, d) => {
					dev.connection = conn.name;
					opts.devices[d] = dev;
				});
				delete conn.devices;
			}
			this.connection(conn);
		});
		// initialize devices
		_.forEach(opts.devices, (dev, key) => {
			dev.name = dev.name || key;
			this.device(dev);
		});

		// assign robot's other options
		_.forEach(opts, (value, key) => {
			if (!this[key]) {
				this[key] = value;
			}
		});
		if (!this.run) {
			this.run = function() {
				console.log("No run job yet");
			};
		}
		// init service
		if (opts.service) {
			opts.service.robot = this;
			this.service = new Service(opts.service);
		}

		//init socketio
		// if (opts.socketio) {
		// 	opts.socketio.mcp = this;
		// 	this.socketio = new SocketIO(opts.socketio);
		// }
	}

	/**
	 * Initialize a connection
	 * @param {Object} [opts] connection options for initialization
	 * @return {Object} the robot
	 */
	connection(opts) {
		opts.robot = this;
		if (this.connections[opts.name]) {
			let oldName = opts.name;
			let newName = Tools.uniqueName(opts.name, Object.keys(this.connections));
			opts.name = newName;
			Logger.warn('Connection\'s name must be unique. Rename connection [' + oldName + '] to new name [' + newName + ']');
		}
		this.connections[opts.name] = Factory.adaptor(opts);
		return this;
	}

	/**
	 * Initialize a device
	 * @param {Object} [opts] device options for initialization
	 * @return {Object} the robot
	 */
	device(opts) {
		opts.robot = this;
		if (this.devices[opts.name]) {
			let oldName = opts.name;
			let newName = Tools.uniqueName(opts.name, Object.keys(this.devices));
			opts.name = newName;
			Logger.warn('Device\'s name must be unique. Rename device [' + oldName + '] to new name [' + newName + ']');
		}
		if (_.isString(opts.connection)){
			let conn = this.connections[opts.connection];
			if (!conn) {
				Logger.error('Required connection ' + opts.connection + ' not found for device named "' + opts.name + '".');
				process.emit("SIGINT");
			}
			opts.connection = conn;
		} else {
			_.forEach(this.connection, (conn) => {
				opts.connection = conn;
				return;
			});
		}
		this.devices[opts.name] = Factory.driver(opts);
		return this;
	}

	/**
	 * Start a robot
	 *
	 * @return {void}
	 */
	start() {
		// connect to connections
		let connectionPromise = new Promise((resolve, reject) => {
			let count = _.size(this.connections);
			if (count === 0) {
				resolve();
			}
			_.forEach(this.connections, (conn) => {
				conn.connect((err) => {
					if (!err) {
						Logger.info('ROBOT', this.name + ' connected to connection ' + conn.name);
						this[conn.name] = conn;
						count--;
						if(count === 0) {
							resolve();
						}
					} else {
						reject(err);
					}
				});
			});
		});

		connectionPromise.then(() => {
			// start devices
			let devicePromise = new Promise((resolve, reject) => {
				let count = _.size(this.devices);
				if (count === 0) {
					resolve();
				}
				_.forEach(this.devices, (dev) => {
					dev.start((err) => {
						if (!err) {
							Logger.info('ROBOT', this.name + ' starts device ' + dev.name);
							this[dev.name] = dev;
							count--;
							if (count === 0) {
								resolve();
							}
						} else {
							reject(err);
						}
					});
				});
			});

			// initial connections and devices completed
			devicePromise.then(() => {
				if (this.service) {
					this.service.start();
				}
				this.run.call(this, this);
				Logger.info('ROBOT', this.name + ' is running');
			}, (err, dev) => {
				Logger.error('Error happend when starting device, see details below');
				console.log(err);
				process.exit(1);
			});
		}, (err) => {
			Logger.error('Error happend when connecting adaptor, see datails below:');
			console.log(err);
			process.exit(1);
		});

		return this;
	}

	/**
	 * TODO halt
	 */
	halt() {

	}

	/**
	 * Start the service if has one
	 *
	 * @return {void}
	 */
	// serve() {
	// 	if (this.service) {
	// 		this.service.start();
	// 	} else {
	// 		throw MError.PropertyMissingError('Robot', 'service', 'robot name: ' + this.name);
	// 	}
	// }

	/**
	 * Stop the service if has one
	 *
	 * @return {void}
	 */
	quit() {
		if (this.service) {
			this.service.close();
		}
	}

	toJSON() {
		let fnConnectionWithDevs = (conns, devs) => {
			let connList = Tools.listToJSON(conns);
			_.forEach(devs, (dev) => {
				_.forEach(connList, (conn) => {
					if (conn.name == dev.connection.name){
						if (!conn.devices) {
							conn.devices = [];
						}
						conn.devices.push(dev.toJSON());
						return;
					}
				});
			});
			return connList;
		};
		let obj = {
			name: this.name,
			connections: fnConnectionWithDevs(this.connections, this.devices),
			devices: Tools.listToJSON(this.devices)
		};
		return obj;
	}
};
