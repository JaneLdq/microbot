/**
 * Raspberrypi and Raspberrypi compitible boards 
 * how to communicate with software on the host computer
 */

const Adaptor = require('../../adaptor');
     // Logger = require('../../logger');

const PwmPin = require('../pwm-pin'),
      DigitalPin = require('../digital-pin'),
      I2CDevice = require('../i2c-device'),
      fs = require('fs');

const PINS = {
		3: {
			rev1: 0,
			rev2: 2,
			rev3: 2
		},
		5: {
			rev1: 1,
			rev2: 3,
			rev3: 3
		},
		7: 4,
		8: 14,
		10: 15,
		11: 17,
		12: 18,
		13: {
			rev1: 21,
			rev2: 27,
			rev3: 27
		},
		
		15: 22,
		16: 23,
		18: 24,
		19: 10,
		21: 9,
		22: 25,
		23: 11,
		24: 8,
		26: 7,
		29: { rev3: 5 },
		31: { rev3: 6 },
		32: { rev3: 12 },
		33: { rev3: 13 },
		35: { rev3: 19 },
		36: { rev3: 16 },
		37: { rev3: 26 },
		38: { rev3: 20 },
		40: { rev3: 21 }
};

const Raspberrypi = module.exports = class Raspberrypi  extends Adaptor{
	
	constructor(opts) {
		super(opts);
		// constants used to set a digital pin's valtage
		this.pins = {};
		this.pwmPins = {};
		this.i2cDevices = {};
		this.board = "";
	}
	
	commands = [
	            "pins",
	            "pinMode",
	            "firmwareName",
	            "digitalRead",
	            "digitalWrite",
	            "pwmWrite",
	            "servoWrite",
	            "i2cWrite",
	            "i2cRead"
	            ];
	
	/**
	 * Connects to the Raspberry Pi
	 *
	 * @param {Function} callback to be triggered when connected
	 * @return {void}
	 */
	
	connect(callback){
		this.proxyMethods(this.commands,this.board,this);
		const cpuinfo = this._cpuinfo();
		const revisionCode = cpuinfo.match(/Revision\s*:\s*([\da-fA-F]+)/)[1];
		const revision = parseInt(revisionCode, 16);
		
		this.bus = 1;
		
		if (revision <= 3){
			this.revision = "rev1";
			this.bus = 0;
		} else if (revision <= 15){
			this.revision = "rev2";
		} else {
			this.revision = "rev3";
		}
		
		//Logger.debug("Raspberry Pi ", this.revision, " detected.");
		callback();
	}
	
	
	/**
	 * Disconnects from the Raspberry Pi
	 *
	 * @param {Function} callback to be triggered when disconnected
	 * @return {void}
	 */
	disconnect(callback){
		//Logger.debug("Disconnecting all pins...");
		this._disconnectPins();
		//Logger.debug("Disconnecting from board '" + this.name + "'...");
		this.emit("disconnect");
		callback();
	}
	
	firmwareName(){
		return "Raspberry Pi";
	}
	
	/**
	 * Reads a value from a digital pin
	 *
	 * @param {Number} pinNum pin to read from
	 * @param {Function} callback triggered when the value has been read from the pin
	 * @return {void}
	 * @publish
	 */
	
	digitalRead(pinNum, callback){
		const pin = this.pins[this._translatePin(pinNum)];
		
		if(pin == null){
			pin = this._digitalPin(pinNum,"r");
			
			pin.on("digitalRead", (val) => {
				this.respind("digitalRead", callback, null , val, pinNum);
			});
			
			
			// We listen for the connect event to make sure the pin
		    // has been setup in Linux IO first. Once connected we
		    // trigger the digitalRead, this happens only once.
			pin.on("connect", () => {pin.digitalRead(20)});
			
			pin.connect();
		}
		
		return true;
	}
	
	/**
	 * Writes a value to a digital pin
	 *
	 * @param {Number} pinNum pin to write to
	 * @param {Number} value value to write to the pin
	 * @param {Function} callback function to invoke when done
	 * @return {void}
	 * @publish
	 */
	
	digitalWrite(pinNum,value,callback){
		const pin = this.pins[this._translatePin(pinNum)];
		
		if(pin != null){
			pin.digitalWrite(value);
		} else {
			pin = this._digitalPin(pinNum."w");
			
			pin.on("digitalWrite", (val) => {
				this.respind("digitalWrite", callback, null, val, pinNum);
			});
			
			
			// We listen for the connect event to make sure the pin
		    // has been setup in Linux IO first. Once connected we
		    // trigger the digitalWrite, this happens only once.
			
			pin.on("connect", () => {
				pin.digitalWrite(value);
			});
			
			pin.connect();
		}
		
		return value;
	}
	
	
	/**
	 * Writes an I2C value to the board.
	 *
	 * @param {Number} address I2C address to write to
	 * @param {Number} cmd I2C command to write
	 * @param {Array} buff buffered data to write
	 * @param {Function} callback function to call when done
	 * @return {void}
	 * @publish
	 */
	
	i2cWrite(address,cmd,buff,callback){
		buff = buff || [];
		
		this._i2cDevice(address).write(cmd, buff, () => {
			this.respond("i2cWrite", callback, null, address, amd, buff);
		});
	}
	
	/**
	 * Reads an I2C value from the board.
	 *
	 * @param {Number} address I2C address to write to
	 * @param {Number} cmd I2C command to write
	 * @param {Number} length amount of data to read
	 * @param {Function} callback function to call with data
	 * @return {void}
	 * @publish
	 */
	
	i2cRead(address, cmd, length, callback){
		this._i2cDevice(address).read(cmd, length, (err,data) => {
			this.respond("i2cRead", callback, err, data);
		});
	}
	
	_i2cDevice(address){
		if(this.i2cDevices[address] == null){
			this.i2cDevices[address] = new I2CDevice({
				address: address,
				bus: this.bus
			});
			this.i2cDevices[address].connect();
		}
		
		return this.i2cDevices[address];
	}
	
	
	/**
	 * Writes a PWM value to a pin
	 *
	 * @param {Number} pinNum pin to write to
	 * @param {Number} value value to write to the pin
	 * @param {Number} callback function to call when done
	 * @param {Number} type write type
	 * @return {void}
	 * @private
	 */
	
	_pwmWrite(pinNum, value, callback, type){
		const pin;
		pin = this._pwmPin(pinNum);
		type = type || "pwm";
		
		pin.on("pwmWrite",() => {
			this.respond(type + "Write", callback, null, value, pinNum);
		});
		
		if(type === "servo"){
			pin.servoWrite(value);
		} else{
			pin.pwmWrite(value);
		}
	}
	
	/**
	 * Writes a pwm value to a pin
	 *
	 * @param {Number} pinNum pin to write to
	 * @param {Number} angle angle to write to the pin
	 * @param {Number} callback function to call when done
	 * @return {void}
	 * @publish
	 */
	
	pwmWrite(pinNum, angle, callback){
		this._pwmWrite(pinNum,angle,callback,"pwm");
	}
	
	
	/**
	 * Writes a servo value to a pin
	 *
	 * @param {Number} pinNum pin to write to
	 * @param {Number} angle angle to write to the pin
	 * @param {Number} callback function to call when done
	 * @return {void}
	 * @publish
	 */
	servoWrite(pinNum, angle, callback){
		this._pwmWrite(pinNum, angle, callback, "servo");
	}
	
	_pwmPin(pinNum){
		const gpioPinNum;
		gpioPinNum = this._translatePin(pinNum);
		
		if(this.pwmPins[gpioPinNum] == null){
			this.pwmPins[gpioPinNum] = new PwmPin({
				pin: gpioPinNum
			});
		}
		
		return this.pwmPins[gpioPinNum];
	}
	
	_digitalPin(pinNum,mode){
		const gpioPinNum;
		gpioPinNum = this._translatePin(pinNum);
		
		if(this.pins[gpioPinNum] == null){
			this.pins[gpioPinNum] = new DigitalPin({
				pin: gpioPinNum,
				mode: mode
			});
		}
		
		return this.pins[gpioPinNum];
	}
	
	_translatePin(pinNum){
		const pin = PINS[pinNum];
		
		if(typeof pin === "object"){
			return pin[this.revision];
		}
		
		return pin;
	}
	
	_disconnectPins(){
		const pin;
		
		for(pin in this.pins){
			this.pins[pin].closeSync();
		}
	}
	
	_cpuinfo(){
	    return fs.readFileSync("/proc/cpuinfo", { encoding: "utf-8" });	
	}
	
};






