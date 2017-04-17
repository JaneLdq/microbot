/**
 * test for digital-pin of raspberrypi
 */
const fs = require("fs");

const DigitalPin = lib("platforms/raspberrypi/digital-pin");
      Utils = lib("platforms/raspberrypi/utils");
      
describe("DigitalPin",() =>{
	const pin = new DigitalPin({ pin: "4", mode: "w" });
	
	describe("constructor",() =>{
		it("sets <pinNum> to the pin number passed in opts", () =>{
			expect(pin.pinNum).to.be.eql("4");
		});
		
		it("sets <status> to 'low' by default", () => {
		    expect(pin.status).to.be.eql("low");
		});
		
		it("sets <ready> to false by default", () => {
		    expect(pin.ready).to.be.false;
		});
		
		it("sets <mode> to the mode passed in opts", () => {
		    expect(pin.mode).to.be.eql("w");
		});
	});
	
	
	describe(".connect", () =>{
		const path = "sys/class/gpio/gpio4";
		
	    context("if the GPIO file for the pin exists", () => {
	        beforeEach(() => {
	          stub(fs, "exists").callsArgWith(1, true);
	          stub(pin, "_openPin");
	        });

	        afterEach(() => {
	          fs.exists.restore();
	          pin._openPin.restore();
	        });

	        it("opens the pin", () => {
	          pin.connect(pin.mode);
	          expect(fs.exists).to.be.calledWith(path);
	          expect(pin._openPin).to.be.called;
	        });
	      });

	      context("if the GPIO file for the pin doesn't exist", () => {
	        beforeEach(() => {
	          stub(fs, "exists").callsArgWith(1, false);
	          stub(pin, "_createGPIOPin");
	        });

	        afterEach(() => {
	          fs.exists.restore();
	          pin._createGPIOPin.restore();
	        });

	        it("creates a new GPIO pin", () => {
	          pin.connect(pin.mode);
	          expect(fs.exists).to.be.calledWith(path);
	          expect(pin._createGPIOPin).to.be.called;
	        });
	      });
	});
	
	describe(".close", () => {
		  const path = "/sys/class/gpio/unexport";

		  beforeEach(() => {
		    stub(fs, "writeFile").callsArgWith(2, false);
		    stub(pin, "_closeCallback");
		  });

		  afterEach(() => {
		    fs.writeFile.restore();
		    pin._closeCallback.restore();
		  });

		  it("writes to the GPIO unexport path with the pin's value", () => {
		    pin.close();
		    expect(fs.writeFile).to.be.calledWith(path, "4");
		  });

		  it("calls the closeCallback", () => {
		    pin.close();
		    expect(pin._closeCallback).to.be.calledWith(false);
		  });
	 });

	 describe(".closeSync", () => {
		   const path = "/sys/class/gpio/unexport";

		   beforeEach(()  =>{
		     stub(fs, "writeFileSync");
		     stub(pin, "_closeCallback");
		   });

		   afterEach(() => {
		     fs.writeFileSync.restore();
		     pin._closeCallback.restore();
		   });

		   it("writes to the GPIO unexport path with the pin's value", () => {
		     pin.closeSync();
		     expect(fs.writeFileSync).to.be.calledWith(path, "4");
		   });

		   it("calls the closeCallback", () => {
		     pin.closeSync();
		     expect(pin._closeCallback).to.be.calledWith(false);
		   });
		 });
	 
	 describe(".digitalWrite", () => {
		   const path = "/sys/class/gpio/gpio4/value";

		   context("if pin mode isn't 'w'", () => {
		     beforeEach(() => {
		       stub(fs, "writeFile");
		       stub(pin, "_setMode");
		     });

		     afterEach(() => {
		       fs.writeFile.restore();
		       pin._setMode.restore();
		     });

		     it("sets the pin mode to 'w'", () => {
		       pin.mode = "r";
		       pin.digitalWrite(1);
		       expect(pin._setMode).to.be.calledWith("w");
		     });
		   });

		   context("when successful", () => {
		       beforeEach(() => {
		           pin.mode = "w";
		           stub(fs, "writeFile").callsArgWith(2, null);
		           stub(pin, "emit");
		       });

		       afterEach(() => {
		           fs.writeFile.restore();
		           pin.emit.restore();
		        });

		   it("emits a digitalWrite event with the written value", () => {
		        pin.digitalWrite(1);
		        expect(fs.writeFile).to.be.calledWith(path, 1);
		        expect(pin.emit).to.be.calledWith("digitalWrite", 1);
		   });

		   it("returns the passed value", () => {
		        expect(pin.digitalWrite(1)).to.be.eql(1);
		   });

		   it("changes the pin's <status>", () => {
		        pin.status = "low";
		        pin.digitalWrite(1);
		        expect(pin.status).to.be.eql("high");
		    });
		   });

		    context("when there is an error", () => {
		      beforeEach(() => {
		        pin.mode = "w";
		        stub(fs, "writeFile").callsArgWith(2, true);
		        stub(pin, "emit");
		      });

		      afterEach(() => {
		        fs.writeFile.restore();
		        pin.emit.restore();
		      });

		      it("emits an error message", () => {
		        pin.digitalWrite(1);
		        expect(pin.emit).to.be.calledWith("error");
		      });
		    });
		    
		    
		    describe(".digitalRead", () => {
		        beforeEach(() => {
		          this.clock = sinon.useFakeTimers();
		        });

		        afterEach(() => {
		          this.clock.restore();
		        });

		        context("if the mode isn't 'r'", () => {
		          beforeEach(() => {
		            stub(Utils, "every");
		            stub(pin, "_setMode");
		          });

		          afterEach(() => {
		            Utils.every.restore();
		            pin._setMode.restore();
		          });

		          it("sets the pin mode to 'r'", () => {
		            pin.mode = "w";
		            pin.digitalRead(500);
		            expect(pin._setMode).to.be.calledWith("r");
		          });
		        });

		        context("when successful", () => {
		          beforeEach(() => {
		            stub(fs, "readFile").callsArgWith(1, null, 1);
		            stub(pin, "emit");
		          });

		          afterEach(() => {
		            fs.readFile.restore();
		            pin.emit.restore();
		          });

		          it("requests the pin value on the specified interval", () => {
		            pin.digitalRead(500);
		            this.clock.tick(510);

		            expect(fs.readFile).to.be.calledOnce;

		            this.clock.tick(500);
		            expect(fs.readFile).to.be.calledTwice;
		          });

		          it("emits a 'digitalRead' event with the data recieved", () => {
		            pin.digitalRead(500);
		            this.clock.tick(510);

		            expect(pin.emit).to.be.calledWith("digitalRead", 1);
		          });
		        });

		        context("when an error occurs", () => {
		          beforeEach(() => {
		            stub(fs, "readFile").callsArgWith(1, true, null);
		            stub(pin, "emit");
		          });

		          afterEach(() => {
		            fs.readFile.restore();
		            pin.emit.restore();
		          });

		          it("emits an error message", () => {
		            pin.digitalRead(500);
		            this.clock.tick(500);

		            expect(pin.emit).to.be.calledWith("error");
		          });
		        });
		      });
		    
		    
		  });

	  describe(".setHigh", () => {
		    beforeEach(() => {
		      stub(pin, "digitalWrite");
		    });

		    afterEach(() => {
		      pin.digitalWrite.restore();
		    });

		    it("calls .digitalWrite with a value of 1", () => {
		      pin.setHigh();
		      expect(pin.digitalWrite).to.be.calledWith(1);
		    });
		  });

		  describe(".setLow", () => {
		    beforeEach(() => {
		      stub(pin, "digitalWrite");
		    });

		    afterEach(() => {
		      pin.digitalWrite.restore();
		    });

		    it("calls .digitalWrite with a value of 0", () => {
		      pin.setLow();
		      expect(pin.digitalWrite).to.be.calledWith(0);
		    });
		  });

		  describe(".toggle", () => {
		    context("when <status> is 'high'", () => {
		      beforeEach(() => {
		        stub(pin, "setLow");
		        pin.status = "high";
		      });

		      afterEach(() => {
		        pin.setLow.restore();
		      });

		      it("calls .setLow", () => {
		        pin.toggle();
		        expect(pin.setLow).to.be.called;
		      });
		    });

		    context("when <status> is 'low'", () => {
		      beforeEach(() => {
		        stub(pin, "setHigh");
		        pin.status = "low";
		      });

		      afterEach(() => {
		        pin.setHigh.restore();
		      });

		      it("calls .setHigh", () => {
		        pin.toggle();
		        expect(pin.setHigh).to.be.called;
		      });
		    });
		  });

		  describe("._createGPIOPin", () => {
		    const path = "/sys/class/gpio/export";

		    context("when successful", () => {
		      beforeEach(() => {
		        stub(fs, "writeFile").callsArgWith(2, null);
		        stub(pin, "_openPin");
		      });

		      afterEach(() => {
		        fs.writeFile.restore();
		        pin._openPin.restore();
		      });

		      it("writes the pin number to the GPIO export path", () => {
		        pin._createGPIOPin();
		        expect(fs.writeFile).to.be.calledWith(path, "4");
		      });

		      it("calls ._openPin", () => {
		        pin._createGPIOPin();
		        expect(pin._openPin).to.be.called;
		      });
		    });

		    context("when an error occurs", () => {
		      beforeEach(() => {
		        stub(fs, "writeFile").callsArgWith(2, true);
		        stub(pin, "emit");
		      });

		      afterEach(() => {
		        fs.writeFile.restore();
		        pin.emit.restore();
		      });

		      it("emits an error", () => {
		        pin._createGPIOPin();
		        expect(pin.emit).to.be.calledWith("error");
		      });
		    });
		  });

		  describe("._openPin", () => {
		    beforeEach(() => {
		      stub(pin, "_setMode");
		      stub(pin, "emit");
		    });

		    afterEach(() => {
		      pin._setMode.restore();
		      pin.emit.restore();
		    });

		    it("sets the pin's mode", () => {
		      pin._openPin();
		      expect(pin._setMode).to.be.calledWith(pin.mode);
		    });

		    it("emits the 'open' event", () => {
		      pin._openPin();
		      expect(pin.emit).to.be.calledWith("open");
		    });
		  });

		  describe("_closeCallback", () => {
		    context("if there is an error", () => {
		      beforeEach(() => {
		        stub(pin, "emit");
		        pin._closeCallback(true);
		      });

		      afterEach(() => {
		        pin.emit.restore();
		      });

		      it("emits an error", () => {
		        expect(pin.emit).to.be.calledWith("error");
		      });
		    });

		    context("if there is no error", () => {
		      beforeEach(() => {
		        stub(pin, "emit");
		        pin._closeCallback(false);
		      });

		      afterEach(() => {
		        pin.emit.restore();
		      });

		      it("emits a 'close' event with the pin number", () => {
		        expect(pin.emit).to.be.calledWith("close", "4");
		      });
		    });
		  });

		  describe("._setMode", () => {
		    const path = "/sys/class/gpio/gpio4/direction";

		    beforeEach(() => {
		      stub(fs, "writeFile").callsArgWith(2, "error");
		      stub(pin, "_setModeCallback");
		    });

		    afterEach(() => {
		      fs.writeFile.restore();
		      pin._setModeCallback.restore();
		    });

		    context("when mode is 'w'", () => {
		      it("writes to the pin's direction path with 'out'", () => {
		        pin._setMode("w");
		        expect(fs.writeFile).to.be.calledWith(path, "out");
		      });

		      it("calls ._setModeCallback with any error message", () => {
		        pin._setMode("w", true);
		        expect(pin._setModeCallback).to.be.calledWith("error", true);
		      });
		    });

		    context("when mode is 'r'", () => {
		      it("writes to the pin's direction path with 'in'", () => {
		        pin._setMode("r");
		        expect(fs.writeFile).to.be.calledWith(path, "in");
		      });
		    });
		  });

		  describe("._setModeCallback", () => {
		    beforeEach(() => {
		      stub(pin, "emit");
		    });

		    afterEach(() => {
		      pin.emit.restore();
		    });

		    context("when successful", () => {
		      it("sets <ready> to true", () => {
		        pin.ready = false;
		        pin._setModeCallback(false);
		        expect(pin.ready).to.be.eql(true);
		      });

		      context("when emitConnect is true", () => {
		        it("emits a 'connect' event with the pin's mode", () => {
		          pin._setModeCallback(false, true);
		          expect(pin.emit).to.be.calledWith("connect", pin.mode);
		        });
		      });
		    });

		    context("when passed an error", () => {
		      it("emits an error", () => {
		        pin._setModeCallback(true);
		        expect(pin.emit).to.be.calledWith("error");
		      });
		    });
		  });

		  describe("._pinPath", () => {
		    const path = "/sys/class/gpio/gpio4";

		    it("returns the path to the GPIO pin", () => {
		      expect(pin._pinPath()).to.be.eql(path);
		    });
		  });

		  describe("._directionPath", () => {
		    const path = "/sys/class/gpio/gpio4/direction";

		    it("returns the path to the GPIO pin's direction file", () => {
		      expect(pin._directionPath()).to.be.eql(path);
		    });
		  });

		  describe("._valuePath", () => {
		    const path = "/sys/class/gpio/gpio4/value";

		    it("returns the path to the GPIO pin's value file", () => {
		      expect(pin._valuePath()).to.be.eql(path);
		    });
		  });

		  describe("._exportPath", () => {
		    const path = "/sys/class/gpio/export";

		    it("returns the GPIO export path", () => {
		      expect(pin._exportPath()).to.be.eql(path);
		    });
		  });

		  describe("._unexportPath", () => {
		    const path = "/sys/class/gpio/unexport";

		    it("returns the GPIO unexport path", () => {
		      expect(pin._unexportPath()).to.be.eql(path);
		    });
		  });
});





