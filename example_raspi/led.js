//demo for led and button, use button to control the led
let Microbot = require('../index.js');

let mike = Microbot.robot({
	name: "Bob",
	devices: {
		led_1: {driver: 'led', connection: 'raspberrypi_A', pin: 9},
		button: {driver: 'button', connection: 'raspberrypi_A', pin: 2}
	},
	connections: {
		arduino_A: {adaptor: 'raspberrypi', port: '/dev/ttyACM0'}
		
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
