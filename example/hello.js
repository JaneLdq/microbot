var Microbot = require('../index.js');

var robot = Microbot.robot({
	name: "Mike",
	device: {},
	connection: {},
	run: function() {
		setInterval(function() {
			console.log("A");
		}, 1000);
	}, 
	service: {
		name: "Demo Service",
		port: 3001,
		protocol: "http",
		getT: function(location, date) {
			return [7, 15];
		}
	}
}).start(true);