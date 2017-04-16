let Microbot = require('../index.js');

let mike = Microbot.robot({
	name: "Mike",
	devices: {
		led: {driver: 'led', connection: 'arduino', pin: 4}
	},
	connections: {
		arduino: {adaptor: 'arduino', port: 'COM4'}
	},
	run: function() {
		setInterval(() => {
			this.led.toggle();
		}, 2000);
	}
}).start();