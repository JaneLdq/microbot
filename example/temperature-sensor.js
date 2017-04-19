let Microbot = require('../index.js');

let mike = Microbot.robot({
  name: "Mike",
  devices: {
    sensor: {
      driver: 'temperature-sensor',
      connection: 'arduino_A',
      pin: 0
    }
  },
  connections: {
    arduino_A: {
      adaptor: 'arduino',
      port: '/dev/cu.usbmodem1421'
    }
  },
  run: function() {
    var analogValue = 0;

    setInterval(() => {
      analogValue = this.sensor.analogRead();
      this.sensor.celsius();
      voltage = (analogValue * 5.0) / 1024;
      temperature = (voltage - 0.5) * 100;

      console.log('Current Temperature => ', temperature);
    }, 5000);

  }
}).start();
