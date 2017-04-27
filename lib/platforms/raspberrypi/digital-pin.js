/**
 * http://usejsdoc.org/
 */


const FS = require("fs"), 
      EventEmitter = require("events").EventEmitter;

const Utils = require("./utils");

const GPIO_PATH = "/sys/class/gpio";

const GPIO_READ = "in";
const GPIO_WRITE = "out";

/**
 * The DigitalPin class provides an interface with the Linux GPIO system present
 * in single-board computers such as Raspberry Pi, or Beaglebone Black.
 * 
 * @constructor DigitalPin
 * @param {Object}
 *            opts digital pin options
 * @param {String}
 *            pin which pin number to use
 * @param {String}
 *            mode which pin mode to use
 */
const DigitalPin = module.exports = class DigitalPin extends EventEmitter{
	
	constructor(opts){
		super(opts);
		this.pinNum = opts.pin.toString();
		this.status = "low";
		this.ready = false;
		this.mode = opts.mode;
	}


    connect(mode){
	    if (this.mode == null) {
		    this.mode = mode;
	}

	    FS.exists(this._pinPath(), (exists) => {
		   if (exists) {
			this._openPin();
		} else {
			this._createGPIOPin();
		}
	});
}

    close(){
	    FS.writeFile(this._unexportPath(), this.pinNum, (err) => {
		    this._closeCallback(err);
	    });
    }

    closeSync(){
        FS.writeFileSync(this._unexportPath(), this.pinNum);
        this._closeCallback(false);
        }

    digitalWrite(value){
        if (this.mode !== "w") {
            this._setMode("w");
            }

        this.status = value === 1 ? "high" : "low";

        FS.writeFile(this._valuePath(), value, (err) => {
            if (err) {
                let str = "Error occurred while writing value ";
                str += value + " to pin " + this.pinNum;

                this.emit("error", str);
                } else {
                    this.emit("digitalWrite", value);
                    }
            });

        return value;
        }

// Public: Reads the digial pin"s value periodicly on a supplied interval,
// and emits the result or an error
//
// interval - time (in milliseconds) to read from the pin at
//
// Returns the defined interval
    digitalRead(interval){
        if (this.mode !== "r") {
            this._setMode("r");
            }

        Utils.every(interval, () => {
            FS.readFile(this._valuePath(), (err, data) => {
                if (err) {
                    let error = "Error occurred while reading from pin "
                        + this.pinNum;
                    this.emit("error", error);
                    } else {
                        let readData = parseInt(data.toString(), 10);
                        this.emit("digitalRead", readData);
                        }
                });
            });
        }

    setHigh(){
        return this.digitalWrite(1);
        }

    setLow(){
        return this.digitalWrite(0);
        }

    toggle(){
        return (this.status === "low") ? this.setHigh() : this.setLow();
        }

    // Creates the GPIO file to read/write from
    _createGPIOPin(){
        FS.writeFile(this._exportPath(), this.pinNum, (err) => {
            if (err) {
                	this.emit("error", "Error while creating pin files");
                    } else {
                        	this._openPin();
                            }
            });
        }

    _openPin(){
        this._setMode(this.mode, true);
        this.emit("open");
        }

    _closeCallback(err){
        if (err) {
            	this.emit("error", "Error while closing pin files");
                } else {
                    	this.emit("close", this.pinNum);
                        }
        }

    // Sets the mode for the pin by writing the values to the pin reference files
    _setMode(mode, emitConnect){
        if (emitConnect == null) {
            emitConnect = false;
            }

        this.mode = mode;

        const data = (mode === "w") ? GPIO_WRITE : GPIO_READ;

        FS.writeFile(this._directionPath(), data, (err) => {
            this._setModeCallback(err, emitConnect);
            });
        }

    _setModeCallback(err, emitConnect){
        if (err) {
            return this.emit("error", "Setting up pin direction failed");
            }

        this.ready = true;

        if (emitConnect) {
            this.emit("connect", this.mode);
            }
        }

    _directionPath(){
        return this._pinPath() + "/direction";
        }

    _valuePath(){
        return this._pinPath() + "/value";
        }

    _pinPath(){
        return GPIO_PATH + "/gpio" + this.pinNum;
        }

    _exportPath() {
        return GPIO_PATH + "/export";
        }

    _unexportPath(){
        return GPIO_PATH + "/unexport";
        }

    };