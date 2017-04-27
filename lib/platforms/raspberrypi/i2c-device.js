/**
 * i2c device communicate with computer
 */

const EventEmitter = require('events').EventEmitter,
      I2C = require('./i2c');

const I2CDevice = module.exports = class I2CDevice extends EventEmitter{
	
	constructor(opts) {
		super();
		//constants to set
		this.address = opts.address;
		this.bus = opts.bus || 1;
	}
	
	connect(){
		this.i2cWire = I2C.openSync(this.bus);
	}
	
	disconnect(){}
	
	write(cmd,buff,callback){
		const b = new Buffer([cmd].concat(buff));
		this.iwcWire.i2cWrite(this.address,b.length,b,callback);
	}
	
	read(cmd,length,callback){
		const b = new Buffer(length);
		this.i2cWire.readI2cBlock(this.address,cmd,length,b,
				(err,bytesRead,data) => {
			callback(err,data);
		});
	}
	
	writeByte(byte,callback){
		this.i2cWire.sendByte(this.address,byte,callback);
	}
	
	readByte(callback){
		return this.i2cWire.receiveByte(this.address,callback);
	}
};