/**
 * Logger
 */

let Logger = module.exports = {
	info: function(name, message) {
		console.log('[' + name.toUpperCase() + '] ' + message);
	},

	warning: function(message) {
		console.log('[WARN]: ' + message);
	},

	error: function(message) {
		console.log('[ERROR]: ' + message);
	}
};