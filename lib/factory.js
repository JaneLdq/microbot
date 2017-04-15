/**
 * Factory is responsible for initializing the required adaptor and driver.
 *
 */

const _ = require('lodash');

const Factory = module.exports = {

	drivers: {},

	/**
	 * Initialize an Adaptor for a connection
	 * @param {Object} [opts] options of an adaptor
	 * @param {String} [opts.adaptor] adaptor of the connection
	 * @return {Object} a required adaptor instance
	 */
	adaptor: function(opts) {
		let Adaptor;
		if (opts.adaptor === 'stub') {
			Adaptor = require('./platforms/stub');
		} else {
			Adaptor = require('./platforms/' + opts.adaptor + '/' + opts.adaptor);
		}
		_.forEach(Adaptor.dependencies, (val) => {
			try {
				let mod = require('./drivers/' + val);
				this.drivers[val] = mod;
			} catch(err) {
				let msg = 'Required dependencies ' + val + ' for adaptor ' + opts.adaptor + ' not found';
				throw new Error(msg);
			}
		});
		return new Adaptor(opts);
	},

	/**
	 * Initialize a driver for a device
	 * @param {Object} [opts] options of a driver
	 * @param {String} [opts.driver] driver of the device
	 * @return {Object} a required driver instance
	 */
	driver: function(opts) {
		let Driver;
		try {
			Driver = require('./drivers/' + opts.driver);
		}
		catch(err) {
			if (!Driver) {
				_.forEach(this.drivers, (mod, key) => {
					// TODO
					if (key == opts.driver) {
						Driver = new mod(opts);
						return;
					}
					if (mod.drivers) {
						Driver = mod.drivers[opts.driver];
						return;
					}
				});
			}
			if (!Driver) {
				throw new Error('Required driver not found!');
			}
		}
		return new Driver(opts);
	}

}