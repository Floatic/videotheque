'use strict'

//
// # Video entity
//
// Defines a video
//
//

let Video = function() {
	let _ = require('lodash');

	// Constructor
	let Video = function(data) {
		this._setProperties(data);
	}

	//
	// # Set video properties from json object
	//
	//

	Video.prototype._setProperties = function setProperties(data) {
		console.log(' ======================== data ====================');
		console.log(data);
		console.log('=======================================');
		_.assign(this, data.resource);
	};

	return Video;
}

module.exports = function(data) {
	return new Video(data);
}