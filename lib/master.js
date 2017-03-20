/**
 * Master is in charge of setting up, creating robots and services
 * 
 * TODO
 *
 */
var EventEmitter = require("events").EventEmitter;

var Robot = require("./robot"),
	Service = require("./service/service"),
	MessageProxy = require('./proxy/message-proxy'),
	Broker = require('./proxy/broker');

var master = module.exports = new EventEmitter();

master.robots = {};
master.serivces = {};

master.createRobot = function createRobot(opts) {
	var robot = new Robot(opts);
	return robot;
};

master.createService = function createService() {
	var service = new Service();
	return service;
};

var proxy = new MessageProxy();
proxy.start();

var borker = new Broker();
