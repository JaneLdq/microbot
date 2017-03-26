let Microbot = require('../index.js');

let mike = Microbot.robot({
	name: "Mike",
	// devices和connections的实现参考cylon,
	// robot开启之后的业务逻辑, run为保留函数名（等同于cylon的work)
	devices: {
		stub: {driver: 'stub', connection: 'stuba'}
	},
	connections: {
		stub: {adaptor: 'stub'}
	},
	run: function() {
		setInterval(() =>{
			console.log("I am Mike!");
		}, 30000);
		this.service.subscribe('/tom', (err, data) => {
			if (!err) {
				console.log("Mike gets from topic '/tom': '" + data.msg + " " + data.question +"'");
			} else {
				console.log(err);
			}
		});
	}, 
	// 其余的函数类型的属性是robot可以提供的功能，供service调用
	getTemperature: function() {
		return Math.random(0,1).toFixed(2);
	},
	getHumidity: function() {
		return Math.random(0,1).toFixed(2);
	},
	// 暂时只考虑一个service对应一个robot的情况，那么就可以定义robot的时候定义service，
	// 这样对用户比较省事，但是框架的实现会复杂一点
	service: {
		port: 3001,
		protocol: "http",
		subport: 3002,
		// broker属性可选，只有protocol属性是mqtt时才需要
		// broker: 'mqtt://test.mosquitto.org',
		// service属性内的函数发布为API，函数到路由的映射考虑在router中完成
		getTH: function() {
			// 通过this.robots可以访问到service下的所有robot
			let mike = this.robot;
			return [mike.getTemperature(), mike.getHumidity()];
		},
		getId: function(name) {
			return {
				name: name,
				id: Math.floor((Math.random(0,1) * 10000))
			};
		},
		callJohn: function() {
			this.request("127.0.0.1:1001/hello", { name: "Mike" }, 
				(err, data) => {
					if (!err) {
						console.log("Response from John: " + JSON.stringify(data));
					}
				});
		}
	}
	// true参数表示是否在robot启动时同时发布服务，若不设置参数
	// robot.start()，则之后可以调用robot.serve()启动服务
}).start(true);

// robot2
let john = Microbot.robot({
	name: "John",
	connections: {},
	devices: {},
	run: function() {
		this.service.subscribe('/jerry', (err, data) => {
			if (!err) {
				console.log("John gets from topic '/jerry': '" + data.msg + " " + data.else +"'");
			} else {
				console.log(err);
			}
		});
		this.service.subscribe('/tom', (err, data) => {
			if (!err) {
				console.log("John gets from topic '/tom': '" + data.msg + " " + data.question +"'");
			} else {
				console.log(err);
			}
		});
	},
	sayHi: function(name) {
		return "Hi " + name + ", I am John!";
	},
	service: {
		name: "John's Service",
		port: 1001,
		protocol: "http",
		subport: 1010,
		hello: function(name) {
			let john = this.robot;
			return john.sayHi(name);
		},
	}
});

john.start(true);

let tom = Microbot.robot({
	name: "Tom",
	device: {},
	connection: {},
	run: function() {
		setInterval(() => {
			// 如果是mqtt协议的服务，则可以通过在run中使用this.service获取服务发布消息
			this.service.publish({
				topic: '/tom', 
				payload: { msg: 'I am Tom', question: 'Have you ever seen Jerry?'}
			});
		}, 10000);
	},
	service: {
		name: "Tom's Service",
		protocol: "mqtt",
		broker: '127.0.0.1'
	}
}).start(true);

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
		}, 15000);
	},
	service: {
		name: "Jerry's Service",
		protocol: "mqtt",
		broker: '127.0.0.1'
	}
}).start(true);