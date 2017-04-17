const Driver = require('../../driver');

const events = [
  /**
   * Emitted when the Analog Sensor has fetched a new value
   *
   * @event analogRead
   */
  "analogRead",

  /**
   * Emitted when the Analog Sensor reads a value above the specified upper
   * limit
   *
   * @event upperLimit
   */
  "upperLimit",

  /**
   * Emitted when the Analog Sensor reads a value below the specified lower
   * limit
   *
   * @event lowerLimit
   */
  "lowerLimit"
];

const AnalogSensor = module.exports = class AnalogSensor extends Driver {
  /**
   * An Analog Sensor driver
   *
   * @constructor AnalogSensor
   * @param {Object} opts options object
   * @param {String|Number} opts.pin the pin to connect to
   * @param {Number} [opts.upperLimit] upper limit for sensor
   * @param {Number} [opts.lowerLimit] lower limit for sensor
   */
  constructor(opts) {
    super(opts);

    this.upperLimit = opts.upperLimit || 256;
    this.lowerLimit = opts.lowerLimit || 0;
    this.analogVal = null;

    if (this.pin == null) {
      throw new Error("No pin specified for Analog Sensor. Cannot proceed");
    }

    this.commands = {
      analog_read: this.analogRead
    };

    this.events = events;
  }

  /**
   * Gets the current value from the Analog Sensor
   *
   * @param {Function} [callback] invoked with `err, value` as args
   * @return {Number} the current sensor value
   * @publish
   */
  analogRead(callback) {
    var val = this.analogVal;

    if (typeof callback === "function") {
      callback(null, val);
    }

    return val;
  }

  /**
   * Starts the Analog Sensor
   *
   * @param {Function} callback to be triggered when started
   * @return {void}
   */
  start(callback) {
    this.connection.analogRead(this.pin, function(err, readVal) {
      if (err) {
        return;
      }

      this.analogVal = readVal;
      this.emit("analogRead", readVal);

      if (readVal >= this.upperLimit) {
        this.emit("upperLimit", readVal);
      } else if (readVal <= this.lowerLimit) {
        this.emit("lowerLimit", readVal);
      }
    }.bind(this));

    callback();
  }

  /**
   * Stops the Analog Sensor
   *
   * @param {Function} callback to be triggered when stopped
   * @return {void}
   * @api private
   */
  halt(callback) {
    callback();
  }

}
