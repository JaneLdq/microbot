/**
 * Abstract Server Class
 *
 */

/**
 * Server class
 * @constructor
 * @param {Service} [service] the service this server belongs to
 * @return {Server} a new absctract server instance
 */
const Server = module.exports = class Server {

	constructor(service) {
		this.service = service;
	}

	/**
	 * Start the server
	 * @Interface
	 */
	start() {
		throw new Error('Abstract interface start() not implemented.');
	}

	/**
	 * Close the server
	 * @interface
	 */
	close() {
		throw new Error('Abstract interface close() not implemented.');
	}
}