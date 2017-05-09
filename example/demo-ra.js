let Microbot = require('../index.js');

let SignalRGB = Microbot.robot({
	name: 'Signal RGB',
	connections: {
		raspberrypi: {
			adaptor: 'raspberrypi',
			port: 'COM4'
		}
	},
	devices: {
		rgb_led: {
			driver: 'rgb-led',
			connection: 'raspberrypi',
			redPin: 7,
			greenPin: 12,
			bluePin: 40
		}
	},
	run: function() {
		this.service.subscribe({
			broker: '127.0.0.1',
			topic:'/temperature'}, (err, data) => {
				console.log(data);
				if (!err) {
					if(data.temperature < 25) {
						this.rgb_led.setRGB('00ff00');
					} else if (data.temperature >= 28) {
						this.rgb_led.setRGB('ff0000');
					} else {
						this.rgb_led.setRGB('0000ff');
					}
				}
		});
	},
	sayHi: function(name) {
		return "Hi " + name + ", I am Signal RGB!";
	},
	service: {
		name: "Signal Light's Service",
		port: 8001,
		protocol: "http",
		subport: 8000,
		hello: function(name) {
			return this.robot.sayHi(name);
		}
	}
}).start();

let mike = Microbot.robot({
	name: "Mike",
	devices: {
		sensor: {driver: 'temperature-sensor', connection: 'arduino_A', pin: 1}
	},
	connections: {
		arduino_A: {adaptor: 'arduino', port: '/dev/ttyACM0'}
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
		name: 'Temp Service',
		protocol: 'mqtt',
		broker: {
			host: '127.0.0.1'
		}
	}
}).start();
