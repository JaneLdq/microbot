var _ = require('lodash');

var test = function(a, b, c) {
	a = b+c;
};

function route(routes) {
	var routeRegs = new Array();

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
			reg + '\/' + argsStr + '\/([^\/]+)$';
		}
		routeRegs.push(new RegExp(reg));
	});
	return routeRegs;
};

var routes = {
	getT: function() {
	},
	getH: function(c, d) {
		c = c - d;
	}
}

var result = route(routes);
var testStr = "/getT";
var params = result[0].exec(testStr);