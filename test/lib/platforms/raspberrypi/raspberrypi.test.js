/**
 * Raspberrypi Adaptor Test based on test frameworks Mocha and Chai
 */

const fs = require("fs");

const Raspberrypi = adaptor("raspberrypi"),
      Adaptor = lib('adaptor'),
      I2CDevice = lib("platforms/raspberrypi/i2c-device"),
      PwmPin = lib('platforms/raspberrypi/pwm-pin'),
      MockI2C = lib("platforms/raspberrypi/i2c");
      DigitalPin = lib('platforms/raspberrypi/digital-pin');

describe("Adaptor.Raspberrypi", () => {
  let raspi;

  beforeEach(() => {
    raspi = new Raspberrypi({
		name: 'Raspberrypi',
		port: 'COM2'
	});
  });

  it("is an instance of Microbot.Adaptor", () => {
    expect(raspi).to.be.an.instanceOf(Raspberrypi);
    expect(raspi).to.be.an.instanceOf(Adaptor);
  });

  describe("constructor", () => {
    it("sets <board> to empty string by default", () => {
      expect(raspi.board).to.be.eql("");
    });

    it("sets <pins> to an empty object by default", () => {
      expect(raspi.pins).to.be.eql({});
    });

    it("sets <pwmPins> to an empty object by default", () => {
      expect(raspi.pwmPins).to.be.eql({});
    });

    it("sets <i2cDevices> to an empty object by default", () => {
      expect(raspi.i2cDevices).to.be.eql({});
    });
  });

  describe(".commands", () => {
    it("is an array of Raspberrypi commands", () => {
      expect(raspi.commands).to.be.an("array");

      raspi.commands.forEach(function(cmd) {
        expect(cmd).to.be.a("string");
      });
    });
  });

  describe(".connect", () => {
    let callback;

    beforeEach(() => {
      callback = spy();

      raspi.proxyMethods = spy();
      raspi._cpuinfo = stub().returns("Revision : 000e");
      raspi.connect(callback);
    });

    it("proxies methods to the board", () => {
      expect(raspi.proxyMethods.calledWith(
    	        raspi.commands,
    	        raspi.board,
    	        raspi
    	      )).to.be.ok;
    });

    it("sets <revision> based on CPU info", () => {
      expect(raspi.revision).to.be.eql("rev2");

      raspi._cpuinfo.returns("Revision : 0001");
      raspi.connect(callback);
      expect(raspi.revision).to.be.eql("rev1");

      raspi._cpuinfo.returns("Revision : 0100");
      raspi.connect(callback);
      expect(raspi.revision).to.be.eql("rev3");
    });

    it("sets <i2cInterface> based on CPU info", () => {
      expect(raspi.bus).to.be.eql(1);

      raspi._cpuinfo.returns("Revision : 0001");
      raspi.connect(callback);
      expect(raspi.bus).to.be.eql(0);
    });

    it("triggers the callback", () => {
      expect(callback).to.be.called;
    });
  });

  describe(".disconnect", () => {
    let disconnect, callback;

    beforeEach(() => {
      disconnect = spy();
      callback = spy();

      raspi.on("disconnect", disconnect);

      raspi._disconnectPins = spy();

      raspi.disconnect(callback);
    });

    it("disconnects all pins", () => {
      expect(raspi._disconnectPins).to.be.called;
    });

    it("emits 'disconnect'", () => {
      expect(disconnect).to.be.called;
    });

    it("triggers the callback", () => {
      expect(callback).to.be.called;
    });
  });

  describe(".firmwareName", () => {
    it("returns 'Raspberry Pi'", () => {
      expect(raspi.firmwareName()).to.be.eql("Raspberry Pi");
    });
  });

  describe(".digitalRead", () => {
    let pin, callback;

    beforeEach(() => {
      callback = spy();

      pin = { on: stub(), digitalRead: stub(), connect: stub() };

      raspi._digitalPin = stub().returns(pin);

      raspi.respond = spy();

      raspi.digitalRead(3, callback);
    });

    it("sets the pin to read mode", () => {
      expect(raspi._digitalPin.calledWith(3)).to.be.ok;
    });

    it("attaches a listener for 'digitalRead'", () => {
      expect(pin.on.calledWith("digitalRead")).to.be.ok;
    });

    it("attaches a listener for 'connect'", () => {
      expect(pin.on.calledWith("connect")).to.be.ok;
    });

    it("connects to the pin", () => {
      expect(pin.connect).to.be.called;
    });

    describe("when 'connect' is triggered", () => {
      beforeEach(() => {
        pin.on.withArgs("connect").yield();
      });

      it("calls .digitalRead on the pin", () => {
        expect(pin.digitalRead.calledWith(20)).to.be.ok;
      });
    });

    describe("when 'digitalRead' is triggered", () => {
      beforeEach(() => {
        pin.on.withArgs("digitalRead").yield(1);
      });

      it("responds with the pin value", () => {
        expect(raspi.respond.calledWith(
                "digitalRead",
                callback,
                null,
                1,
                3
              )).to.be.ok; 
      });
    });
  });

  describe(".digitalWrite", () => {
    let pin, callback;

    beforeEach(() => {
      callback = spy();

      pin = { on: stub(), digitalWrite: stub(), connect: stub() };

      raspi._digitalPin = stub().returns(pin);

      raspi.respond = spy();

      raspi.digitalWrite(3, 1, callback);
    });

    it("sets the pin to Write mode", () => {
      expect(raspi._digitalPin.calledWith(3)).to.be.ok;
    });

    it("attaches a listener for 'digitalWrite'", () => {
      expect(pin.on.calledWith("digitalWrite")).to.be.ok;
    });

    it("attaches a listener for 'connect'", () => {
      expect(pin.on.calledWith("connect")).to.be.ok;
    });

    it("connects to the pin", () => {
      expect(pin.connect).to.be.called;
    });

    describe("when 'connect' is triggered", () => {
      beforeEach(() => {
        pin.on.withArgs("connect").yield();
      });

      it("calls .digitalWrite on the pin", () => {
        expect(pin.digitalWrite.calledWith(1)).to.be.ok;
      });
    });

    describe("when 'digitalWrite' is triggered", () => {
      beforeEach(() => {
        pin.on.withArgs("digitalWrite").yield(1);
      });

      it("responds with the pin value", () => {
        expect(raspi.respond.calledWith(
                "digitalWrite",
                callback,
                null,
                1,
                3
              )).to.be.ok;
      });
    });
  });

  describe(".i2cWrite", () => {
    let device, callback;

    beforeEach(() => {
      callback = spy();

      device = { write: stub() };

      raspi.respond = stub();
      raspi._i2cDevice = stub().returns(device);

      raspi.i2cWrite(0x4a, "cmd", [1, 2, 3], callback);
    });

    it("writes a command and buffer to an i2c device", () => {
      expect(raspi._i2cDevice.calledWith(0x4a)).to.be.ok;
      expect(device.write.calledWith("cmd", [1, 2, 3])).to.be.ok;

      raspi.i2cWrite(0x4a, "cmd");
      expect(device.write.calledWith("cmd", [])).to.be.ok;
    });

    describe("when done writing", () => {
      beforeEach(() => {
        device.write.yield();
      });

      it("responds with the address, command, and buffer", () => {
        expect(raspi.respond.calledWith(
          "i2cWrite", callback, null, 0x4a, "cmd", [1, 2, 3]
        )).to.be.ok;
      });
    });
  });

  describe(".i2cRead", () => {
    let device, callback;

    beforeEach(() => {
      callback = spy();

      device = { read: stub() };

      raspi.respond = stub();
      raspi._i2cDevice = stub().returns(device);

      raspi.i2cRead(0x4a, "cmd", 1024, callback);
    });

    it("reads from an i2c device", () => {
      expect(raspi._i2cDevice.calledWith(0x4a)).to.be.ok;
      expect(device.read.calledWith("cmd", 1024)).to.be.ok;
    });

    describe("when done reading", () => {
      beforeEach(() => {
        device.read.yield("err", "data");
      });

      it("responds with the error and data", () => {
        expect(raspi.respond.calledWith(
          "i2cRead", callback, "err", "data"
        )).to.be.ok;
      });
    });
  });

  describe("._i2cDevice", () => {
    context("if the device already exists", () => {
      beforeEach(() => {
        raspi.i2cDevices[0x4a] = "a device";
        MockI2C.openSync = () => {};
      });

      it("returns it", () => {
        expect(raspi._i2cDevice(0x4a)).to.be.eql("a device");
      });
    });

    context("if the device doesn't exist", () => {
      it("creates a new one", () => {
        expect(raspi.i2cDevices[0x4a]).to.be.undefined;
        raspi._i2cDevice(0x4a);
        expect(raspi.i2cDevices[0x4a]).to.be.an.instanceOf(I2CDevice);
      });
    });
  });

  describe("._pwmWrite", () => {
    let pin, callback;

    beforeEach(() => {
      pin = { on: stub(), servoWrite: stub(), pwmWrite: stub() };
      callback = spy();

      raspi._pwmPin = stub().returns(pin);
      raspi.respond = stub();

      raspi._pwmWrite(10, 1, callback);
    });

    it("calls ._pwmPin to get the pin", () => {
      expect(raspi._pwmPin).to.be.called;
    });

    it("calls pin.pwmWrite with the provided value", () => {
      expect(pin.pwmWrite.calledWith(1)).to.be.ok;
    });

    context("when the 'pwmWrite' event is triggered", () => {
      beforeEach(() => {
        pin.on.withArgs("pwmWrite").yield();
      });

      it("responds with the written value", () => {
        expect(raspi.respond.calledWith(
          "pwmWrite", callback, null, 1, 10
        )).to.be.ok;
      });
    });

    context("when 'type' is 'servo'", () => {
      beforeEach(() => {
        raspi._pwmWrite(12, 0, callback, "servo");
        pin.on.withArgs("pwmWrite").yield();
      });

      it("calls pin.servoWrite", () => {
        expect(pin.servoWrite.calledWith(0)).to.be.ok;
      });

      it("responds with 'servoWrite' when done", () => {
        expect(raspi.respond.calledWith(
          "servoWrite", callback, null, 0, 12
        )).to.be.ok;
      });
    });
  });

  describe(".pwmWrite", () => {
    let callback;

    beforeEach(() => {
      callback = spy();
      raspi._pwmWrite = spy();

      raspi.pwmWrite(10, 20, callback);
    });

    it("calls ._pwmWrite", () => {
      expect(raspi._pwmWrite.calledWith(10, 20, callback, "pwm")).to.be.ok;
    });
  });

  describe(".servoWrite", () => {
    let callback;

    beforeEach(() => {
      callback = spy();
      raspi._pwmWrite = spy();

      raspi.servoWrite(10, 20, callback);
    });

    it("calls ._pwmWrite", () => {
      expect(raspi._pwmWrite.calledWith(10, 20, callback, "servo")).to.be.ok;
    });
  });

  describe("_pwmPin", () => {
    beforeEach(() => {
      raspi._translatePin = function(n) { return n + 1; };
    });

    context("if the pin is already initialized", () => {
      beforeEach(() => {
        raspi.pwmPins[7] = "pwm pin";
      });

      it("returns it", () => {
        expect(raspi._pwmPin(6)).to.be.eql("pwm pin");
      });
    });

    context("if the pin isn't initialized", () => {
      it("instantiates a PwmPin", () => {
        let pin = raspi._pwmPin(6);
        expect(pin).to.be.an.instanceOf(PwmPin);
        expect(pin).to.be.eql(raspi.pwmPins[7]);
      });
    });
  });

  describe("_digitalPin", () => {
    beforeEach(() => {
      raspi._translatePin = function(n) { return n + 1; };
    });

    context("if the pin is already initialized", () => {
      beforeEach(() => {
        raspi.pins[7] = "digital pin";
      });

      it("returns it", () => {
        expect(raspi._digitalPin(6)).to.be.eql("digital pin");
      });
    });

    context("if the pin isn't initialized", () => {
      it("instantiates a digitalPin", () => {
        const pin = raspi._digitalPin(6);
        expect(pin).to.be.an.instanceOf(DigitalPin);
        expect(pin).to.be.eql(raspi.pins[7]);
      });
    });
  });

  describe("._translatePin", () => {
    it("translates pin numbers based on board revision", () => {
      expect(raspi._translatePin(7)).to.be.eql(4);

      raspi.revision = "rev1";
      expect(raspi._translatePin(3)).to.be.eql(0);

      raspi.revision = "rev3";
      expect(raspi._translatePin(3)).to.be.eql(2);
    });
  });

  describe("_disconnectPins", () => {
    function mockPin() {
      return { closeSync: spy() };
    }

    it("closes all pins and pwmPins", () => {
      const pins = raspi.pins = [ mockPin(), mockPin(), mockPin() ];
      const pwmPins = raspi.pwmPins = [ mockPin(), mockPin(), mockPin() ];

      raspi._disconnectPins();

      pins.forEach(function(pin) {
        expect(pin.closeSync).to.be.called;
      });

      pwmPins.forEach(function(pin) {
        expect(pin.closeSync).to.be.called;
      });
    });
  });

  describe("._cpuinfo", () => {
    beforeEach(() => {
      stub(fs, "readFileSync").returns("cpu info");
    });

    afterEach(() => {
      fs.readFileSync.restore();
    });

    it("reads from /proc/cpuinfo", () => {
      const res = raspi._cpuinfo();

      expect(fs.readFileSync).to.be.called;
      expect(res).to.be.eql("cpu info");
    });
  });
});