const Driver = require('../../driver');

const RGBLed = module.exports = class RGBLed extends Driver {
  /**
   * RGB LED driver
   *
   * @constructor led
   *
   * @param {Object} opts options object
   * @param {String|Number} opts.redPin the red pin to connect to
   * @param {String|Number} opts.greenPin the green pin to connect to
   * @param {String|Number} opts.bluePin the blue pin to connect to
   * @param {Boolean} opts.cathode when true all pin outputs will be negated from
   *                               255, defaults to false
   */
  constructor(opts) {
    super(opts);

    this.redPin = opts.redPin || null;
    this.greenPin = opts.greenPin || null;
    this.bluePin = opts.bluePin || null;

    this.cathode = opts.cathode || false;

    if (this.redPin == null) {
      throw new Error("No red pin specified for RGB LED. Cannot proceed");
    }

    if (this.greenPin == null) {
      throw new Error("No green pin specified for RGB LED. Cannot proceed");
    }

    if (this.bluePin == null) {
      throw new Error("No blue pin specified for RGB LED. Cannot proceed");
    }

    this.commands = {
      is_on: this.isOn,
      set_rgb: this.setRGB
    };
  }

  /**
   * Starts the RGBLed
   *
   * @param {Function} callback to be triggered when started
   * @return {void}
   */
  start(callback) {
    callback();
  }

  /**
   * Stops the RGBLed
   *
   * @param {Function} callback to be triggered when halted
   * @return {void}
   */
  halt(callback) {
    callback();
  }

  /**
   * Sets the RGB LED to a specific color
   *
   * @param {Number} hex value for the LED e.g. 0xff00ff
   * @param {Function} callback to be triggered when complete
   * @return {void}
   * @publish
   */
  setRGB(hex, callback) {
    var val = this._hexToRgb(hex);
    this.isHigh = true;
    // this.connection.pwmWrite(this.redPin, this_negateOnCathode(val.r));
    // this.connection.pwmWrite(this.greenPin, this_negateOnCathode(val.g));
    // this.connection.pwmWrite(this.bluePin, this._negateOnCathode(val.b));
    this.connection.digitalWrite(this.redPin, val.r > 0 ? 1 : 0);
    this.connection.digitalWrite(this.greenPin, val.g > 0 ? 1 : 0);
    this.connection.digitalWrite(this.bluePin, val.b > 0 ? 1 : 0);
    
    if (typeof callback === "function") {
      callback(null, val);
    }
  }

  /**
   * Returns whether or not the RGB LED is currently on
   *
   * @param {Function} callback function to invoke with isOn value
   * @return {Boolean} whether or not the LED is currently on
   * @publish
   */
  isOn(callback) {
    if (typeof callback === "function") {
      callback(null, this.isHigh);
    }
    return this.isHigh;
  }

  _negateOnCathode(val) {
    var outVal;
    if (this.cathode) {
      outVal = 255 - val;
    } else {
      outVal = val;
    }
    return outVal;
  }

  _hexToRgb(hex) {
    var param = hex.toString(16);
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(param);

    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    }
    console.log({
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    });
    return {
      r: 0,
      g: 0,
      b: 0
    };
  }

}
