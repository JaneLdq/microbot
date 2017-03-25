const Microbot = require('../index.js'),
	Driver = Microbot.Driver,
	Adaptor = Microbot.Adaptor;

const MyDriver = class MyDriver extends Driver {

	constructor(opts) {
		super();
		this.name = 'My Driver';
	}

	start() {
		console.log('driver start');
	}
}

let d = new MyDriver();
d.start();

const MyAdaptor = class MyAdaptor extends Adaptor {

	constructor(opts) {
		super();
		this.name = 'My Adaptor';
	}
}

let a = new MyAdaptor();
a.connect();