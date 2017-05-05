//demo for led and button, use button to control the led
let Microbot = require('../index.js');

let bob = Microbot.robot({
  name: "Bob",
  devices: {
    relay: {
      driver: 'relay',
      connection: 'raspberrypi_A',
      pin: 9
    }
  },
  connections: {
	  raspberrypi_A: {
      adaptor: 'raspberrypi',
      port: '/dev/ttyAMA0'
    }
  },
  run: function() {

    setInterval(() => {
      this.relay.toggle();
    }, 1000);

  }
}).start();
