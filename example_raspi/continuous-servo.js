let Microbot = require('../index.js');

let mike = Microbot.robot({
  name: "Bob",
  devices: {
    servo: {
      // driver: 'continuous-servo',
      driver: 'servo',
      connection: 'raspberrypi_A',
      pin: 9
    },
  },
  connections: {
    arduino_A: {
      adaptor: 'raspberrypi',
      port: '/dev/ttyACM0'
    }
  },
  run: function() {

    var angle = 45;
    this.servo.angle(angle);
    setInterval(()=>{
      angle = angle + 45;
      if (angle > 135) {
        angle = 45
      }
      this.servo.angle(angle);
      console.log(angle);
    },1000);
  }
}).start();
