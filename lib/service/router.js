/**
 * REST API Router
 * 
 * TODO
 *
 */

var url = require('url'),
	_ = require('lodash');

var Router = module.exports = function Router(routes) {
	
	var parser = new Array();
	var argsToStr = function(funcStr) {
		var args = funcStr.toString().match(/function\s.*?\(([^)]*)\)/)[1];
		var argsStr = args.split(",").map(function(arg) {
			return arg.replace(/\/\*.*\*\//, "").trim();
		}).filter(function(arg) {
			return arg;
		}).join('\/(.*)\/');
		return argsStr;
	};

	_.forEach(routes, function(value, key) {
		var argsStr = argsToStr(value);
		var reg = '\/(' + key + ')';
		if (argsStr.length > 0) {
			reg += '\/' + argsStr + '\/([^\/]+)$';
		}
		parser.push(new RegExp(reg));
	});

	this.routeHandlers = routes;
	this.parser = parser;
}

Router.prototype.route = function(path, service) {
	if (path === '/favicon.ico') {
		return '';
	}

	var handler = {};
	_.forEach(this.parser, function(reg) {
		if (reg.test(path)) {
			var params = reg.exec(path);
			var key = params[1];
			var args = _.slice(params, 2);
			handler.key = key;
			handler.args = args;
			return true;
		}
	});

	if (handler.key) {
		handler.args.push(service.robots);
		var content = this.routeHandlers[handler.key].apply(service, handler.args);
		return content;
	}
	
	return 'Route ' + path + " not found, please check function name and arguments.";
};