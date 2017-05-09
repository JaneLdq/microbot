//demo for led and button, use button to control the led
let Microbot = require('../index.js');

let mike = Microbot.robot({
	name: "Mike",
	devices: {
		led_1: {driver: 'led', connection: 'arduino_A', pin: 9},
		button: {driver: 'button', connection: 'arduino_A', pin: 2}
	},
	connections: {
		arduino_A: {adaptor: 'arduino', port: 'COM4', desc: 'StarDuino UNO'}
	},
	run: function() {
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
