/**
 * Arduino and Arduino compitible boards using Firmata protocol to communicatewith software on the host computer,
 * hince, this adaptor implements most parts of Firmata protocol based on npm module 'firmata'
 */
const Board = require('firmata'),
	Adaptor = require('../../adaptor');

let board;

const Arduino = module.exports = class Arduino extends Adaptor {
	
	constructor() {
		super();
		// constants used to set a digital pin's valtage
		this.HIGT = Board.HIGT;
		this.LOW = Borad.LOW;
	}

	connect(callback) {
		board = new Board(this.port, (err) => {
			if (err) {
				callback(err);
			}
			this._respond('connect', callback, err);
		});
	}

	disconnect(callback) {
		board.reset();
		this._respond('disconnect', callback);
	}

	/*
	 * Configures the specifed pin to behave either as an input or an output.
	 * @param {Number} [pin] the number of the pin
	 * @param {String} [mode] standard pin mode of firmata protocol, if not found then set it to INPUT
	 * @return {void}
	 */
	pinMode(pin, mode) {
		let mode = Board.MODES[mode.toUpperCase()] || Board.MODES.INPUT;
		board.pinMode(pin, mode);
	}

	/**
	 * Reads the value from a specified pin, either HIGH or LOW
	 * @param {Number} [pin] the number of the pin
	 * @param {Function} [callback] function(value, pin) to handle the return value from the specified pin
	 * @return {void}
	 */
	digitalRead(pin, callback) {
		this.pinMode(pin, Board.MODES.INPUT);
		board.digitalRead(pin, (value) => {
			this._respond('digitalRead', callback, null, value, pin);
		});
	}

	/*
	 * Write a HIGH or a LOW value to a digital pin
	 * @param {Number} [pin] the number of the pin
	 * @param {Enum} [value] HIGH or LOW
	 * @param {Function} [callback] function(value, pin) after write is completed
	 * @return {void}
	 */
	digitalWrite(pin, value, callback) {
		this.pinMode(pin, Board.MODES.OUTPUT);
		board.digitalWrite(pin, value);
		this._respond('digitalWrite', callback, null, value, pin);
	}

	/**
	 * Reads the analog value (0-1023) from a specified pin
	 * @param {Number} [pin] the number of the pin
	 * @param {Function} [callback] function(value, pin) to handle the return value
	 * @return {void}
	 */
	analogRead(pin, callback) {
		board.anologRead(pin, (value) => {
			this._respond('analogRead', callback, null, value, pin);
		});
	}

	/**
	 * Write an output to an anlog pin(PWM)
	 * @param {Number} [pin] the number of the pin
	 * @param {Number} [value] the analog value to write, which is between 0 and 255
	 */
	analogWrite(pin, value, callback) {
		value = (value).toScale(0, 255);
		// analog pin mapping to normal pin
		this.pinMode(board.analogPins[pin], Board.MODES.ANALOG);
		board.analogWrite(board.analogPins[pin], value);
		this._respond("analogWrite", callback, null, value, pin);
	}

	/**
	 * Set sampling interval, default is 19ms
	 * @param {Number} [interval] sampling interval in milliseconds
	 * @param {Function} [callback] function(interval) after set sampling interval
	 * @return {void}
	 */
	setSamplingInterval(interval, callback) {
		board.setSamplingInterval(interval);
		this._respond('setInterval', callback, null, interval);
	}

	/**
	 * Get current sampling interval
	 * @return {Number} sampling interval
	 */
	getSamplingInterval() {
		return board.getSamplingInterval();
	}

	/**
	 * [Servo] Write a degree value to a servo pin
	 * @param {Number} [pin] the number of pin
	 * @param {Number} [degree] the degree to rotate
	 * @return {void}
	 */
	servoWrite(pin, degree, callback) {
		// standard servos allow the shaft to be positioned at various angles, usually between 0 and 180 degrees
		value = (value).toScale(0, 180);
		this.pinMode(pin, Board.MODES.SERVO);
		board.servoWrite(pin, degree);
		this._respond('servoWrite', callback, null, degree, pin);
	}

	/**
	 * [Servo] Setup a servo with a specific min and max pulse
	 * @param {Number} [pin] the number of the pin
	 * @param {Number} [min] min pulse
	 * @param {Number} [max] max pulse
	 * @return {void}
	 */
	servoConfig(pin, min, max, callback) {
		board.servoConfig(pin, min, max);
	}

	/**
	 * [I2C] Configure and enable I2C
	 * @param {Number} [delay] a value in μs to delay between reads
	 * @return {void}
	 */
	i2cConfig(delay = 0) {
		board.i2cConfig(delay);
	}

	// TODO ---------------------------------------------------------------------------------------
	/**
	 * [I2C] Write data(may not exceed 64 bytes) to a register
	 * @param {Number} [address] the address of an I2C device
	 * @param {Number} [register] Most slave devices have a number of indexed internal registers. The register index is transferred following the device address, and then the desired data.
	 * @param {Array} [data] an array of bytes
	 * @param {Function} [callback] function(err) callback function to be invoked when write is completed
	 * @return {void}
	 */
	i2cWrite(address, register, data, callback) {

	}

	/**
	 * [I2C] Read a specified number of bytes continuously
	 * @param {Number} [address] the address of an I2C device
	 * @param {Number} [register] the number of indexed internal register
	 * @param {Number} [length] the number of bytes
	 * @param {Function} [callback] function(err, data) callback when read is completed
	 * @return {void}
	 */
	i2cRead(address, register, length, callback) {

	}

	/**
	 * [One-Wire] Configure the pin as the controller in a 1-wire bus
	 * @param {Number} [pin] the number of the pin
	 * @param {Boolean} [enablePower] set enablePower to true if you want the data pin to power the bus
	 */
	sendOneWireConfig(pin, enablePower, callback) {

	}

	/**
	 * [One-Wire] Search for 1-wire devices on the bus
	 * @param {Number} [pin] the number of the pin
	 * @param {Function} [callback] function(err, data) callback function with argument data which is an array of device identifiers
	 */
	sendOneWireSearch(pin, callback) {

	}

	/**
	 * [One-Wire] Search for 1-wire devices on the buse in an alarmed state
	 * @param {Number} [pin] the number of the pin
	 * @param {Function} [callback] function(err, data) callback function with argument data which is an array of device identifiers
	 */
	sendOneWireAlarmsSearch(pin, callback) {

	}

	/**
	 * [One-Wire] Read data from a device on the bus
	 * @param {Number} [pin] the number of the pin
	 * @param {} [device] the device
	 * @param {Number} [length] the number of bytes to read
	 * @param {Function} [callback] function(err, data) when read is completed or an error occurs
	 */
	sendOneWireRead(pin, device, length, callback) {

	}

	/**
	 * [One-Wire] Reset all devices on the bus
	 */
	sendOneWireReset() {
		board.sendOneWireReset();
	}

	/**
	 * [One-Wire] Write data to the bus to be receibed by the device
	 * @param {Number} [pin] the number of the pin
	 * @param {} [device] the device
	 * @param {Array} [length] the number of bytes to read
	 * @param {Function} [callback] function(err, data) when read is completed or an error occurs
	 */
	sendOneWireWrite(pin, device, data, callback) {

	}

	/**
	 * [One-Wire] Delay numbers of ms to tell firmata not do anything
	 * @param {Number} [bin] the number of pin
	 * @param {Number} [delay] the number of milliseconds
	 * @param {Function} [callback]
	 * @return
	 */
	sendOneWireDelay(pin, delay, callback) {

	}

	/**
	 * Send the data to the device on the bus, reads the specified number of bytes
	 * @param {Number} [pin] the number of the pin
	 * @param {} [device] the device
	 * @param {Array} [data] an array of bytes to write to the device
	 * @param {Number} [length] the number of bytes to read from the device
	 * @param {Function} [callback] function(err, data) callback function when read is completed
	 * @return {void}
	 */
	sendOneWireWriteAndRead(pin, device, data, length, callback) {

	}

}