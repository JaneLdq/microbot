let Microbot = require('../index.js');

let mike = Microbot.robot({
	name: "Mike",
	devices: {
		led_1: {driver: 'led', connection: 'arduino_A', pin: 9},
		// led_2: {driver: 'led', connection: 'arduino_B', pin: 10}
		button: {driver: 'button', connection: 'arduino_A', pin: 2}
	},
	connections: {
		arduino_A: {adaptor: 'arduino', port: 'COM3'}
		// arduino_B: {adaptor: 'arduino', port: 'COM3'}
	},
	run: function() {
		// setInterval(() => {
		// 	this.led_1.toggle();
		// }, 2000);
		// setInterval(() => {
		// 	this.led_2.toggle();
		// }, 1000);
		this.button.on('push', ()=> {
			 console.log('push');
			 this.led_1.turnOn();
		});
		this.button.on('release', ()=> {
			 console.log('release');
			 this.led_1.turnOff();
		});
	}
}).start();