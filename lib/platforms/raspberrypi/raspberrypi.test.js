/**
 * 
 */
const fs = require("fs");

const Raspberrypi = adaptor("raspberrypi"),
      Adaptor = lib('adaptor'),
      I2CDevice = lib("platforms/raspberrypi/i2c-device"),
      PwmPin = lib('platforms/raspberrypi/pwm-pin'),
      MockI2C = lib("platforms/raspberrypi/i2c");
      DigitalPin = lib('platforms/raspberrypi/digital-pin');
      
      
      const Arduino = require('./arduino');

      let arduino = new Arduino({
      	name: 'Arduino',
      	port: 'COM4'
      });

      arduino.connect();

      arduino.on('connect', (err) => {
      	console.log(arduino.name + ' is connected!'); 
      	// testAnalogRead();
      	// testSetNGetSamplingInterval();
      	// testI2CWrite();
      	// testI2CRead();
      	// testServo();
      	// testPwmWrite();
      	testSerial();
      });

      /* Test digital Write */
      function testDigitalReadAndWrite() {
      	arduino.digitalWrite(11, 1);
      }


      /* Test pwmWrite */
      function testPwmWrite() {
      	let ledPin = 9;
      	let val = 0;
      	let add = true;
      	setInterval(() => {
      		arduino.pwmWrite(ledPin, val/200);
      		if (add) {
      			val += 2;
      			if (val == 80) {
      				add = false;
      			}
      		} else {
      			val -= 2;
      			if (val == 0) {
      				add = true;
      			}
      		}
      	}, 30);
      }


      /* Test analog read */
      function testAnalogRead() {
      	let pot = 0;
      	arduino.analogRead(0, (err, val, pin) => {
      		console.log(val, pin);
      	});
      }

      /* Test set & get samplingInterval */
      function testSetNGetSamplingInterval() {
      	console.log('Default value before setting: ', arduino.getSamplingInterval());
      	arduino.setSamplingInterval(100);
      	console.log('After setting: ', arduino.getSamplingInterval());
      }

      /* Test i2c write*/
      function testI2CWrite() {
      	let x = 20;
      	let slaveAddress = 8;
      	setInterval(() => {
      		arduino.i2cWrite(slaveAddress, 'x is ');
      		arduino.i2cWrite(slaveAddress, x++);
      	}, 1000);
      }

      /* Test i2c read*/
      function testI2CRead() {
      	let slaveAddress = 8;
      	
      	arduino.i2cReadOnce(slaveAddress, 16, (err, data) => {
      		console.log('-------- Read Once --------');
      		console.log(data);
      		console.log('------ Read Once End ------')
      	});

      	arduino.i2cRead(slaveAddress, null, 8, (err, data) => {
      		console.log(data);
      	});
      }


      /* Test Servo */
      function testServo() {
      	let pin = 9;

      	let degree = 5;
      	arduino.servoWrite(pin, 5);
      	setTimeout(() => {
      		arduino.servoWrite(pin, 15);
      	}, 5000);
      }

      /* TODO Test Serial config */
      function testSerial() {
      	// setInterval(() => {
      	// 	arduino.serialWrite(0, 'hello, world!');
      	// }, 3000);

      	arduino.serialConfig(0x08, 4800, 10, 11);
      	arduino.serialRead(0x08, 10, (err, data, port) => {
      		console.log('Read from serial port:', port, '\nDATA:', data);
      	});

      	setTimeout(() => {
      		arduino.serialStop(0x08);
      	}, 5000);
      	arduino.on('serialStop', (port) => {
      		console.log('Serial port ' + port + ' stopped');
      	});

      	setTimeout(() => {
      		arduino.serialClose(0x08);
      	}, 8000);
      	arduino.on('serialClose', (port) => {
      		console.log('Serial port ' + port + ' closed');
      	});

      }