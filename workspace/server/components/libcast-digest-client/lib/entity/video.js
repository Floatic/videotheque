'use strict'

//
// # Video entity
//
// Defines a video
//
//

var debug = require('debug')('video');

let Video = function() {
	let _ = require('lodash');

	// Constructor
	let Video = function(data) {
		debug('before set properties');
		this._setProperties(data);
		debug('after set properties');
	}

	//
	// # Set video properties from json object
	//
	//

	Video.prototype._setProperties = function setProperties(data) {
		debug('Set properties');
		_.assign(this, data.resource);
		debug('video slug : %s', this.slug);
	};

	return Video;
}();

module.exports = function(data) {
	debug('loading video');
	return new Video(data);
}