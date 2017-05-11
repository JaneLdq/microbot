const NodeMCU = require('./nodemcu');

let nodemcu = new NodeMCU({
	host: '192.168.1.107',
	port: 8001
});

nodemcu.connect(() => {
	console.log('hi, nodemcu!');
});

//nodemcu.mode(7, 1);
nodemcu.digitalWrite(7, 1);
setTimeout(() => {
	nodemcu.mode(7,1);
}, 2000);