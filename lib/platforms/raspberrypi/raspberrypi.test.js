/**
 * 
 */
const fs = require("fs");

const Raspberrypi = require('./raspberrypi');
      I2CDevice = require("./i2c-device"),
      PwmPin = require('./pwm-pin'),
      MockI2C = require("./i2c");
      DigitalPin = require('./digital-pin');
      

      let raspberrypi = new Raspberrypi({
      	name: 'Raspberrypi',
      	port: 'no need'
      });

      raspberrypi.connect();

      raspberrypi.on('connect', (err) => {
      	console.log(raspberrypi.name + ' is connected!'); 
      	testDigitalRead();
      	//testDigitalWrite();
      	// testI2CWrite();
      	// testI2CRead();
      	// testServo();
      	// testPwmWrite();
      	testSerial();
      });
      
      /* Test digital read */
      function testDigitalRead() {
      	let pin = 7;
      	raspberrypi.digitalRead(pin, (err, pin) => {
      		console.log(pin+" test digital read");
      	});
      }

      /* Test digital Write */
      function testDigitalWrite() {
      	raspberrypi.digitalWrite(7, 1,()=>{
      		console.log('pinNum:'+pinNum+"  value:"+value+"   test digital write");
      	});
      }
      
      
      /* Test i2c write*/
      function testI2CWrite() {
      	let buffer = '1100011';
      	let address = 8;
      	let cmd = 'w'
      	setInterval(() => {
      		raspberrypi.i2cWrite(address,cmd,buffer,(address,cmd,buffer)=>{
      			console.log("address:  "+address+"  test i2c write");
      		});
      	}, 1000);
      }

      /* Test i2c read*/
      function testI2CRead() {
      	let address = 8;
      	let cmd='r';
        let length = 8;
      	
      	raspberrypi.i2cRead(address, cmd,length, (err, data) => {
      		console.log('-------- I2C Read  --------');
      		console.log(data);
      		console.log('------ I2C Read End ------')
      	});
      }


      /* Test pwmWrite */
      function testPwmWrite() {
      	let ledPin = 7;
      	let angle = 0;
      	let add = true;
      	setInterval(() => {
      		raspberrypi.pwmWrite(ledPin, angle/200,(err,angle)=>{
      			console.log("angle:  "+angle  +" test pwm write");
      		});
      		if (add) {
      			angle += 2;
      			if (angle == 80) {
      				add = false;
      			}
      		} else {
      			angle -= 2;
      			if (angle == 0) {
      				add = true;
      			}
      		}
      	}, 30);
      }


      /* Test Servo */
      function testServo() {
      	let pin = 7;

      	let degree = 5;
      	raspberrypi.servoWrite(pin, 5,(err,angle)=>{
      		console.log("angle:" + angle+"  test servo write");
      	});
      	setTimeout(() => {
      		raspberrypi.servoWrite(pin, 15,(err,angle)=>{
          		console.log("angle:" + angle+"  test servo write");
          	});
      	}, 5000);
      }

 