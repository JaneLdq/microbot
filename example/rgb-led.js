//
// Cylon.robot({
//   connections: {
//     edison: { adaptor: 'intel-iot' }
//   },
//
//   devices: {
//     leds: { driver: 'rgb-led', redPin: 3, greenPin: 5, bluePin: 6 },
//   },
//
//   work: function(my) {
//     var color;
//     every((1).second(), function() {
//       if (color == "ff0000") {
//         color = "00ff00"
//       } else
//       {
//         color = "ff0000"
//       };
//       my.leds.setRGB(color);
//     });
//   }
// }).start();


let Microbot = require('../index.js');

let mike = Microbot.robot({
	name: "Mike",
	devices: {
		led_1: {driver: 'rgb-led', connection: 'arduino_A', redPin:11,greenPin:12,bluePin:13},
		// led_2: {driver: 'led', connection: 'arduino_B', pin: 10}
		// button: {driver: 'button', connection: 'arduino_A', pin: 2}
	},
	connections: {
		// arduino_A: {adaptor: 'arduino', port: 'COM3'}
		arduino_A: {adaptor: 'arduino', port: '/dev/cu.usbmodem1421'}
		// arduino_B: {adaptor: 'arduino', port: 'COM3'}
	},
	run: function() {
		// setInterval(() => {
		// 	this.led_1.toggle();
		// }, 2000);
		// setInterval(() => {
		// 	this.led_2.toggle();
		// }, 1000);

    var color;
    setInterval(()=>{
      if (color == "ff0000") {
        color = "00ff00"
      } else
      {
        color = "ff0000"
      };
      this.led_1.setRGB(color);
    },1000);

    //
    //
		// this.button.on('push', ()=> {
		// 	 console.log('push');
		// 	 this.led_1.turnOn();
		// });
		// this.button.on('release', ()=> {
		// 	 console.log('release');
		// 	 this.led_1.turnOff();
		// });
	}
}).start();
