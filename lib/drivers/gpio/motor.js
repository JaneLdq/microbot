const Driver = require('../../driver');

const Motor = module.exports = class Motor extends Driver {
  /**
   * A Motor driver
   *
   * @constructor motor
   *
   * @param {Object} opts options object
   * @param {String|Number} opts.pin the pin to connect to
   * @param {Number} opts.freq motor frequency
   * @param {Object} [opts.pwmScale] pwm scale
   * @param {Number} opts.pwmScale.bottom pwm scale bottom
   * @param {Number} opts.pwmScale.top pwm scale top
   * @param {String|Number} opts.directionPin the pin to use for motor direction
   */
  constructor(opts) {
    super(opts);

    this.freq = opts.freq || null;
    this.speedValue = 0;
    this.isOn = false;
    this.pwmScale = opts.pwmScale || {
      bottom: 0,
      top: 255
    };
    this.directionPin = opts.directionPin;

    if (this.pin == null) {
      throw new Error("No pin specified for Motor. Cannot proceed");
    }

    this.commands = {
      turn_on: this.turnOn,
      turn_off: this.turnOff,
      toggle: this.toggle,
      speed: this.speed,
      current_speed: this.currentSpeed
    };
  }

  /**
   * Starts the Motor
   *
   * @param {Function} callback to be triggered when started
   * @return {void}
   */
  start(callback) {
    callback();
  }

  /**
   * Stops the Motor
   *
   * @param {Function} callback to be triggered when stopped
   * @return {void}
   */
  halt(callback) {
    callback();
  }

  /**
   * Turns the Motor on by writing a HIGH (1) value to the pin
   *
   * Also sets `this.isOn` to `true`.
   *
   * @param {Function} [callback] - (err, val) triggers when write is complete
   * @return {void}
   * @publish
   */
  turnOn(callback) {
    this.isOn = true;
    this.connection.digitalWrite(this.pin, 1, callback);
  }

  /**
   * Turns the Motor off by writing a LOW (0) value to the pin
   *
   * Also sets `this.isOn` to `false`.
   *
   * @param {Function} [callback] - (err, val) triggers when write is complete
   * @return {void}
   * @publish
   */
  turnOff(callback) {
    this.isOn = false;
    this.connection.digitalWrite(this.pin, 0, callback);
  }

  /**
   * Toggles the Motor on or off, depending on its current state
   *
   * @param {Function} [callback] invoked with `err, value` as args
   * @return {void}
   * @publish
   */
  toggle(callback) {
    if (this.isOn) {
      this.turnOff();
    } else {
      this.turnOn();
    }

    if (typeof callback === "function") {
      callback();
    }
  }

  /**
   * Returns the Motor's current speed value
   *
   * @param {Function} [callback] - (err, val)
   * @return {Number} the current motor speed
   * @publish
   */
  currentSpeed(callback) {
    if (typeof callback === "function") {
      callback(null, this.speedValue);
    }

    return this.speedValue;
  };

  /**
   * Sets the Motor's speed to the PWM value provided (0-255)
   *
   * @param {Number} value PWM value to set the speed to (0-255)
   * @param {Function} [callback] - (err, val) triggers when write is complete
   * @return {void}
   * @publish
   */

  speed(value, callback) {
    var start = this.pwmScale.bottom;
    var end = this.pwmScale.top;
    var val = (value - Math.min(start, end)) / (Math.max(start, end) - Math.min(start, end));
    var scaledDuty = val;

    if (val > 1) {
      scaledDuty =  1;
    }

    if (val < 0) {
      scaledDuty =  0;
    }

    this.connection.pwmWrite(
      this.pin,
      scaledDuty,
      callback
    );

    this.speedValue = value;
    this.isOn = this.speedValue > 0;
  }

  /**
   * Sets the Motor direction
   *
   * @param {Number} direction direction 1 forward, 0 backward
   * @param {Function} [callback] - (err, val) triggers when write is complete
   * @return {void}
   * @publish
   */
  setDirection(direction, callback) {
    this.connection.digitalWrite(this.directionPin, direction, callback);
  }

  /**
   * Sets the Motor to forward by writing a HIGH (1) value to the direction pin
   *
   * @param {Number} speed speed to go
   * @param {Function} [callback] - (err, val) triggers when write is complete
   * @return {void}
   * @publish
   */
  forward(speed, callback) {
    this.setDirection(1);
    this.speed(speed, callback);
  }

  /**
   * Sets the Motor to backward by writing a LOW (0) value to the direction pin
   *
   * @param {Number} speed speed to go
   * @param {Function} [callback] - (err, val) triggers when write is complete
   * @return {void}
   * @publish
   */
  backward(speed, callback) {
    this.setDirection(0);
    this.speed(speed, callback);
  }

}
