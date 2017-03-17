/**
 * Utils
 * 
 */
var EventEmitter = require('events').EventEmitter,
	util = require('util');
	_ = require('lodash');

var Utils = module.exports = {

	inherits: function(child, parent) {
		util.inherits(child, parent);
	},

	checkPort: function(port) {
		return false;
	},

	getFreePort: function() {
		return 3001;
	},

	robotValidate: function(opts) {

	},

	serviceValidate: function(opts) {

	}

}