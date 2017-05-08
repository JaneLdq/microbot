const I2CDriver = require('../../i2c-driver');

const Hmc6352 = module.exports = class Hmc6352 extends I2CDriver {

  /**
   * A HMC6352 Driver Compass
   *
   * @constructor hmc6352
   */
  constructor(opts) {
    super(opts);
    this.address = this.address || 0x42 >> 1;

    this.commands = {
      heading: this.heading
    };
  }

  /**
   * Starts the driver
   *
   * @param {Function} callback triggered when the driver is started
   * @return {void}
   */
  start(callback) {
    this.connection.i2cWrite(this.address, this.commandBytes("A"));
    callback();
  }

  /**
   * Returns the heading data for the compass.
   *
   * @param {Function} callback function to be invoked with data
   * @return {void}
   * @publish
   */
  heading(callback) {
    this.connection.i2cRead(
      this.address,
      this.commandBytes("A"),
      2,
      function(err, data) {
        if (typeof callback === "function") {
          callback(err, this.parseHeading(data));
        }
      }.bind(this)
    );
  }

  /**
   * commandBytes
   *
   * @param {String} s string to coerce to Buffer
   * @return {Buffer} buffer containing command string
   */
  commandBytes(s) {
    return new Buffer(s, "ascii");
  }

  /**
   * parseHeading
   *
   * @param {Number} val value to parse
   * @return {number} represents the current heading
   */
  parseHeading(val) {
    return (val[1] + val[0] * 256) / 10.0;
  }

}
