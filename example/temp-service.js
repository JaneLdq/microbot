let Microbot = require('../index.js');

let Temp = Microbot.robot({
	name: 'Temp Robot',
	devices: {
		sensor: {
			driver: 'temperature-sensor',
			connection: 'arduino',
			pin: 1
		}
	},
	connections: {
		arduino: {
			// 理由同上
			adaptor: 'arduino',
			port: '/dev/cu.usbmodem1421'
		}
	},
	run: function() {
		setInterval(() => {
			let temp = this.sensor.celsius();
			this.service.publish({
				topic: '/temperature',
				payload: {
					temperature: temp
				}
			});
		}, 5000);

	},
	service: {
		name: 'Temperature Service',
		protocol: 'mqtt',
		broker: {
			host: '127.0.0.1'
		}
	}
}).start();
