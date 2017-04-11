const Arduino = require('./arduino');

let arduino = new Arduino({
	name: 'Arduino',
	port: 'COM3'
});

arduino.connect();

arduino.on('connect', (err) => {
	console.log(arduino.name + ' is connected!');
	let state = 1;
	setInterval(() => {
		arduino.digitalWrite(13, (state ^= 1));
	}, 5000);
});

