var Microbot = require('../index.js');

// robot1
var mike = Microbot.robot({
	name: "Mike",
	// device和connection的实现参考cylon
	device: {},
	connection: {},
	// robot开启之后的业务逻辑, run为保留函数名（等同于cylon的work)
	run: function() {
		setInterval(function() {
			console.log("I am Mike!");
		}, 10000);
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
		name: "Mike's Service",
		port: 3001,
		protocol: "http",
		// broker属性可选，只有protocol属性是mqtt时才需要
		// broker: 'mqtt://test.mosquitto.org',
		// service属性内的函数发布为API，函数到路由的映射考虑在router中完成
		getTH: function() {
			// 通过this.robots可以访问到service下的所有robot
			var mike = this.robot;
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
				function(data) {
					console.log("Response from John: " + data);
				}, 
				function(err) {
					console.log("Error: " + JSON.stringify(err));
			});
		}
	}
	// true参数表示是否在robot启动时同时发布服务，若不设置参数
	// robot.start()，则之后可以调用robot.serve()启动服务
}).start(true);

// robot2
var john = Microbot.robot({
	name: "John",
	device: {},
	connection: {},
	run: function() {
		setInterval(function() {
			console.log("I am John!");
		}, 5000);
	},
	sayHi: function(name) {
		return "Hi " + name + ", I am John!";
	},
	service: {
		name: "John's Service",
		port: 1001,
		protocol: "http",
		hello: function(name) {
			var john = this.robot;
			return john.sayHi(name);
		},
	}
});

john.start(true);