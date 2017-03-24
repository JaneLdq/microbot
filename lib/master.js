/**
 * Master is in charge of setting up, creating robots and services
 * 
 * TODO
 *
 */
const EventEmitter = require("events").EventEmitter,
	Robot = require("./robot"),
	Service = require("./service/service"),
	MessageProxy = require('./proxy/message-proxy'),
	Broker = require('./proxy/broker');

let master = module.exports = new EventEmitter();

master.robots = {};
master.serivces = {};

master.createRobot = function createRobot(opts) {
	return new Robot(opts);
};

master.createService = function createService(opts) {
	return new Service(opts);
};

new MessageProxy().start();

new Broker();
