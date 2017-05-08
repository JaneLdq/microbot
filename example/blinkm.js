//demo for led and button, use button to control the led
let Microbot = require('../index.js');

let mike = Microbot.robot({
  name: "Mike",
  devices: {
    blinkm: {
      driver: 'blinkm',
      connection: 'arduino'
    }
  },
  connections: {
    arduino: {
      adaptor: 'arduino',
      port: '/dev/cu.usbmodem1421'
    }
  },
  run: function() {
    this.blinkm.stopScript();

    this.blinkm.getFirmware(function(err, version) {
      console.log(err || "started BlinkM version" + version);
    })

    this.blinkm.goToRGB(0, 0, 0);

    this.blinkm.getRGBColor(function(err, data) {
      console.log(err || "starting color: ", data);
    });

    setInterval(() => {
      this.blinkm.getRGBColor(function(err, data) {
        console.log(err || "current color: ", data);
      });
      this.blimkm.fadeToRandomRGB(128, 128, 128);
    }, 2000);
  }
}).start();
