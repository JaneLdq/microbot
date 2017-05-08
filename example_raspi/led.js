//demo for led and button, use button to control the led
let Microbot = require('../index.js');

let bob = Microbot.robot({
	name: "Bob",
	devices: {
		led: {driver: 'led', connection: 'raspberrypi_A', pin:12},   //pin-13 is broken
        button: {driver: 'button', connection: 'raspberrypi_A', pin: 7}
		
	},
	connections: {
		raspberrypi_A: {adaptor: 'raspberrypi',port:'/dev/ttyAMA0'}
		
	},
	run: function() {

		this.button.on('push', ()=> {
			 console.log('push');
			 this.led.turnOn();
		});
		this.button.on('release', ()=> {
			 console.log('release');
			 this.led.turnOff();
		});

/*
		setInterval(() => {
             console.log('test starts led blink');
			this.led.toggle();
		}, 2000);
*/
		 
	}
}).start();
