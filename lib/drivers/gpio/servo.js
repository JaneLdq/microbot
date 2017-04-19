const Driver = require('../../driver');

const Servo = module.exports = class Servo extends Driver {
  /**
   * A Servo driver
   *
   * @constructor Servo
   *
   * @param {Object} opts options object
   * @param {String|Number} opts.pin the pin to connect to
   * @param {Object} [opts.range] range min/max
   * @param {Number} opts.range.min range min
   * @param {Number} opts.range.max range max
   * @param {Object} [opts.pulseWidth] pulse width min/max
   * @param {Number} opts.pulseWidth.min pulse width min
   * @param {Number} opts.pulseWidth.max pulse width min
   * @param {Object} [opts.pwmScale] PWM scale bottom/top
   * @param {Number} opts.pwmScale.bottom PWM scale bottom
   * @param {Number} opts.pwmScale.top PWM scale top
   */
  constructor(opts) {
    super(opts);

    this.angleValue = 0;

    this.angleRange = opts.range || {
      min: 20,
      max: 160
    };
    this.freq = opts.freq || null;
    this.pulseWidth = opts.pulseWidth || {
      min: 500,
      max: 2400
    };
    this.pwmScale = opts.pwmScale || {
      bottom: 0,
      top: 180
    };

    if (this.pin == null) {
      throw new Error("No pin specified for Servo. Cannot proceed");
    }

    this.commands = {
      angle: this.angle,
      current_angle: this.currentAngle
    };
  }

  /**
   * Starts the Servo
   *
   * @param {Function} callback to be triggered when started
   * @return {void}
   */
  start(callback) {
    callback();
  }

  /**
   * Stops the Servo
   *
   * @param {Function} callback to be triggered when stopped
   * @return {void}
   */
  halt(callback) {
    callback();
  }

  /**
   * Returns the current angle of the Servo
   *
   * @param {Function} callback function to be invoked with angle value
   * @return {Number} the current servo angle value (0-180)
   * @publish
   */
  currentAngle(callback) {
    if (typeof callback === "function") {
      callback(null, this.angleValue);
    }

    return this.angleValue;
  }

  /**
   * Sets the angle of the servo to the provided value
   *
   * @param {Number} value - the angle to point the servo to (0-180)
   * @param {Function} [callback] - (err, val) triggers when write is complete
   * @return {void}
   * @publish
   */
  angle(value, callback) {
    var safeAngle = this.safeAngle(value);
    var scaledDuty;
    if (safeAngle >= this.pwmScale.top) {
      scaledDuty = 1;
    } else if (safeAngle <= this.pwmScale.bottom) {
      scaledDuty = 0;
    } else {
      scaledDuty = (safeAngle - this.pwmScale.bottom) / (this.pwmScale.top - this.pwmScale.bottom);
    }
    // var scaledDuty = (this.safeAngle(value)).fromScale(
    //   this.pwmScale.bottom,
    //   this.pwmScale.top
    // );
    console.log("sacaledDuty: "+ scaledDuty);
    this.connection.servoWrite(
      this.pin,
      scaledDuty,
      this.freq,
      this.pulseWidth,
      callback
    );
    this.angleValue = value;
  }

  // Public: Saves an specified angle, angle must be an
  // integer value between 0 and 180.
  //
  // value - params
  //
  // Returns null.

  /**
   * Given a servo angle, determines if it's safe or not, and returns a safe value
   *
   * @param {Number} value the angle the user wants to set the servo to
   * @return {Number} a made-safe angle to set the servo to
   * @publish
   */
  safeAngle(value) {
    if (value < this.angleRange.min) {
      value = this.angleRange.min;
    } else if (value > this.angleRange.max) {
      value = this.angleRange.max;
    }

    return value;
  }
}
