let Microbot = require('../index.js');

let SignalRGB = Microbot.robot({
	name: 'Signal RGB',
	connections: {
		arduino: {
			adaptor: 'arduino',
			port: 'COM4'
		}
	},
	devices: {
		rgb_led: {
			driver: 'rgb-led',
			connection: 'arduino',
			redPin: 9,
			greenPin: 10,
			bluePin: 11
		},
		led_1: {driver: 'led', connection: 'arduino', pin: 7},
		button: {driver: 'button', connection: 'arduino', pin: 2}
	},
	run: function() {
		this.service.subscribe({
			broker: '172.19.132.221',
			// broker: '127.0.0.1',
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
		port: 1002,
		protocol: "http",
		subport: 1010,
		hello: function(name) {
			return this.robot.sayHi(name);
		}
	}
}).start();