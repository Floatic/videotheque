'use strict'

//
// # Video entity
//
// Defines a video
//
//

let debug = require('debug')('video');

let Video = function() {
	let _ = require('lodash');

	// Constructor
	let Video = function(data) {
		debug('before set properties');
		this._setProperties(data);
		debug('after set properties');
	}

	//
	// # Update video properties from json object
	//
	//

	Video.prototype.updateProperties = function (data) {
		debug('Update properties');
		this._setProperties(data);
		debug('video slug : %s', this.slug);
	};

	//
	// # Set video properties from json object
	//
	//

	Video.prototype._setProperties = function setProperties(data) {
		debug('Set properties');
		_.assign(this, data);
		debug('video slug : %s', this.slug);
	};

	return Video;
}();

module.exports = function(data) {
	debug('loading video');
	return new Video(data);
}