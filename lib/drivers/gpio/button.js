const Driver = require('../../driver');

const events = [
  /**
   * Emitted when the Button is pushed
   *
   * @event push
   */
  "push",

  /**
   * Emitted when the Button is released
   *
   * @event release
   */
  "release"
]

const Button = module.exports = class Button extends Driver {
  /**
   * A Button driver
   *
   * @constructor Button
   *
   * @param {Object} opts options object
   * @param {String|Number} opts.pin the pin to connect to
   */
  constructor(opts) {
    super(opts);
    this.pressed = false;
    this.prevState = 0;

    if (this.pin == null) {
      throw new Error("No pin specified for Button. Cannot proceed");
    }

    this.commands = {
      is_pressed : this.isPressed
    };

    this.events = events;
  }

  /**
   * Starts the Button
   *
   * @param {Function} callback to be triggered when started
   * @return {void}
   * @private
   */
  start(callback) {
    this.connection.digitalRead(this.pin, function(err, data) {
      if (err) {
        return;
      }
      var previoislyPressed = this.pressed;
      this.pressed = (data === 1);

      if (this.pressed && !previouslyPressed) {
        this.pressed = true;
        this.emit("push");
      } else if (!this.pressed && previouslyPressed) {
        this.pressed = false;
        this.emit("release");
      }
    }.bind(this));

    callback();
  }

  /**
   * Stops the Analog Sensor
   *
   * @param {Function} callback to be triggered when stopped
   * @return {void}
   * @private
   */
  halt(callback) {
    callback();
  }

  /**
   * Check whether or not the Button is currently pressed
   *
   * @param {Function} [callback] invoked with `err, value` as args
   * @return {Boolean} whether or not the button is pressed
   * @publish
   */
  isPressed(callback) {
    if (typeof callback === "function") {
      callback(null, this.pressed);
    }
    return this.pressed;
  }
}
