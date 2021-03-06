const Driver = require('../../driver');

const StubDriver = module.exports = class StubDriver extends Driver {
  constructor(opts) {
    super(opts);
    this.name = opts.name || 'Led';
    this.isOn = false;

    this.pwmScale = opts.pwmScale || {
      bottom: 0,
      top: 255
    };

    if (this.pin == null) {
      throw new Error("No pin specified for LED. Cannot proceed");
    }

    this.commands = {
      is_on: this.isOn,

      turn_on: this.turnOn,
      turn_off: this.turnOff,
      toggle: this.toggle
    };
  }

  start(callback) {
    if (typeof callback == 'function') {
      callback();
    }
  }

  halt(callback) {
    if (typeof callback === 'function') {
      callback();
    }
  }

  turnOn(callback) {
    this.isOn = true;
    this.connection.digitalWrite(this.pin, 1);
    if (typeof callback === 'function') {
      callback();
    }
  }

  turnOff(callback) {
    this.isOn = false;
    this.connection.digitalWrite(this.pin, 0);
    if (typeof callback === 'function') {
      callback();
    }
  }

  toggle(callback) {
    if (this.isOn) {
      this.turnOff();
    } else {
      this.turnOn();
    }
  }

  blink(callback, delay = 300) {
    this.toggle();
    setTimeout(() => {
      this.toggle()
    }, delay);
    if (typeof callback === 'function') {
      callback();
    }
  }

  isOn() {
    return this.isOn;
  }
}
