/**
 * Utils
 * 
 */
var EventEmitter = require('events').EventEmitter,
	util = require('util'),
	net = require('net'),
	_ = require('lodash');

var Utils = module.exports = {

	inherits: function(child, parent) {
		util.inherits(child, parent);
	}

}