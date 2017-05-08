//demo for led and button, use button to control the led
let Microbot = require('../index.js');

let mike = Microbot.robot({
  name: "Mike",
  devices: {
    thingie: {
      driver: 'direct-i2c',
      address: 0x08
    }
  },
  connections: {
    arduino: {
      adaptor: 'arduino',
      port: '/dev/cu.usbmodem1421'
    }
  },
  run: function() {
    setInterval(() => {
      this.thingie.write(null, [1, 2, 3, 4, 5], function(err) {
        if (err) {
          console.log(err);
        }
      });
    }, 100);
  }
}).start();
