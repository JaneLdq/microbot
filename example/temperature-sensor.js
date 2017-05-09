let Microbot = require('../index.js');

let mike = Microbot.robot({
  name: "Mike",
  devices: {
    sensor: {
      driver: 'temperature-sensor',
      connection: 'arduino_A',
      pin: 1
    }
  },
  connections: {
    arduino_A: {
      adaptor: 'arduino',
      port: '/dev/cu.usbmodem1421'
    }
  },
  run: function() {
    var temperature = 0;

    setInterval(() => {
      temperature = this.sensor.celsius();

      console.log('Current Temperature => ', temperature);
    }, 5000);

  }
}).start();
