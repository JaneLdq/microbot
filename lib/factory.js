/**
 * Factory is responsible for initializing the required adaptor and driver.
 *
 */
const Factory = module.exports = {

	/**
	 * Initialize an Adaptor for a connection
	 * @param {Object} [opts] options of an adaptor
	 * @param {String} [opts.adaptor] adaptor of the connection
	 * @return {Object} a required adaptor instance
	 */
	adaptor: function(opts) {
		let Adaptor = require('./platforms/' + opts.adaptor);
		return new Adaptor(opts);
	},

	/**
	 * Initialize a driver for a device
	 * @param {Object} [opts] options of a driver
	 * @param {String} [opts.driver] driver of the device
	 * @return {Object} a required driver instance
	 */
	driver: function(opts) {
		let Driver = require('./drivers/' + opts.driver);
		return new Driver(opts);
	}

}