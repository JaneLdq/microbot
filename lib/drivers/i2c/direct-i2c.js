const I2CDriver = require('../../i2c-driver');

const DirectI2C = module.exports = class DirectI2C extends I2CDriver {
  /**
   * DirectI2C Driver
   *
   * @constructor DirectI2C
   */
  constructor() {
    super(opts);
    this.commands = {
      read: this.reas,
      write: this.write
    };
  }

  /**
   * Perform i2c read
   *
   * @param {Number} register to read from
   * @param {Number} len number of bytes to read
   * @param {Function} callback function to be invoked with data
   * @return {void}
   * @publish
   */
  read(register, len, callback) {
    this.connection.i2cRead(
      this.address,
      new Buffer(register),
      len,
      function(err, data) {
        if (typeof callback === "function") {
          callback(err, data);
        }
      }
    );
  }

  /**
   * Perform i2c write
   *
   * @param {Number} cmd command or register to write to
   * @param {Array} data bytes to write
   * @param {Function} callback function to be invoked with any errors
   * @return {void}
   * @publish
   */
  write(cmd, data, callback) {
    this.connection.i2cWrite(
      this.address,
      cmd,
      data,
      function(err) {
        if (typeof callback === "function") {
          callback(err);
        }
      }
    );
  }

}
