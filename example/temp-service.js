let Microbot = require('../index.js');

let Temp = Microbot.robot({
	name: 'Temp Robot',
	devices: {
		sensor: {
			driver: 'stub', 
			connection: 'arduino', 
			pin: 0
		}
	},
	connections: {
		arduino: {
			// 理由同上
			adaptor: 'stub', 
			port: 'COM4'
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