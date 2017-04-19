const Driver = require('../../driver');

const Relay = module.exports = class Relay extends Driver {
  /**
   * A Relay driver
   *
   * @constructor relay
   *
   * @param {Object} opts options object
   * @param {String|Number} opts.pin the pin to connect to
   * @param {String} opts.type either "open" or "closed"
   */
  constructor(opts) {
    super(opts);
    this.type = opts.type || "open";
    this.isOn = false;

    if (this.pin == null) {
      throw new Error("No pin specified for Relay. Cannot proceed");
    }

    this.commands = {
      turn_on: this.turnOn,
      turn_off: this.turnOff,
      toggle: this.toggle
    };
  }

  /**
   * Starts the Relay
   *
   * @param {Function} callback to be triggered when started
   * @return {void}
   */
  start(callback) {
    callback();
  }

  /**
   * Stops the Relay
   *
   * @param {Function} callback to be triggered when halted
   * @return {void}
   */
  halt(callback) {
    callback();
  }

  /**
   * Turn the Relay on.
   *
   * @param {Function} [callback] - (err, val) triggers when write is complete
   * @return {void}
   * @publish
   */
  turnOn(callback) {
    var newValue;
    if (this.type === "open") {
      newValue = 1;
    } else {
      newValue = 0;
    }

    this.connection.digitalWrite(this.pin, newValue, callback);
    this.isOn = true;
  }

  /**
   * Turn the Relay off.
   *
   * @param {Function} [callback] - (err, val) triggers when write is complete
   * @return {void}
   * @publish
   */
  turnOff(callback) {
    var newValue;
    if (this.type === "open") {
      newValue = 0;
    } else {
      newValue = 1;
    }

    this.connection.digitalWrite(this.pin, newValue, callback);
    this.isOn = false;
  }

  /**
   * Toggles the Relay on or off, depending on its current state
   *
   * @param {Function} callback function to be invoked when done
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
}
