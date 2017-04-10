const _ = require('lodash');

const Tools = module.exports = {
	
	uniqueName: function(name, arr) {
		let newName;
		if (!~arr.indexOf(name)) {
			return name;
		}
		for (let i = 1; ; i++) {
			newName = name + '-' + i;
			if (!~arr.indexOf(name)) {
				return newName;
			}
		}
	},

	listToJSON: function(list) {
		let jsonList = [];
		_.forEach(list, (val) => {
			jsonList.push(val.toJSON());
		});
		return jsonList;
	}

}