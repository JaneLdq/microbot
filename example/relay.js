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
  },
  connections: {
    arduino_A: {
      adaptor: 'arduino',
      port: '/dev/cu.usbmodem1421'
    }
  },
  run: function() {

    setInterval(() => {
      this.relay.toggle();
    }, 1000);

  }
}).start();
