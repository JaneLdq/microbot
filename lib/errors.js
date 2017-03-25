/**
 * Microbot Errors
 * 
 */

/**
 * Absctract Error class
 */
const AbstractError = class AbstractError extends Error {

	constructor(msg) {
		super();
		Error.captureStackTrace(this, this.constructor);
		this.name = 'Abstract Error';
		this.message = msg || 'Error';
	}
}

/**
 * Property Missing Error class
 *
 */
const PropertyMissingError = class PropertyMissingError extends AbstractError {

	constructor(className, propertyName, detail) {
		let msg = 'Property [' + propertyName + '] is required in [' + className + ']\n';
		if (detail) {
			msg += 'Addtional Info: ' + detail + '\n';
		}
		super(msg);
		this.name = 'Property Missing Error';
	}

};

const InterfaceUnimplementedError = class UnimplementedError extends AbstractError {
	constructor(parentClass, childClass, interfaceName) {
		let msg = parentClass + '.' + interfaceName + '() not implemented in subclass [' + childClass + ']';
		super(msg);
		this.name = 'Interface Unimplemented Error';
	}
}

const MicrobotErrors = module.exports = {
	PropertyMissingError: PropertyMissingError,
	InterfaceUnimplementedError: InterfaceUnimplementedError
};