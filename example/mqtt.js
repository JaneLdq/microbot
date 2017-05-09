let Microbot = require('../index.js');

let sam = Microbot.robot({
	name: "Sam",
	devices: {
		led: {driver: 'led', connection: 'arduino', pin: 9}
	},
	connections: {
		arduino: {adaptor: 'arduino', port: 'COM4'}
	},
	run: function() {
		this.service.subscribe({broker: '127.0.0.1', topic:'/jerry'}, (err, data) => {
			if (!err) {
				console.log("Sam gets from topic '/jerry': '" + data.msg + " " + data.else +"'");
				this.led.blink(500);
			}
		});
	},
	service: {
		name: "Sam's Service",
		port: 1002,
		subport: 1010
	}
}).start();

let jerry = Microbot.robot({
	name: "Jerry",
	device: {},
	connection: {},
	run: function() {
		setInterval(() => {
			this.service.publish({
				topic: '/jerry', 
				payload: { msg: 'I am Jerry', else: 'Nice to meet you!'}
			});
		}, 3000);
	},
	service: {
		name: "Jerry's Service",
		protocol: "mqtt",
		broker: {
			host: '127.0.0.1'
		}
	}
}).start();