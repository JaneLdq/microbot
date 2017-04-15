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
	Broker = require('./proxy/broker'),
	http = require('http'),
	Tools = require('./tools'),
	express = require('express'),
	path = require('path'),
	Logger = require('./logger');

const messageProxy = new MessageProxy(),
	broker = new Broker();

let robots = [],
	services = [];

let master = module.exports = {

	createRobot: function(opts) {
		let robot = new Robot(opts);
		robots.push(robot);
		if(robot.service) {
			services.push(robot.service);
		}
		return robot;
	},

	start: function() {
		messageProxy.start();
		broker.start();
		this.monitor();
	},

	monitor: function(port = 8080) {
		let app = express();
		app.set('view engine', 'pug');
		app.set('views', path.join(__dirname + '/view'));
		app.engine('pug', require('pug').__express);
		app.use(express.static(path.join(__dirname + '/public')));
		app.get('/', (req,res) => {
			res.render('index', {
				robots: Tools.listToJSON(robots),
				services: Tools.listToJSON(services)
			});
		});

		let server = http.createServer(app).listen(port);
		Logger.info('Master', 'You can access http://localhost:8080 to get running information of robots and services');
	}
};

master.start();