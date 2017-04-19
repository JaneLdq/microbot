let Microbot = require('../index.js');

let mike = Microbot.robot({
  name: "Mike",
  devices: {
    servo: {
      // driver: 'continuous-servo',
      driver: 'servo',
      connection: 'arduino_A',
      pin: 9
    },
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
    // var clockwise = true;
    // this.servo.clockwise();
    // setInterval(() => {
    //   if (clockwise) {
    //     this.servo.counterClockwise();
    //     clockwise = false;
    //   } else {
    //     this.servo.clockwise();
    //     clockwise = true;
    //   }
    // }, 1000)

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
