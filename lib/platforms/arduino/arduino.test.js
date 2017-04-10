const Arduino = require('./arduino');

let arduino = new Arduino({
	name: 'Arduino',
	port: 'COM3'
});

arduino.connect((err) => {
	if (err) {
		console.log(err);
	}else {
		console.log('connected!');
	}
});

// setTimeout(() => {
// 	arduino.disconnect(() => {
// 		console.log('disconnected!');
// 	});
// }, 5000);

setInterval(() => {
	// arduino.digitalRead(13, (val, pin) => {
	// 	console.log(val, pin);
	// });
	console.log(arduino._board.pins);
}, 5000);