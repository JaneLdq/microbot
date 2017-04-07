/**
 * Arduino Adaptor Test based on test frameworks Mocha and Chai
 *
 */

const Arduino = adaptor('arduino'),
	Adaptor = lib('adaptor'),
	Firmata = require('firmata'),
	MError = lib('errors');

describe('Adaptor.Arduino', () => {
	let arduino;

	beforeEach(() => {
		arduino = new Arduino({
			name: 'Arduino',
			port: 'COM3'
		});
	});

	it('should inherit from Microbot.Adaptor', () => {
		expect(arduino).to.be.an.instanceOf(Adaptor);
	});

	describe('constructor', () => {
		it('sets <i2cReady> to false by default', () => {
			expect(arduino.i2cReady).to.be.eql(false);
		});

		context('if no port is specified', () => {
			it('throws an error', () => {
				let fn = () => { return new Arduino({name: 'Noport'}); };
				expect(fn).to.throw();
			});
		});
	});

	describe('.connect', () => {
		let callback;
		beforeEach(() => {
			callback = spy();
			stub(arduino, 'emit');
			arduino.connect(callback);
		});
		it('sets <_board> to an instance of Firmata.Board', () => {
			expect(arduino._board).to.be.an.instanceOf(Firmata.Board);
		});
		it('invokes the callback when the board is connected', () => {
			expect(callback).to.be.called;
		});
		it('emits "error" when error occurs while connecting the board', () => {
			expect(arduino.emit.calledWith('error')).to.be.called;
		});
	});

	describe('.disconnect', () => {
		let callback;
		beforeEach(() => {
			arduino._board = { reset: spy() };
			callback = spy();
			stub(arduino, 'emit');
			arduino.disconnect(callback);
		});

		it('invokes the callback when the board is disconnected', () => {
			expect(callback).to.be.called;
		});

		it('emits "disconnect" when the board is disconnected', () => {
			expect(arduino.emit.calledWith('disconnect')).to.be.ok;
		});
	});

	describe('.digitalRead', () => {
		let callback;

		beforeEach(() => {
			callback = spy();
			arduino._board = {
				pinMode: spy(),
				digitalRead: stub().callsArgWith(1, 1),
				MODES: { INPUT: 'r'}
			};
			stub(arduino, 'emit');
			arduino.digitalRead(2, callback);
		});

		it('sets the pin mode of a specified pin', () => {
			expect(arduino._board.pinMode.calledWith(2, 'r')).to.be.called;
		});

		it('invokes the callback with the data read from board and the pin number', () => {
			expect(arduino._board.digitalRead.calledWith(2)).to.be.ok;
			expect(callback.calledWith(null, 1, 2)).to.be.ok;
		});

		it('emits "digitalRead" when read is finished', () => {
			expect(arduino.emit.calledWith('digitalRead', 1, 2)).to.be.called;
		});
	});

	describe('.digitalWrite', () => {
		beforeEach(() => {
			arduino._board = {
				pinMode: spy(),
				digitalWrite: spy(),
				MODES: { OUTPUT: 'w'}
			};
			arduino.digitalWrite(3, 1);
		});

		it('sets the pin mode of a specified pin', () => {
			expect(arduino._board.pinMode.calledWith(3, 'w')).to.be.called;
		});

		it('write digital value to the specified pin', () => {
			expect(arduino._board.digitalWrite.calledWith(3, 1)).to.be.ok;
		});
	});

	describe('.analogRead', () => {
		let callback;
		beforeEach(() => {
			callback = spy();
			arduino._board = {
				pinMode: spy(),
				analogRead: stub().callsArgWith(1, 123),
				MODES: { ANALOG: 'a'}
			};
			stub(arduino, 'emit');
			arduino.analogRead(1, callback);
		});

		it('reads from the specified pin and invokes the callback with analog value and pin number', () => {
			expect(arduino._board.analogRead.calledWith(1)).to.be.ok;
			expect(callback.calledWith(null, 123, 1)).to.be.ok;
		});

		it('emits "analogRead" when read is finished', () => {
				expect(arduino.emit.calledWith('analogRead', 123, 1)).to.be.called;
		});
	});

	describe('.analogWrite', () => {
		beforeEach(() => {
			arduino._board = {
				pinMode: spy(),
				analogWrite: spy(),
				analogPins: { a1: 3 },
				MODES: { ANALOG: 'a'}
			};
			arduino.analogWrite('a1', 0.2);
		});

		it('sets the pin mode of a specified pin', () => {
			expect(arduino._board.pinMode.calledWith(3, 'a')).to.be.ok;
		});

		it('write analog value to the specified pin', () => {
			expect(arduino._board.analogWrite.calledWith(3, 51)).to.be.ok;
		});
	});

	describe('.setSamplingInterval', () => {
		let callback;

		beforeEach(() => {
			callback = spy();
			stub(arduino, 'emit');
			arduino._board = {
				setSamplingInterval: spy()
			};
			arduino.setSamplingInterval(20);
		});

		it('sets the sampling interval of the board', () => {
			expect(arduino._board.setSamplingInterval.calledWith(20)).to.be.ok;
		});

		it('invokes the callback when the interval is set', () => {
			expect(callback).to.be.called;
		});

		it('emits "setInterval" when the interval is set ', () => {
			expect(arduino.emit.calledWith('setInterval', 20)).to.be.ok;
		});
	});

	describe('.getSamplingInterval', () => {
		beforeEach(() => {
			arduino._board = {
				getSamplingInterval: stub().returns(19)
			};
		});

		it('gets the sampling interval of the board', () => {
			let interval = arduino.getSamplingInterval();
			expect(arduino._board.getSamplingInterval).to.be.called;
			expect(interval).to.be.eql(19);
		});
	});

	describe('.servoWrite', () => {
		beforeEach(() => {
			arduino._board = {
				pinMode: spy(),
				servoWrite: spy(),
				MODES:{ SERVO: 's' }
			}
			arduino.servoWrite(2, 0.5);
		});

		it('sets the pin mode to servo', () => {
			expect(arduino._board.pinMode.calledWith(2, 's')).to.be.ok;
		});

		it('write the degree to the servo pin', () => {
			expect(arduino._board.servoWrite.calledWith(2, 90)).to.be.ok;
		});
	});

	describe('.servoConfig', () => {
		beforeEach(() => {
			arduino._board = {
				servoConfig: spy()
			};
			arduino.servoConfig(2, 7800, 10000);
		});

		it('sets up a servo with a specific min and max pulse', () => {
			expect(arduino._board.servoConfig.calledWith(2, 7800, 10000)).to.be.ok;
		});
	});

	describe('.i2cConfig', () => {
		beforeEach(() => {
			arduino._board = {
				i2cConfig: spy()
			};
			arduino.i2cConfig(1000);
		});

		it('sets delay value of i2c read', () => {
			expect(arduino._board.i2cConfig.calledWith(1000)).to.be.ok;
		});
	});

	describe('.i2cRead', () => {
		let callback;
		let data = ['A', 'B', 'C'];
		beforeEach(() => {
			callback = spy();
			arduino._board = {
				i2cConfig: spy(),
				i2cRead: stub().callsArgWith(3, data)
			};
			stub(arduino, 'emit');
			arduino.i2cRead('address', 'register', 3, callback);
		});

		context('when i2c is not configured', () => {
			it('configues i2c with default values and set i2cReady true', () => {
				expect(arduino.i2cReady).to.be.ok;
				expect(arduino._board.i2cConfig.calledWith(2000)).to.be.ok;
			});

			it('calls _board.i2cRead to read specified number of bytes', () => {
				expect(arduino._board.i2cRead.calledWith('address', 'register')).to.be.ok;
			});

			it('calls the callback with specified length of bytes', () => {
				expect(callback.calledWith(null, data)).to.be.ok;
			});

			it('emits "i2cRead" when read is finished', () => {
				expect(arduino.emit.calledWith('i2cRead', data)).to.be.called;
			});
		});

		context('when i2c is configured', () => {
			beforeEach(() => {
				arduino.i2cReady = true;
				arduino.i2cConfig = spy();
			});
			it('calls _board.i2cRead to read specified number of bytes without calling i2cConfig', () => {
				expect(arduino.i2cConfig).not.to.be.called;
			});
		});
	});

	describe('.i2cReadOnce', () => {
		let callback;
		let data = ['A', 'B', 'C'];
		beforeEach(() => {
			callback = spy();
			arduino._board = {
				i2cConfig: spy(),
				i2cReadOnce: stub().callsArgWith(2, data)
			};
			stub(arduino, 'emit');
			arduino.i2cReadOnce('address', 3, callback);
		});

		context('when i2c is not configured', () => {
			it('configues i2c with default values and set i2cReady true', () => {
				expect(arduino.i2cReady).to.be.ok;
				expect(arduino._board.i2cConfig.calledWith(2000)).to.be.ok;
			});

			it('calls _board.i2cRead to read specified number of bytes', () => {
				expect(arduino._board.i2cReadOnce.calledWith('address', 3)).to.be.ok;
			});

			it('calls the callback with specified length of bytes', () => {
				expect(callback.calledWith(null, data)).to.be.ok;
			});

			it('emits "i2cReadOnce" when read is finished', () => {
				expect(arduino.emit.calledWith('i2cReadOnce', data)).to.be.called;
			});
		});

		context('when i2c is configured', () => {
			beforeEach(() => {
				arduino.i2cReady = true;
				arduino.i2cConfig = spy();
			});
			it('calls _board.i2cRead to read specified number of bytes without calling i2cConfig', () => {
				expect(arduino.i2cConfig).not.to.be.called;
			});
		});
	});

	describe('.i2cWrite', () => {
		beforeEach(() => {
			arduino._board = {
				i2cConfig: spy(),
				i2cWrite: spy()
			};
			arduino.i2cWrite('address', 'register', ['a', 'b', 'c']);
		});

		context('when i2c is not configured', () => {
			it('configues i2c with default values and set i2cReady true', () => {
				expect(arduino.i2cReady).to.be.ok;
				expect(arduino._board.i2cConfig.calledWith(2000)).to.be.ok;
			});

			it('calls _board.i2cWrite to read specified number of bytes', () => {
				expect(arduino._board.i2cWrite.calledWith('address', 'register', ['a', 'b', 'c'])).to.be.ok;
			});

		});

		context('when i2c is configured', () => {
			beforeEach(() => {
				arduino.i2cReady = true;
				arduino.i2cConfig = spy();
			});
			it('calls _board.i2cWrite to read specified number of bytes without calling i2cConfig', () => {
				expect(arduino.i2cConfig).not.to.be.called;
			});
		});
	});

	describe('.sendOneWireConfig', () => {
		beforeEach(() => {
			arduino._board = {
				sendOneWireConfig: spy()
			};
			arduino.sendOneWireConfig(3, true);
		});

		it('calls _board.sendOneWireConfig with pin number and value of enablePower', () => {
			expect(arduino._board.sendOneWireConfig.calledWith(3,true)).to.be.ok;
		});
	});

	describe('.sendOneWireSearch', () => {
		let callback;
		let devices = [[40, 234, 57, 176, 6, 0, 0, 207]];

		beforeEach(() => {
			callback = spy();
			stub(arduino, 'emit');
		});

		context('when non error occurs while searching', () => {
			beforeEach(() => {
				arduino._board = {
					sendOneWireSearch: stub().callsArgWith(1, null, devices)
				};
				arduino.sendOneWireSearch(3, callback);
			});

			it('calls _board.sendOneWireSearch', () => {
				expect(arduino._board.sendOneWireSearch.calledWith(3)).to.be.ok;
			});

			it('invokes the callback when get search data', () => {
				expect(callback.calledWith(null, devices)).to.be.ok;
			});

			it('emits "oneWireSearch" when search is completed', () => {
				expect(arduino.emit.calledWith('oneWireSearch', devices)).to.be.called;
			});
		});

		context('when error occurs while searching', () => {
			let error = new Error('1-Wire device search timeout - are you running ConfigurableFirmata?');
			beforeEach(() => {
				arduino._board = {
					sendOneWireSearch: stub().callsArgWith(1, error)
				};
				arduino.sendOneWireSearch(3, callback);
			});

			it('calls _board.sendOneWireSearch', () => {
				expect(arduino._board.sendOneWireSearch.calledWith(3)).to.be.ok;
			});

			it('invokes the callback when error occurs with the error', () => {
				expect(callback.calledWith(error)).to.be.ok;
			});

			it('emits "error" when error occurs', () => {
				expect(arduino.emit.calledWith('error', error)).to.be.called;
			});
		});
	});

	describe('.sendOneWireAlarmsSearch', () => {
		let callback,
			devices = [[40, 234, 57, 176, 6, 0, 0, 207]];

		beforeEach(() => {
			callback = spy();
			stub(arduino, 'emit');
		});

		context('when non error occurs while alarm searching', () => {
			beforeEach(() => {
				arduino._board = {
					sendOneWireAlarmsSearch: stub().callsArgWith(1, null, devices)
				};
				arduino.sendOneWireAlarmsSearch(3, callback);
			});

			it('calls _board.sendOneWireAlarmsSearch', () => {
				expect(arduino._board.sendOneWireAlarmsSearch.calledWith(3)).to.be.ok;
			});

			it('invokes the callback when get alarm search data', () => {
				expect(callback.calledWith(null, devices)).to.be.ok;
			});

			it('emits "oneWireAlarmsSearch" when alarm search is completed', () => {
				expect(arduino.emit.calledWith('oneWireAlarmsSearch', devices)).to.be.called;
			});
		});

		context('when error occurs while alarm searching', () => {
			let error = new Error('1-Wire device search timeout - are you running ConfigurableFirmata?');
			beforeEach(() => {
				arduino._board = {
					sendOneWireAlarmsSearch: stub().callsArgWith(1, error)
				};
				arduino.sendOneWireAlarmsSearch(3, callback);
			});

			it('calls _board.sendOneWireConfig', () => {
				expect(arduino._board.sendOneWireAlarmsSearch.calledWith(3)).to.be.ok;
			});

			it('invokes the callback when error occurs with the error', () => {
				expect(callback.calledWith(error)).to.be.ok;
			});

			it('emits "error" when error occurs', () => {
				expect(arduino.emit.calledWith('error', error)).to.be.called;
			});
		});
	});

	describe('.sendOneWireRead', () => {
		let callback,
			data = [135, 1, 75, 70, 127, 255, 9, 16, 72];
		beforeEach(() => {
			callback = spy();
			stub(arduino, 'emit');
		});

		context('when no error occurs while reading', () => {
			beforeEach(() => {
				arduino._board = {
					sendOneWireRead: stub().callsArgWith(3, null, data)
				};
				arduino.sendOneWireRead(1, 1, 128, callback);
			});

			it('calls _board.sendOneWireRead', () => {
				expect(arduino._board.sendOneWireRead).to.be.called;
			});

			it('invokes the callback when data is read', () => {
				expect(callback.calledWith(null, data)).to.be.ok;
			});

			it('emits "oneWireRead" when read is completed', () => {
				expect(arduino.emit.calledWith('oneWireRead', data)).to.be.ok;
			});
		});

		context('when no error occurs while reading', () => {
			let error = new Error("1-Wire device read timeout - are you running ConfigurableFirmata?");
			beforeEach(() => {
				arduino._board = {
					sendOneWireRead: stub().callsArgWith(3, error)
				};
				arduino.sendOneWireRead(1, 1, 128, callback);
			});

			it('calls _board.sendOneWireRead', () => {
				expect(arduino._board.sendOneWireRead).to.be.called;
			});

			it('invokes the callback when error occurs', () => {
				expect(callback.calledWith(error)).to.be.ok;
			});

			it('emits "error" when error occurs', () => {
				expect(arduino.emit.calledWith('error', error)).to.be.ok;
			});
		});
	});

	describe('.sendOneWireReset', () => {
		beforeEach(() => {
			arduino._board = {
				sendOneWireReset: spy()
			};
			arduino.sendOneWireReset(1);
		});

		it('calls _board.sendOneWireReset with pin number', () => {
			expect(arduino._board.sendOneWireReset.calledWith(1)).to.be.ok;
		});
	});

	describe('.sendOneWireWrite', () => {
		let data = [135, 1, 75, 70, 127, 255, 9, 16, 72];
		beforeEach(() => {
			arduino._board = {
				sendOneWireWrite: spy()
			};
			arduino.sendOneWireWrite(1, 1, data);
		});

		it('calls _board.sendOneWireWrite with pin, device and data', () => {
			expect(arduino._board.sendOneWireWrite.calledWith(1, 1, data)).to.be.ok;
		});
	});

	describe('.sendOneWireDelay', () => {
		beforeEach(() => {
			arduino._board = {
				sendOneWireDelay: spy()
			};
			arduino.sendOneWireDelay(1, 2000);
		});

		it('calls _board.sendOneWireDelay with pin number and delay', () => {
			expect(arduino._board.sendOneWireDelay.calledWith(1, 2000)).to.be.ok;
		});
	});

	describe('.sendOneWireWriteAndRead', () => {
		let callback,
			data = [135, 1, 75, 70, 127, 255, 9, 16, 72];
		beforeEach(() => {
			callback = spy();
			stub(arduino, 'emit');
		});

		context('when no error occurs while writing and reading', () => {
			beforeEach(() => {
				arduino._board = {
					sendOneWireWriteAndRead: stub().callsArgWith(4, null, data)
				};
				arduino.sendOneWireWriteAndRead(1, 1, data, 128, callback);
			});

			it('calls _board.sendOneWireWriteAndRead', () => {
				expect(arduino._board.sendOneWireWriteAndRead).to.be.called;
			});

			it('invokes the callback when data is read', () => {
				expect(callback.calledWith(null, data)).to.be.ok;
			});

			it('emits "sendOneWireWriteAndRead" when write and read is completed', () => {
				expect(arduino.emit.calledWith('oneWireWriteAndRead', data)).to.be.ok;
			});
		});

		context('when no error occurs while reading', () => {
			let error = new Error("1-Wire device read timeout - are you running ConfigurableFirmata?");
			beforeEach(() => {
				arduino._board = {
					sendOneWireWriteAndRead: stub().callsArgWith(4, error)
				};
				arduino.sendOneWireWriteAndRead(1, 1, data, 128, callback);
			});

			it('calls _board.sendOneWireWriteAndRead', () => {
				expect(arduino._board.sendOneWireWriteAndRead).to.be.called;
			});

			it('invokes the callback when error occurs', () => {
				expect(callback.calledWith(error)).to.be.ok;
			});

			it('emits "error" when error occurs', () => {
				expect(arduino.emit.calledWith('error', error)).to.be.ok;
			});
		});
	});

	describe('.serialConfig', () => {
		beforeEach(() => {
			arduino._board = {
				serialConfig: spy()
			};
			arduino.serialConfig(1, 57600);
		});
		it('calls _board.serialConfig with configured values', () => {
			expect(arduino._board.serialConfig.calledWith({portId: 1, baud: 57600, rxPin: 5, txPin:6})).to.be.ok;
		});
	});

	describe('.serialWrite', () => {
		let data = [135, 1, 75, 70, 127, 255, 9, 16, 72];
		beforeEach(() => {
			arduino._board = {
				serialWrite: spy()
			};
			arduino.serialWrite(1, data);
		});

		it('calls _board.serialWrite with port id and data', () => {
			expect(arduino._board.serialWrite.calledWith(1, data)).to.be.ok;
		});
	});

	describe('.serialRead', () => {
		let data = [135, 1, 75, 70, 127, 255, 9, 16, 72];
		let callback;
		beforeEach(() => {
			callback = spy();
			arduino._board = {
				serialRead: stub().callsArgWith(2, data)
			};
			stub(arduino, 'emit');
			arduino.serialRead(1, 128, callback);
		});

		it('calls _board.serialRead with port id and max length to read', () => {
			expect(arduino._board.serialRead.calledWith(1, 128)).to.be.ok;
		});

		it('invokes the callback when read is completed', () => {
			expect(callback.calledWith(null, data, 1)).to.be.ok;
		});

		it('emits "serialRead" when read is completed', () => {
			expect(arduino.emit.calledWith('serialRead', data, 1)).to.be.ok;
		});
	});

	describe('.serialStop', () => {
		let callback;
		beforeEach(() => {
			callback = spy();
			arduino._board = {
				serialStop: spy()
			};
			stub(arduino, 'emit');
			arduino.serialStop(1, callback);
		});

		it('calls _board.serialStop with port id', () => {
			expect(arduino._board.serialStop.calledWith(1)).to.be.ok;
		});

		it('invokes the callback when stopped', () => {
			expect(callback.calledWith(null, 1)).to.be.ok;
		});

		it('emits "serialStop" when stopped', () => {
			expect(arduino.emit.calledWith('serialStop', 1)).to.be.ok;
		});
	});

	describe('.serialClose', () => {
		let callback;
		beforeEach(() => {
			callback = spy();
			arduino._board = {
				serialClose: spy()
			};
			stub(arduino, 'emit');
			arduino.serialClose(1, callback);
		});

		it('calls _board.serialClose with port id', () => {
			expect(arduino._board.serialClose.calledWith(1)).to.be.ok;
		});

		it('invokes the callback when closed', () => {
			expect(callback.calledWith(null, 1)).to.be.ok;
		});

		it('emits "serialClose" when closed', () => {
			expect(arduino.emit.calledWith('serialClose', 1)).to.be.ok;
		});
	});

	describe('.serialFlush', () => {
		let callback;
		beforeEach(() => {
			callback = spy();
			arduino._board = {
				serialFlush: spy()
			};
			stub(arduino, 'emit');
			arduino.serialFlush(1, callback);
		});

		it('calls _board.serialFlush with port id', () => {
			expect(arduino._board.serialFlush.calledWith(1)).to.be.ok;
		});

		it('invokes the callback when flushed', () => {
			expect(callback.calledWith(null, 1)).to.be.ok;
		});

		it('emits "serialFlush" when flushed', () => {
			expect(arduino.emit.calledWith('serialFlush', 1)).to.be.ok;
		});
	});

	describe('.serialListen', () => {
		let callback;
		beforeEach(() => {
			callback = spy();
			arduino._board = {
				serialListen: spy()
			};
			stub(arduino, 'emit');
			arduino.serialListen(1, callback);
		});

		it('calls _board.serialListen with port id', () => {
			expect(arduino._board.serialListen.calledWith(1)).to.be.ok;
		});

		it('invokes the callback when listening', () => {
			expect(callback.calledWith(null, 1)).to.be.ok;
		});

		it('emits "serialListen" when listening', () => {
			expect(arduino.emit.calledWith('serialListen', 1)).to.be.ok;
		});
	});
});