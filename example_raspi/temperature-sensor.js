let Microbot = require('../index.js');

let mike = Microbot.robot({
  name: "Bob",
  devices: {
    sensor: {
      driver: 'temperature-sensor',
      connection: 'raspberrypi_A',
      pin: 0
    }
  },
  connections: {
    arduino_A: {
      adaptor: 'raspberrypi',
      port: '/dev/ttyACM0'
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
