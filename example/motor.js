//demo for led and button, use button to control the led
let Microbot = require('../index.js');

let mike = Microbot.robot({
  name: "Mike",
  devices: {
    motor: {
      driver: 'motor',
      connection: 'arduino_A',
      pin: 7,
      directionPin: 6
    },
  },
  connections: {
    arduino_A: {
      adaptor: 'arduino',
      port: '/dev/cu.usbmodem1421'
    }
  },
  run: function() {
    this.motor.speed(100);
    console.log("now speed: " + this.motor.currentSpeed());
    setInterval(() => {
      this.motor.toggle();
      console.log("toggle: " + this.motor.currentSpeed());
    }, 5000);

  }
}).start();
