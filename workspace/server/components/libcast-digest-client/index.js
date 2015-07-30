'use strict'

//
// # Libcast digest Client
//
// Basic communication with libcast and file creation
// by digest authentication.
//


let debug = require('debug')('client');
let util = require('util');

let Client = function() {
	// Load needed modules
	// let fs = require('fs');
	let parseXml = require('xml2js').parseString;
	let _ = require('lodash');
	let _string = require('underscore.string');
	let moment = require('moment');

	// Application paths
	const path_video = './lib/entity/video';

	// API paths
	const path_file = '/services/file/%(slug)s';
	const path_resource = '/services/resource/%(slug)s';
	const path_all_files = '/services/files';
	const path_all_resources = '/services/stream/%(stream)s/resources';


	// Constructor
	let Client = function(username, password) {
		this.host = 'https://console.libcast.com';
		this.port = 80;
		this.headers = '';
		this.username = username;
		this.password = password;
		this.digest = require('./lib/request-digest')(username, password);
	};


	//
	// # Upload
	//
	// Sends a POST request to the Libcast API
	//
	//

	Client.prototype.upload = function(file, video) {
		debug('======= UPLOAD ========');

		let self = this;

		return new Promise(function(resolve, reject) {
			let options = {
				method: 'POST',
				path: path_all_files,
				file: file
			};

			// Create the file
			debug('======= START SEND FILE ========');
			debug(options);
			self.digest.request(self._setRequestParams(options), function(err, response, body) {
				if (err) {
					debug('digest error : %s', err.message);
					debug(util.inspect(err));
					reject(err);
					return
				}

				// let Video = require('./entity/video')(stream, slug);
				// debug('Http code : ' + response.statusCode);

				if (response.statusCode !== 201) {
					debug('error response code %s', response.statusCode);
					debug(response);
					reject('error response code : ' + response.statusCode);
					return;
				}

				// debug('Http response : ');
				// debug(response);
				// debug('Http body : ');
				// debug(body);
				// debug('Writing request 2');
				// fs.writeFileSync('request2.txt', util.inspect(response));

				let fileInfo = self._parseResponse(body).file;

				debug(fileInfo);

				debug('======= FILE SENT ========');

				// Create a publication
				if (!fileInfo.slug) {
					debug('No slug');
					reject('No slug');
					return;
				}

				options = {
					method: 'POST',
					form: {
						file: fileInfo.slug,
						title: video.title,
						// subtitle: '',
						// published_at: moment().format() + '+01:00',
						visibility: (video.usage === 'communication') ? 'visible' : 'hidden'
					},
					path: self._setRequestUrl(path_all_resources, {
						'stream': (video.usage === 'communication') ? 'communication-1' : 'pedagogique'
					})
				};

				debug('======= START SEND PUBLICATION ========');
				self.digest.request(self._setRequestParams(options), function(err, response, body) {
					if (err) {
						debug('digest error : %s', err.message);
						reject(err);
						return;
					}

					if (response.statusCode !== 201) {
						debug('error response code %s', response.statusCode);
						debug(response);
						reject('error response code : ' + response.statusCode);
						return;
					}

					resolve(self._parseResponse(body));

					debug('======= PUBLICATION CREATED ========');
				});
			});
		});

	};

	//
	// # Get video data
	//
	// Sends a GET request to the Libcast API
	//
	//

	Client.prototype.show = function(slug) {
		debug('======= HEADERS ========');
		let self = this;
		let options = {
			method: 'GET',
			path: self._setRequestUrl(path_resource, {
				'slug': slug
			})
		};

		debug('----- options -------');
		debug(options);

		return new Promise(function(resolve, reject) {
			debug('======= PROMISE START ========');
			self.digest.request(self._setRequestParams(options), function(err, response, body) {
				if (err) {
					debug('digest error : %s', err.message);
					reject('show error : %s', err.message);
					return;
				}

				if (response.statusCode !== 200) {
					debug('error response code %s', response.statusCode);
					reject('show() problem, HTTP code ' + response.statusCode);
					return;
				}

				debug('Trigger resolve');
				resolve(self._parseResponse(body));

				return true;
			});
		});
	};

	//
	// # Get video data
	//
	// Uses _getFiles and _getResources
	//
	//

	Client.prototype.getVideoData = function() {
		let self = this;

		return new Promise(function(resolve, reject) {
			// Get files data
			self._getData(path_all_files).then(function(fileList) {
				resolve(fileList);
			});
		});
	};

	//
	// # Update video
	//
	// Sends a PUT request to the Libcast API
	//
	//

	Client.prototype.update = function(Video) {

	};


	//
	// # Destroy video
	//
	// Sends a DELETE request to the Libcast API
	//
	//

	Client.prototype.destroy = function(Video) {

	};


	//
	// # Set video to draft mode
	//
	// Sends a PUT request to the Libcast API
	//
	//

	Client.prototype.setDraft = function(Video) {

	};

	//
	// # Load a video object from response
	//
	// Returns a Video object
	//
	//

	Client.prototype.loadVideo = function(data) {
		return require(path_video)(data);
	};

	//
	// # Get video data
	//
	// Sends a GET request to the Libcast API
	//
	//

	Client.prototype._getData = function getData(path) {
		let self = this;
		let options = {
			method: 'GET',
			path: path
		};

		// Set a promise to be handled
		return new Promise(function(resolve, reject) {
			debug('======= START GET DATA for %s ========', path);
			self.digest.request(self._setRequestParams(options), function(err, response, body) {
				if (err) {
					debug('digest error : %s', err.message);
					throw err;
				}

				if (response.statusCode !== 200) {
					debug('error response code %s', response.statusCode);
					reject('Problem, HTTP code ' + response.statusCode);
					return;
				}

				debug('Trigger resolve');
				resolve(self._parseResponse(body));

				return true;
			});
		});
	};


	//
	// # Sets request params
	//
	// Returns an object to be given to the digest request
	//
	//

	Client.prototype._setRequestParams = function setRequestParams(options) {
		_.merge(options, {
			host: this.host,
			port: this.port
				// headers: {
				//     Accept: 'application/vnd.libcast+x-yaml'
				// }
		});

		return options;
	};

	//
	// # Sets API url
	//
	// Returns a libcast url to be requested
	//
	//

	Client.prototype._setRequestUrl = function setRequestUrl(url, params) {
		return _string.sprintf(url, params);
	};

	//
	// # Formats an xml response into json
	//
	// Returns a json object
	//
	//

	Client.prototype._parseResponse = function parseResponse(res) {
		let parsed;

		parseXml(res, function(err, result) {
			parsed = result;
		});

		return this._cleanResponse(parsed);
		// return parsed;
	};

	//
	// # Cleans a data object parsed from xml
	//
	// Returns a json object
	//
	// code from http://stackoverflow.com/questions/20238493/xml2js-how-is-the-output
	//

	Client.prototype._cleanResponse = function cleanResponse(xml) {
		let keys = Object.keys(xml),
			o = 0,
			k = keys.length,
			node, value, singulars,
			l = -1,
			i = -1,
			s = -1,
			e = -1,
			isInt = /^-?\s*\d+$/,
			isDig = /^(-?\s*\d*\.?\d*)$/,
			radix = 10;

		for (; o < k; ++o) {
			node = keys[o];

			if (xml[node] instanceof Array && xml[node].length === 1) {
				xml[node] = xml[node][0];
			}

			if (xml[node] instanceof Object) {
				value = Object.keys(xml[node]);

				if (value.length === 1) {
					l = node.length;

					singulars = [
						node.substring(0, l - 1),
						node.substring(0, l - 3) + 'y'
					];

					i = singulars.indexOf(value[0]);

					if (i !== -1) {
						xml[node] = xml[node][singulars[i]];
					}
				}
			}

			if (typeof(xml[node]) === 'object') {
				xml[node] = this._cleanResponse(xml[node]);
			}

			if (typeof(xml[node]) === 'string') {
				value = xml[node].trim();

				if (value.match(isDig)) {
					if (value.match(isInt)) {
						if (Math.abs(parseInt(value, radix)) <= Number.MAX_SAFE_INTEGER) {
							xml[node] = parseInt(value, radix);
						}
					} else {
						l = value.length;

						if (l <= 15) {
							xml[node] = parseFloat(value);
						} else {
							for (i = 0, s = -1, e = -1; i < l && e - s <= 15; ++i) {
								if (value.charAt(i) > 0) {
									if (s === -1) {
										s = i;
									} else {
										e = i;
									}
								}
							}

							if (e - s <= 15) {
								xml[node] = parseFloat(value);
							}
						}
					}
				}
			}
		}

		return xml;
	};

	return Client;
}();

module.exports = function(username, password) {
	// debug('client load');
	let client = new Client(username, password);
	// debug(util.inspect(test));
	return client;
};