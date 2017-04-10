let Microbot = require('../index.js');

let mike = Microbot.robot({
	name: "Mike",
	devices: {
		stubDev1: {driver: 'stub', connection: 'stub', version: '2.1.3'},
		stubDev2: {driver: 'stub', connection: 'stub', version: '2.1.3'}
	},
	connections: {
		stub: {adaptor: 'stub', port: 'COM3', version: '0.0.1', desc: 'this is a stub connection'}
	},
	run: function() {
		setInterval(() =>{
			console.log("I am Mike!");
		}, 30000);
	},
	service: {
		port: 3001,
		protocol: "http",
		subport: 3002,
		getTH: function() {
			let mike = this.robot;
			return [mike.getTemperature(), mike.getHumidity()];
		},
		getId: function(name) {
			return {
				name: name,
				id: Math.floor((Math.random(0,1) * 10000))
			};
		}
	}
}).start();