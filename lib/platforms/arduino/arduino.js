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
		this.i2cReady = false;
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
	 * @return {void}
	 */
	digitalWrite(pin, value) {
		this.pinMode(pin, Board.MODES.OUTPUT);
		board.digitalWrite(pin, value);
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
	analogWrite(pin, value) {
		value = (value).toScale(0, 255);
		// analog pin mapping to normal pin
		this.pinMode(board.analogPins[pin], Board.MODES.ANALOG);
		board.analogWrite(board.analogPins[pin], value);
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
	servoWrite(pin, degree) {
		// standard servos allow the shaft to be positioned at various angles, usually between 0 and 180 degrees
		value = (value).toScale(0, 180);
		this.pinMode(pin, Board.MODES.SERVO);
		board.servoWrite(pin, degree);
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
		this.i2cReady = true;
	}

	/**
	 * [I2C] Write data(may not exceed 64 bytes) to a register
	 * @param {Number} [address] the address of an I2C device
	 * @param {Number} [register] Most slave devices have a number of indexed internal registers. The register index is transferred following the device address, and then the desired data.
	 * @param {Array} [data] an array of bytes
	 * @return {void}
	 */
	i2cWrite(address, register, data) {
		if (!this.i2cReady) {
			this.i2cConfig(2000);
		}
		board.i2cWrite(address, register, data);
	}

	/**
	 * [I2C] Read a specified number of bytes continuously
	 * @param {Number} [address] the address of an I2C device
	 * @param {Number} [register] the number of indexed internal register
	 * @param {Number} [length] the number of bytes
	 * @param {Function} [callback] function(data) callback when read is completed
	 * @return {void}
	 */
	i2cRead(address, register, length, callback) {
		if (!this.i2cReady) {
			this.i2cConfig(2000);
		}
		board.i2cRead(address, register, length, (data) => {
			this._respond('i2cRead', callback, null, data);
		});
	}

	/**
	 * [I2C] Read a specified number of bytes, one time
	 * @param {Number} [address] the address of an I2C device
	 * @param {Number} [length] the number of bytes
	 * @param {Function} [callback] function(err, data) callback when read is completed
	 * @return {void}
	 */
	i2cReadOnce(address, length, callback) {
		if (!this.i2cReady) {
			this.i2cConfig(2000);
		}
		board.i2cReadOnce(address, length, (data) => {
			this._respond('i2cReadOnce', callback, null, data);
		});
	}

	/**
	 * [One-Wire] Configure the pin as the controller in a 1-wire bus
	 * @param {Number} [pin] the number of the pin
	 * @param {Boolean} [enablePower] set enablePower to true if you want the data pin to power the bus
	 * @return {void}
	 */
	sendOneWireConfig(pin, enablePower) {
		board.sendOneWireConfig(pin, enablePower);
	}

	/**
	 * [One-Wire] Search for 1-wire devices on the bus
	 * @param {Number} [pin] the number of the pin
	 * @param {Function} [callback] function(err, devices) callback function with argument data which is an array of device identifiers
	 * @return {void}
	 */
	sendOneWireSearch(pin, callback) {
		board.sendOneWireSearch(pin, (err, devices) => {
			this._respond('oneWireSearch', callback, err, devices);
		});
	}

	/**
	 * [One-Wire] Search for 1-wire devices on the buse in an alarmed state
	 * @param {Number} [pin] the number of the pin
	 * @param {Function} [callback] function(err, data) callback function with argument data which is an array of device identifiers
	 * @return {void}
	 */
	sendOneWireAlarmsSearch(pin, callback) {
		board.sendOneWireAlarmsSearch(pin, (err, devices) => {
			this._respond('oneWireAlarmsSearch', callback, err, devices);
		});
	}

	/**
	 * [One-Wire] Read data from a device on the bus
	 * @param {Number} [pin] the number of the pin
	 * @param {Number} [device] the device ROM id
	 * @param {Number} [length] the number of bytes to read
	 * @param {Function} [callback] function(err, data) when read is completed or an error occurs
	 * @return {void}
	 */
	sendOneWireRead(pin, device, length, callback) {
		board.sendOneWireRead(pin, device, length, (err, data) => {
			this._respond('oneWireRead', callback, err, data);
		});
	}

	/**
	 * [One-Wire] Reset all devices on the bus
	 * @param {Number} [pin] the pin which used as the 1-wire busmaster
	 * @return {void}
	 */
	sendOneWireReset(pin) {
		board.sendOneWireReset(pin);
	}

	/**
	 * [One-Wire] Write data to the bus to be receibed by the device
	 * @param {Number} [pin] the number of the pin
	 * @param {Number} [device] the device ROM id
	 * @param {Array} [data] an array of bytes to write
	 * @return {void}
	 */
	sendOneWireWrite(pin, device, data) {
		board.sendOneWireWrite(pin, device, data);
	}

	/**
	 * [One-Wire] Delay numbers of ms to tell firmata not do anything
	 * @param {Number} [bin] the number of pin
	 * @param {Number} [delay] the number of milliseconds
	 * @return {void}
	 */
	sendOneWireDelay(pin, delay) {
		board.sendOneWireDelay(pin, delay);
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
		board.sendOneWireWriteAndRead(pin, device, data, length, (err, data) => {
			this._respond('oneWireWriteAndRead', callback, err, data);
		});
	}

	/**
	 * Configure a hardware or serial port, required before serial read/write functions
	 * @param {Number} [port]
	 * @param {NUmber} [baud] (optional) the baud rate of the serial port, default is 57600
	 * @param {Number} [rxPin] (optional, SW Serial only) the RX pin of the software serial instance
	 * @param {Number} [txPin] (optional, SW Serial only) the TX pin of the software serial intance
	 * @return {void}
	 */
	serialConfig(port, baud, rxPin, txPin) {
		board.serialConfig({
			portId: port,
			baud: baud,
			rxPin: 5,
			txPin: 6
		});
	}
	
	/**
	 * Write data to the specified serial port
	 * @param {Number} [port] port ID
	 * @param {Array} [data] an array of bytes to write
	 * @return {void}
	 */
	serialWrite(port, data) {
		board.serialWrite(port, data);
	}

	/**
	 * Read data fromm the specified serial port
	 * @param {Number} [port] port ID
	 * @param {Number} [maxLength] the maximum number of bytes to read per iteration of the main Arduino loop. Default is 0 indicates that all available bytes in the buffer will be read
	 * @param {Function} [callback] function(data, port) is invoked when read is completed per iteration
	 */
	serialRead(port, maxLength = 0, callback) {
		board.serialRead(port, maxLength, (data) => {
			this._respond('serialRead', callback, null data, port);
		});
	}

	/**
	 * Stop continuous reading of the specified port
	 * @param {Number} [port] the serial port
	 * @param {Function} [callback] funtion(port) is invoked when the serial port is stopped
	 * @return {void}
	 */
	serialStop(port, callback) {
		board.serialStop(port);
		this._respond('serailStop', callback, null, port);
	}

	/**
	 * Close the specified port
	 * @param {Number} [port] the serial port
	 * @param {Function} [callback] funtion(port) is invoked when the serial port is closed
	 * @return {void}
	 */
	serialClose(port, callback) {
		board.serialClose(port);
		this._respond('serialClose', callback, null, port);
	}

	/**
	 * Flush the specified port. 
	 * For hardware serial, this waits for the transmission of outgoing serial data to complete. For software serial, this removes any buffered incoming serial data.
	 * @param {Number} [port] the serial port
	 * @param {Function} [callback] funtion(port) is invoked when the serial port is flushed
	 * @return {void}
	 */
	serialFlush(port, callback) {
		board.serialFlush(port);
		this._respond('serialFlush', callback, null, port);
	}

	/**
	 * Set the specified portto be the reading port
	 * For software serial port only, since only a single SoftwareSerial instance can read data at a time
	 * @param {Number} [port] the specified software serial port
	 * @param {Function} [callback] function(port) is invoked when setting is completed
	 * @return {void}
	 */
	serialListen(port, callback) {
		board.serialListen(port);
		this._respond('serialListen', callback, null, port);
	}

	/**
	 * Send arbitary sysex messages
	 * @param {Array} [messages] expected to be all necessary bytes between START_SYSEX and END_SYSEX (non-inclusive)
	 */
	sysexCommand(messages) {
		let encodedMsgs = board.encode(messages);
		board.sysexCommand(encodedMsgs);
	}

	/**
	 * Allow user code to handle arbitrary sysex responses
	 *
	 * @param {Number} [cmd] must be associated with some message that's expected from the slave device.
	 * @param {Function} [handler] function(data) to be invoked when values are read.The handler is called with an array of _raw_ data from the slave. Data decoding must be done within the handler itself.
	 * @return {void}
	 */
	sysexResponse(cmd, handler) {
		board.sysexResponse(cmd, handler);
	}

	/**
	 * Encode an array of 8 bit data values as two 7 bit byte pairs (each). (LSB first)
	 * @param {Array} [data] an array of 8 bit data to encode
	 */
	encode(data) {
		return Board.encode(data);
	}

	/**
	 * Decode an array of 7 bit byte pairs into a an array of 8 bit data values. (LSB first)
	 * @param {Array} [data] an array of 7 bit data to decode
	 */
	decode(data) {
		return Board.decode(data);
	}
}