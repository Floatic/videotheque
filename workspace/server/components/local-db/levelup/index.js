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
let util = require('util');
let level = require('level');
let LevelHUD = require('levelhud');

// Paths
const path_data = __dirname + '/data/';

// Constructor
function Levelup(id, port) {
	debug('Load db : %s', path_data + id);

	this.db = level(path_data + id, {
		valueEncoding: 'json'
	}, function(err) {
		if (err) {
			debug('Create db problem : %s', err.message);
			throw err;
		}

		debug('--------- db %s loaded ----------', id);
	});

	// Load hud
	new LevelHUD().use(this.db).listen(port);
}

//
// # Creates a new db and stores data into it
//
// @key : the key that will serve as reference
// @data : json object
//

Levelup.prototype.add = function(key, data, callback) {
	debug('======= ADD DATA : %s ========', key);

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
	let self = this;

	debug('========= EXPORT =======');

	return new Promise(function(resolve, reject) {
		debug('========= LOAD DATA OBJECT =======');

		self.db.createReadStream()
			.on('data', function(data) {
				dataObject[data.key] = data.value;
				// debug('Key : %s', data.key);
				// debug('Value : %s', data.value);
			})
			.on('error', function(err) {
				reject('db export error : %s', err.message);
			})
			.on('end', function() {
				debug('end;');
				resolve(dataObject);
			});
	});
}

//
// # Gets one value from db
//
// @return : json object
//

Levelup.prototype.get = function(id) {
	let self = this;

	return new Promise(function(resolve, reject) {
		self.db.get(id, function(err, value) {
			if (err) {
				if (err.notFound) {
					// handle a 'NotFoundError' here
					resolve('');
				}
				// I/O or other error, pass it up the callback chain
				reject(err.message);
				return;
			}

			resolve(value);

			return true;
		})
	})
};

//
// # Deletes a value from db
//
// @return : boolean
//

Levelup.prototype.delete = function(id) {
	this.db.del(id, function(err) {
		if (err) {
			throw err;
		}
	});
};


module.exports = Levelup;