"use strict";

var Led = lib("drivers/gpio/led");

describe("Led", function() {
  var driver;

  beforeEach(function() {
    driver = new Led({
      name: "blinky",
      connection: { digitalWrite: spy(), pwmWrite: spy() },
      pin: 13
    });
  });

  describe("constructor", function() {
    it("sets @pin to the value of the passed pin", function() {
      expect(driver.pin).to.be.eql(13);
    });

    it("sets @isHigh to false by default", function() {
      expect(driver.isOn).to.be.false;
    });

    context("if no pin is specified", function() {
      it("throws an error", function() {
        var fn = function() { return new Led({ name: "hi" }); };
        expect(fn).to.throw("No pin specified for LED. Cannot proceed");
      });
    });
  });

  // it("has led commands", function() {
  //   for (var c in driver.commands) {
  //     expect(driver.commands[c]).to.be.a("function");
  //   }
  // });

  describe("#start", function() {
    var callback = spy();

    beforeEach(function() {
      driver.start(callback);
    });

    it("triggers the callback", function() {
      expect(callback).to.be.calledOnce;
    });
  });

  describe("#halt", function() {
    var callback = spy();

    beforeEach(function() {
      driver.halt(callback);
    });

    it("triggers the callback", function() {
      expect(callback).to.be.calledOnce;
    });
  });

  describe("#turnOn", function() {
    it("writes a high value to the pin", function() {
      driver.isHigh = false;
      driver.turnOn();

      expect(driver.isOn).to.be.true;
      expect(driver.connection.digitalWrite.calledWith(13, 1)).to.be.called;
    });
  });

  describe("#turnOff", function() {
    it("writes a high value to the pin", function() {
      driver.isHigh = true;
      driver.turnOff();

      expect(driver.isOn).to.be.false;
      expect(driver.connection.digitalWrite.calledWith(13, 0)).to.be.called;
    });
  });

  describe("#toggle", function() {
    context("when @isHigh is true", function() {
      beforeEach(function() {
        driver.isOn = true;
        stub(driver, "turnOff");
      });

      after(function() {
        driver.turnOff.restore();
      });

      it("turns the light off", function() {
        driver.toggle();
        expect(driver.turnOff).to.be.called;
      });
    });

    context("when @isHigh is false", function() {
      beforeEach(function() {
        driver.isOn = false;
        stub(driver, "turnOn");
      });

      after(function() {
        driver.turnOn.restore();
      });

      it("turns the light on", function() {
        driver.toggle();
        expect(driver.turnOn).to.be.called;
      });
    });
  });

  describe("#isOn", function() {
    it("returns the value of @isHigh", function() {
      driver.isOn = true;
      expect(driver.isOn).to.be.eql(true);

      driver.isOn = false;
      expect(driver.isOn).to.be.eql(false);
    });
  });
});
