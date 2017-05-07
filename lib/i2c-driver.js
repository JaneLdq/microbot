/**
 * Driver is abstraction of components that connected to hardware platforms
 *
 * TODO
 *
 */
const Driver = require('./driver');

const I2CDriver = module.exports = class I2CDriver extends Driver {

  constructor(opts) {
    super();

    opts = opts || {};

    this.address = opts.address;
  }

  start(callback) {
    callback();
  }

  halt(callback) {
    callback();
  }

}
