/**
 * Arduino Adaptor Test based on test frameworks Mocha and Chai
 *
 */

const Arduino = adaptor('arduino'),
	Adaptor = lib('adaptor');

describe('Adaptor.Arduino', function() {
	let arduino;

	beforeEach(function() {
		arduino = new Arduino({
			name: 'Arduino',
			port: 'COM1'
		});
	});

	it('should inherit from Microbot.Adaptor', function() {
		expect(arduino).to.be.an.instanceOf(Adaptor);
	});
});