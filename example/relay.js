//demo for led and button, use button to control the led
let Microbot = require('../index.js');

let mike = Microbot.robot({
  name: "Mike",
  devices: {
    relay: {
      driver: 'relay',
      connection: 'arduino_A',
      pin: 9
    }
    // led_2: {driver: 'led', connection: 'arduino_B', pin: 10}
    // button: {driver: 'button', connection: 'arduino_A', pin: 2}
  },
  connections: {
    // arduino_A: {adaptor: 'arduino', port: 'COM3'}
    arduino_A: {
      adaptor: 'arduino',
      port: '/dev/cu.usbmodem1421'
    }
    // arduino_B: {adaptor: 'arduino', port: 'COM3'}
  },
  run: function() {
    // setInterval(() => {
    // 	this.led_1.toggle();
    // }, 2000);
    // setInterval(() => {
    // 	this.led_2.toggle();
    // }, 1000);
    setInterval(()=>{
      this.relay.toggle();
    },1000);

  }
}).start();
