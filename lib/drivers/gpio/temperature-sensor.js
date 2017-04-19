const Driver = require('../../driver');
const AnalogSensor = require("./analog-sensor");

const TemperatureSensor = module.exports = class TemperatureSensor extends AnalogSensor {
  /**
   * A TemperatureSensor Driver
   *
   * @constructor temperature
   * @param {Object} opts options object
   * @param {String|Number} opts.bValue the bValue for thermistor

   */
  constructor(opts) {
    super(opts);

    this.bValue = opts.bValue || 4275;
    this.commands = {
      celsius: this.celsius
    };
  }

  /**
   * Gets the current value from the Analog Sensor
   *
   * @param {Function} [callback] invoked with `err, value` as args
   * @return {Number} the current temperature value
   * @publish
   */
  celsius(callback) {
    var val = this.analogVal;
    var r = (1023 - val) * 10000 / val;
    var t = 1 / (Math.log(r / 10000) / this.bValue + 1 / 298.15) - 273.15;
    var temp = Math.round(t);

    if (typeof callback === "function") {
      callback(null, temp);
    }
    console.log("temp:" + temp);
    return temp;
  }
}
