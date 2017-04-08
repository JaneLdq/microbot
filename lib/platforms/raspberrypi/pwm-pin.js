/**
 * device communicate with computer using pwm-pin
 */

const FS = require('fs'),
      EventEmitter = require('events').EventEmitter;

const BLASTER_PATH = "/dev/pi-blaster";

const PwmPin = module.exports = class PwmPin extends EventEmitter{
	
	constructor(opts) {
		super();
		//constants to set
		this.pinNum = opts.pin;
		this.ready = false;
		
	}
	
	connect(){
		FS.appendFile(BLASTER_PATH,"" + this.pinNum + "=0" + "\n",
				(err) => {
					if(err){
						this.emit("error","Eror while writing to PI-Blaster file");
					}else{
						this.emit("connect");
					}
				});
	}
	
	close(){
		FS.appendFile(BLASTER_PATH,"release " + this.pinNum + "\n",
				(err) => {
					this._releaseCallback(err);
				});
	}
	
	closeSync(){
		FS.appendFileSync(BLASTER_PATH, "release " + this.pinNum + "\n");
		this._releaseCallback(false);
	}
	
	//servo mode
	pwmWrite(duty,servo){
		if(servo == null){
			servo = false;
		}
		
		this.pbVal = (servo) ? this._servoVal(duty) : duty;
		const val = "" + this.pinNum + "=" + this.pbVal + "\n";
		
		FS.appendFile(BLASTER_PATH, val,
				(err) => {
					if(err){
						const value = this.pbVal,
						      pin = this.pinNum;
						
						this.emit("error","Error occurred while writing value " + value + " to pin " + pin);
						
					}else{
						this.emit("pwmWrite", duty);
					}
				});
	}
	
	servoWrite(duty){
		this.pwmWrite(duty,true);
	}
	
	_releaseCallback(err){
		if(err){
			this.emit("error", "Error while releasing pwm pin");
		}else{
			this.emit("release", this.pinNum);
		}
	}
	
	_servoVal(duty){
		const calc;
		calc = ((duty).toScale(0, 200) / 1000) + 0.05;
		calc = calc > 0.25 ? 0.25 : calc;
		calc = calc < 0.05 ? 0.05 : calc;
		return calc;
	}
	
	
	
};






