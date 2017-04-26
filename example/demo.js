let Microbot = require('../index.js');

let Thermometer = Microbot.robot({
	name: 'Thermometer Robot',
	devices: {
		sensor: {
			// 为了测试driver用的stub,实际跑的时候配成temperature-sensor
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
			// 调用publish接口就是发布服务了，这要求服务是配置成mqtt协议
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
		// 这样配一下就好了
		protocol: 'mqtt',
		broker: {
			host: '127.0.0.1'
		}
	}
}).start();

let SignalLight = Microbot.robot({
	name: 'Signal Light',
	connections: {
		arduino: {
			adaptor: 'stub',
			port: 'COM3'
		}
	},
	devices: {
		rgb_led: {
			driver: 'stub',
			connection: 'arduino',
			pin: 13
		}
	},
	run: function() {
		// 调用subscribe订阅服务
		this.service.subscribe({broker: '127.0.0.1', topic:'/temperature'}, (err, data) => {
			if (!err) {
				// 具体的led行为逻辑在这里写
				if(data.temperature < 20) {
					this.rgb_led.setRGB('00ff00');
				} else {
					this.rgb_led.setRGB('ff0000');
				}
			} else {
				console.log(err);
			}
		});
	},
	sayHi: function(name) {
		return "Hi " + name + ", I am Signal Light!";
	},
	service: {
		name: "Signal Light's Service",
		port: 1002,
		protocol: "http",
		// 这里配一下subport的值就可以调用subscribe方法订阅服务
		subport: 1010,
		// 访问 http://localhost:1002/hello/name/yourname 调用API hello
		hello: function(name) {
			return this.robot.sayHi(name);
		}
	}
}).start();