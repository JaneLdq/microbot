const fs = require("fs");

const Raspberrypi = adaptor("raspberrypi"),
      Adaptor = lib('adaptor'),
      I2CDevice = lib("platforms/raspberrypi/i2c-device"),
      PwmPin = lib('platforms/raspberrypi/pwm-pin'),
      MockI2C = lib("platforms/raspberrypi/i2c");
      DigitalPin = lib('platforms/raspberrypi/digital-pin');