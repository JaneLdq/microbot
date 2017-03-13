/**
 * Utils
 * 
 */
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Utils = module.exports = {

	inherits: function(child, parent) {
		util.inherits(child, parent);
	},

	checkPort: function(port) {
		return false;
	},

	getFreePort: function() {
		return 3001;
	}

}