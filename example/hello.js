var Microbot = require('../index.js');

var robot = Microbot.robot({
	name: "Mike",
	// device和connection的实现参考cylon
	device: {},
	connection: {},
	// robot开启之后的业务逻辑, run为保留函数名（等同于cylon的work)
	run: function(me) {
		setInterval(function() {
			console.log("A");
		}, 1000);
	}, 
	// 其余的函数类型的属性是robot可以提供的功能，供service调用
	getTemperature: function() {
		return 0;
	},
	getHumidity: function() {
		return 0;
	},
	// 暂时只考虑一个service对应一个robot的情况，那么就可以定义robot的时候定义service，
	// 这样对用户比较省事，但是框架的实现会复杂一点
	service: {
		name: "Demo Service",
		port: 3001,
		protocol: "http",
		// service属性内的函数发布为API，函数到路由的映射考虑在router中完成
		getTH: function() {
			// 从service内部如何访问到robot？现在想到的是在创建service时会把所有的robot都存到
			// 一个叫robots的数组中
			var robot = robots['Mike'];
			return [robot.getTemperature(), robot.getHumidity()];
		}
	}
	// true参数表示是否在robot启动时同时发布服务，若不设置参数
	// robot.start()，则之后可以调用robot.serve()启动服务
}).start(true);