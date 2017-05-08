const I2CDriver = require('../../i2c-driver');

const BlinkM = module.exports = class BlinkM extends I2CDriver {

  constructor(opts) {
    /**
     * DirectI2C Driver
     *
     * @constructor DirectI2C
     */
    super(opts);
    this.address = this.address || 0x09;

    this.TO_RGB = 0x6e;
    this.FADE_TO_RGB = 0x63;
    this.FADE_TO_HSB = 0x68;
    this.FADE_TO_RND_RGB = 0x43;
    this.FADE_TO_RND_HSB = 0x48;
    this.PLAY_LIGHT_SCRIPT = 0x70;
    this.STOP_SCRIPT = 0x6f;
    this.SET_FADE = 0x66;
    this.SET_TIME = 0x74;
    this.GET_RGB = 0x67;
    this.GET_ADDRESS = 0x61;
    this.SET_ADDRESS = 0x41;
    this.GET_FIRMWARE = 0x5a;
  }

  /**
   * Sets the color of the BlinkM to the specified combination of RGB values.
   *
   * @param {Number} r red value, 0-255
   * @param {Number} g green value, 0-255
   * @param {Number} b blue value, 0-255
   * @param {Function} callback function to invoke when complete
   * @return {void}
   * @publish
   */
  goToRGB(r, g, b, callback) {
    this.connection.i2cWrite(this.address, this.TO_RGB, [r, g, b], callback);
  }

  /**
   * Fades the color of the BlinkM to the specified combination of RGB values.
   *
   * @param {Number} r red value, 0-255
   * @param {Number} g green value, 0-255
   * @param {Number} b blue value, 0-255
   * @param {Function} callback function to invoke when complete
   * @return {void}
   * @publish
   */
  fadeToRGB(r, g, b, callback) {
    this.connection.i2cWrite(this.address,
      this.FADE_TO_RGB, [r, g, b],
      callback);
  }

  /**
   * Fades the color of the BlinkM to the specified combination of HSB values.
   *
   * @param {Number} h hue value, 0-359
   * @param {Number} s saturation value, 0-100
   * @param {Number} b brightness value, 0-100
   * @param {Function} callback function to invoke when complete
   * @return {void}
   * @publish
   */
  fadeToHSB(h, s, b, callback) {
    this.connection.i2cWrite(this.address,
      this.FADE_TO_HSB, [h, s, b],
      callback);
  }

  /**
   * Fades the color of the BlinkM to a random combination of RGB values.
   *
   * @param {Number} r red value, 0-255
   * @param {Number} g green value, 0-255
   * @param {Number} b blue value, 0-255
   * @param {Function} cb function to invoke when complete
   * @return {void}
   * @publish
   */
  fadeToRandomRGB(r, g, b, cb) {
    this.connection.i2cWrite(this.address, this.FADE_TO_RND_RGB, [r, g, b], cb);
  };

  /**
   * Fades the color of the BlinkM to a random combination of HSB values.
   *
   * @param {Number} h hue value, 0-359
   * @param {Number} s saturation value, 0-100
   * @param {Number} b brightness value, 0-100
   * @param {Function} cb function to invoke when complete
   * @return {void}
   * @publish
   */
  fadeToRandomHSB(h, s, b, cb) {
    this.connection.i2cWrite(this.address, this.FADE_TO_RND_HSB, [h, s, b], cb);
  }

  /**
   * Plays a light script for the BlinkM.
   *
   * Available scripts are available in the BlinkM datasheet.
   *
   * A `repeats` value of `0` causes the script to execute until the the
   * `#stopScript` command is called.
   *
   * @param {Number} id light script to play
   * @param {Number} repeats whether the script should repeat
   * @param {Number} startAtLine which line in the light script to start at
   * @param {Function} cb function to invoke when complete
   * @return {void}
   * @publish
   */
  playLightScript(id, repeats, startAtLine, cb) {
    this.connection.i2cWrite(
      this.address,
      this.PLAY_LIGHT_SCRIPT, [id, repeats, startAtLine],
      cb
    );
  }

  /**
   * Stops the currently executing BlinkM light script.
   *
   * @param {Function} cb function to invoke when complete
   * @return {void}
   * @publish
   */
  stopScript(cb) {
    this.connection.i2cWrite(this.address, this.STOP_SCRIPT, [], cb);
  }

  /**
   * Sets the fade speed for the BlinkM
   *
   * @param {Number} speed how fast colors should fade (1-255)
   * @param {Function} cb function to invoke when complete
   * @return {void}
   * @publish
   */
  setFadeSpeed(speed, cb) {
    this.connection.i2cWrite(this.address, this.SET_FADE, [speed], cb);
  }

  /**
   * Sets a time adjust for the BlinkM.
   *
   * This affects the duration of scripts.
   *
   * @param {Number} time an integer between -128 and 127. 0 resets the time.
   * @param {Function} cb function to invoke when complete
   * @return {void}
   * @publish
   */
  setTimeAdjust(time, cb) {
    this.connection.i2cWrite(this.address, this.SET_TIME, [time], cb);
  }

  /**
   * Gets the RGB values for the current BlinkM color.
   *
   * Yields an array in the form `[r, g, b]`, each a 0-255 integer.
   *
   * @param {Function} cb function to invoke when complete
   * @return {void}
   * @publish
   */
  getRGBColor(cb) {
    return this.connection.i2cReadOnce(this.address, 3, cb);
  }

  /**
   * Returns a string describing the current I2C address being used.
   *
   * @param {Function} cb function to invoke when complete
   * @return {void}
   * @publish
   */
  getAddress(cb) {
    return this.connection.i2cRead(this.address, this.GET_ADDRESS, 1, cb);
  }

  /**
   * Sets an address to the BlinkM driver
   *
   * @param {Number} address I2C address to set
   * @param {Function} cb function to invoke when complete
   * @return {void}
   * @publish
   */
  setAddress(address, cb) {
    this.connection.i2cWrite(
      this.address,
      this.SET_ADDRESS, [address, 0xd0, 0x0d, address],
      cb
    );

    this.address = address;
  }

  /**
   * Returns a string describing the I2C firmware version being used
   *
   * @param {Function} cb function to invoke when complete
   * @return {void}
   * @publish
   */
  getFirmware(cb) {
    return this.connection.i2cRead(this.address, this.GET_FIRMWARE, 1, cb);
  }


}
