/**
 * Microbot Errors
 * 
 */
var util = require('util');

/**
 * Absctract Error class
 */
var AbstractError = function AbstractError(msg, constr) {
  Error.captureStackTrace(this, constr || this);
  this.message = msg || 'Error';
}
util.inherits(AbstractError, Error);
AbstractError.prototype.name = 'Abstract Error';

/**
 * Option Missing Error class
 *
 */
var PropertyMissingError = function PropertyMissingError(className, propertyName, detail) {
	var msg = 'Property [' + propertyName + '] is required in [' + className + ']\n';
	if (detail) {
		msg += 'Addtional Info: ' + detail + '\n';
	}
	PropertyMissingError.super_.call(this, msg, this.constructor);
};
util.inherits(PropertyMissingError, AbstractError);
AbstractError.prototype.name = 'Property Missing Error';


var MicrobotErrors = module.exports = {
	PropertyMissingError: PropertyMissingError,
};