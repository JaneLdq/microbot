"use strict";

process.env.NODE_ENV = "test";

const path = require("path");

const chai = require("chai"),
	sinon = require("sinon");

global.chai = chai;
global.sinon = sinon;

global.should = chai.should();
global.expect = chai.expect;
global.assert = chai.assert;
global.AssertionError = chai.AssertionError;

global.spy = sinon.spy;
global.stub = sinon.stub;

// convenience function to require modules in lib directory
global.lib = function(module) {
	return require(path.normalize('./../lib/' + module));
};

global.adaptor = function(name) {
	return require(path.normalize('./../lib/platforms/' + name + '/' + name));
}
