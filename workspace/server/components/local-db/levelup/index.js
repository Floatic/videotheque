'use strict'

//
// # Levelup db model
//
// Stores video data
//
//


// Load needed modules
let _ = require('lodash');
let debug = require('debug')('levelup');
let level = require('level');

// Paths
const path_data = './data/';

// Constructor
function Levelup(id) {
	this.db = level(path_data + id, {
		valueEncoding: 'json'
	});
}

//
// # Creates a new db and stores data into it
//
// @key : the key that will serve as reference
// @data : json object
//

Levelup.prototype.add = function(key, data, callback) {
	debug('======= ADD DATA ========');

	this.db.put(key, data, function(err) {
		callback(err);
	});
};

//
// # Exports all lines as json object
//
// @return : json object
//

Levelup.prototype.export = function() {
	let dataObject = {};

	return new Promise(function(resolve, reject) {
		this.db.createReadStream()
			.on('data', function(data) {
				dataObject[data.key] = data.value;
			})
			.on('error', function(err) {
				reject('db export error : %s', err.message);
			})
			.on('end', function() {
				resolve(dataObject);
			});
	});
}

//
// # Gets one value from db
//
// @return : json object
//

Levelup.prototype.get = function(id, callback) {
	return this.db.get(id, function(err, value) {
		if (err) {
			if (err.notFound) {
				// handle a 'NotFoundError' here
				return '';
			}
			// I/O or other error, pass it up the callback chain
			return callback(err);
		}

		return value;
	})
};


module.exports = Levelup;