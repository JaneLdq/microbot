/**
 *I2C config and enable I2C
 */

const isTest = process.env.NODE_ENV == "test";

const MockI2C = class MockI2C{
	
	constructor(address,opts) {
		this.address = address;
		
		for (const name in opts){
			this[name] = opts[name];
		}
	}
	
	openSync(){
		throw new Error(
		   "MockI2C called (NODE_ENV ==='test'); has no openSync method"		
		);
	}
};

["sendByte","i2cRead","receiveByte","i2cWrite"].forEach(function(method){
	MockI2C[method] = function(){
		throw new Error(
				"MockI2C called (NODE_ENV === 'test'); has no #" + method + "method"
			);
	}
})

module.exports = isTest ? MockI2C : require("i2c-bus");