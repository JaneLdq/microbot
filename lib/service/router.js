/**
 * REST API Router
 *
 */
const url = require('url'),
	_ = require('lodash');

/**
 * Router class
 * @constructor Router
 * @param {Object} [routes] key-value pairs of API name and matched handlers
 * @return {Router} a new Router instance
 */
const Router = module.exports = class Router {
	
	constructor(routes) {
		let parser = [];
		let argsToStr = function(funcStr) {
			let args = funcStr.toString().match(/function\s.*?\(([^)]*)\)/)[1];
			let argsStr = args.split(",").map(function(arg) {
				return arg.replace(/\/\*.*\*\//, "").trim();
			}).filter(function(arg) {
				return arg;
			}).join('\/(.*)\/');
			return argsStr;
		};

		_.forEach(routes, (value, key) => {
			let argsStr = argsToStr(value);
			let reg = '\/(' + key + ')';
			if (argsStr.length > 0) {
				reg += '\/' + argsStr + '\/([^\/]+)$';
			} else {
				reg += '$';
			}
			parser.push(new RegExp(reg));
		});

		this.routeHandlers = routes;
		this.parser = parser;
	}

	route(path, service) {
		if (path === '/favicon.ico') {
			return '';
		}

		let handler = {};
		_.forEach(this.parser, (reg) => {
			if (reg.test(path)) {
				let params = reg.exec(path);
				let key = params[1];
				let args = _.slice(params, 2);
				handler.key = key;
				handler.args = args;
				return true;
			}
		});

		if (handler.key) {
			handler.args.push(service.robots);
			let content = this.routeHandlers[handler.key].apply(service, handler.args);
			return content;
		}
		
		throw new Error('Route ' + path + " not found, please check function name and arguments.");
	}

	toJSON() {
		let obj = {
			routes: this.parser
		};
		return obj;
	}
};