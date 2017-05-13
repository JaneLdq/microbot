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
    led_1: {
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
    after((2).seconds(), function() {
      this.turnOn();
    }.bind(this));

    after((5).seconds(), function() {
      this.turnOff();
    }.bind(this));
  },

  service: {
		protocol:'socket',
		host: '127.0.0.1',
    port: '3000'
  }


}).start();
