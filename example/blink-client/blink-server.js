let Microbot = require('../../index.js');

let rosie = Microbot.robot({
  name: "rosie",
  commands: function() {
    return {
      turn_on: this.turnOn,
      turn_off: this.turnOff,
      Atoggle: this.Atoggle
    };
  },
  events: ['turned_on', 'turned_off', 'toggle'],
  devices: {
    led: {
      driver: 'led',
      connection: 'arduino_A',
      pin: 13
    }
  },
  connections: {
    arduino_A: {
      adaptor: 'arduino',
      port: '/dev/cu.usbmodem1421',
      desc: 'StarDuino UNO'
    }
  },
  Atoggle: function() {
    this.led.toggle();
    if (this.led.isOn()) {
      this.emit('turned_on', {
        data: 'pass some data to the listener'
      });
    } else {
      this.emit('turned_off', {
        data: 'pass some data to the listener'
      });
    }
  },

  turnOn: function() {
    this.led.turnOn();
    console.log("TURN ON BY WEB");
    this.emit('turned_on', {
      data: 'pass some data to the listener'
    });
  },

  turnOff: function() {
    this.led.turnOff();
    console.log("TURN OFF BY WEB");
    this.emit('turned_off', {
      data: 'pass some data to the listener'
    });
  },

  run: function() {
    // Add your robot code here,
    // for this example with sockets
    // we are going to be interacting
    // with the robot using the code in
    // ./blink-client.html.

    setTimeout(() => {
      this.turnOn();
    }, 2000);

    setTimeout(() => {
      this.turnOff();
    }, 5000);

  },

  service: {
    protocol: 'socket',
    host: '127.0.0.1',
    port: '3000'
  }


}).start();
