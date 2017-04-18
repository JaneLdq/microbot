const Driver = require('../../driver');

const DirectPin = module.exports = class DirectPin extends Driver {
  /**
   * A Direct Pin driver
   *
   * @constructor DirectPin
   *
   * @param {Object} opts options object
   * @param {String|Number} opts.pin the pin to connect to
   */
  constructor(opts) {
    super(opts);

    this.readSet = false;
    this.high = false;

    if (this.pin == null) {
      throw new Error("No pin specified for Analog Sensor. Cannot proceed");
    }

    this.commands = {
      digital_read: this.digitalRead,
      digital_write: this.digitalWrite,

      analog_read: this.analogRead,
      analog_write: this.analogWrite,

      pwm_write: this.pwmWrite,
      servo_write: this.servoWrite
    };
  }

  /**
   * Starts the Direct Pin
   *
   * @param {Function} callback to be triggered when started
   * @return {void}
   */
  start(callback) {
    callback();
  }

  /**
   * Stops the Direct Pin
   *
   * @param {Function} callback to be triggered when stopped
   * @return {void}
   */
  halt(callback) {
    callback();
  }

  /**
   * Writes a digital value to the pin
   *
   * @param {Number} value value to write to the pin
   * @param {Function} [callback] - (err, val) triggers when write is complete
   * @return {void}
   * @publish
   */
  digitalWrite(value, callback) {
    this.connection.digitalWrite(this.pin, value, callback);
  }

  /**
   * Writes an analog value to the pin
   *
   * @param {Number} value value to write to the pin
   * @param {Function} [callback] - (err, val) triggers when write is complete
   * @return {void}
   * @publish
   */
  analogWrite(value, callback) {
    this.connection.analogWrite(this.pin, value, callback);
  }

  /**
   * Reads the value from the pin
   *
   * Triggers the provided callback when the pin state has been read.
   *
   * @param {Function} callback triggered when the pin state has been read
   * @return {void}
   * @publish
   */
  digitalRead(callback) {
    this._read("d", callback);
  }

  /**
   * Reads the value from the pin
   *
   * Triggers the provided callback when the pin state has been read.
   *
   * @param {Function} callback triggered when the pin state has been read
   * @return {void}
   * @publish
   */
  analogRead(callback) {
    this._read("a", callback);
  }

  _read(type, callback) {
    if (!this.readSet) {
      switch (type) {
        case "a":
          this.connection.analogRead(this.pin, callback);
          break;
        case "d":
          this.connection.digitalRead(this.pin, callback);
          break;
      }

      this.readSet = true;
    }
  }

  /**
   * Writes a servo value to the pin
   *
   * @param {Number} angle angle value to write to the pin
   * @param {Function} [callback] - (err, val) triggers when write is complete
   * @return {void}
   * @publish
   */
  servoWrite(angle, callback) {
    return this.connection.servoWrite(this.pin, angle, callback);
  }

  /**
   * Writes a PWM value to the pin
   *
   * @param {Number} value value to write to the pin
   * @param {Function} [callback] - (err, val) triggers when write is complete
   * @return {void}
   * @publish
   */
  pwmWrite(value, callback) {
    return this.connection.pwmWrite(this.pin, value, callback);
  }

}
