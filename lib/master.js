/**
 * Master is in charge of setting up, creating robots and services
 * 
 * TODO
 *
 */
var EventEmitter = require("events").EventEmitter;

var Robot = require("./robot"),
	Service = require("./service/service"),
	MessageProxy = require('./proxy/message-proxy');

var master = module.exports = new EventEmitter();

master.robots = {};
master.serivces = {};
master.events = [ "robot_added", "robot_removed", "service_added", "service_removed"];

master.createRobot = function createRobot(opts) {
	var robot = new Robot(opts);
	// TODO create robot
	master.emit("robot_added", robot.name);
	return robot;
};

master.createService = function createService() {
	var service = new Service();
	// TODO create service
	master.emit("service_added", service.name, service.port);
	return service;
};

var proxy = new MessageProxy();
proxy.start();

