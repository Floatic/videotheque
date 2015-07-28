'use strict';

// DEBUG command
// DEBUG=libcastcontroller,requestdigest,client,video,levelup node --harmony server/app.js

// CURL examples
// curl --digest -v -u guillaume.burguiere@oatic.fr:3NEgF7THxtBKMwRm2SqmpvLSI0ff3y6v https://console.libcast.com/services/resource/laccueil-du-stagiaire-a-lafpa
// curl --digest -v -u guillaume.burguiere@oatic.fr:3NEgF7THxtBKMwRm2SqmpvLSI0ff3y6v -X POST -H Authorization: 'Digest username="guillaume.burguiere@oatic.fr",realm="Libcast",nonce="a4005d7ce911031bc1bb813728a932b4",uri="/services/stream/pedagogique/resources",qop=auth,opaque="94619f8a70068b2591c2eed622525b0e",response="702824622b8610fbdd687e3de2d04812",algorithm="MD5",nc=00000006,cnonce="33c639ba"' -F file="2015-07-28_07-51-27_samplevideo_1080x720_1mb-mp4" -F title="mon titre" -F visibility="visible"  https://console.libcast.com/services/stream/pedagogique/resources

let _ = require('lodash');
let _string = require('underscore.string');
let fs = require('fs');
let util = require('util');
let debug = require('debug')('libcastcontroller');
let client = require('server/components/libcast-digest-client')('guillaume.burguiere@oatic.fr', '3NEgF7THxtBKMwRm2SqmpvLSI0ff3y6v');
let Levelup = require('server/components/local-db/levelup');
let db = new Levelup('guillaume.burguiere@oatic.fr');
// let listeVideoPath = 'server/components/data/videos.txt';
let filePath = 'server/uploads/';
let Entities = require('html-entities').AllHtmlEntities;

//
// # Index
//
// Manage GET requests
//
//

exports.index = function(req, res) {
	debug('passe dans index');
	debug('Client type : ', typeof client);

	let slug = req.params.slug;
	let entities = new Entities();

	client.show(slug)
		.then(function(data) {
			debug('Promise success');

			// Html decode embed code
			debug("====before");
			debug(data.resource.embed);
			data.resource.widgets.widget._ = _parseEmbed(data.resource.widgets.widget._);
			debug('====after');
			debug(data.resource.embed);

			// Get db data
			db.export().then(function(localData) {
				debug('Local data');
				debug(localData[slug]);

				res.json(_.merge({}, data.resource, localData[slug]));
			});

		})
		.catch(function(error) {
			debug('error : %s', error.message);
			res.status(500).send(error.message);
		});
	//debug(fs.existsSync('./server/components/libcast-digest-client'));

};

//
// # Parse embed object to allow copy/pasting
//
//
//

function _parseEmbed(embed) {
	// Decode uri characters
	embed = decodeURIComponent(embed);

	debug('====== _parseEmbed Decode uri ==========');
	debug(embed);

	// Remove +
	let tmp = '';
	_.forEach(embed, function(value, key){
		tmp += value.replace('+', ' ');
	});

	debug('====== _parseEmbed replaceAll ==========');
	debug(tmp);


	return tmp;
}


//
// # List
//
// Get the uploaded video list
//
//

exports.list = function(req, res) {
	// Clean db
	_cleanDb();

	// Ask the files to the client
	client.getVideoData()
		.then(function(data) {
			debug('Promise success');
			// debug(util.inspect(data));

			// Set file list
			debug('========== SETUP FILELIST ==========');

			let fileList = {};

			_.forEach(data.files.file, function(file, index) {
				// for(let file of data) {

				debug(util.inspect(file));

				if (file.slug !== undefined && file.type === 'video') {
					// Delete data we don't need to avoid overloads later
					delete file.slug;

					// Save file
					fileList[file.name] = file;
				}
			});

			debug(util.inspect(fileList));

			// Get the data from our db and merge them with those from libcast
			debug('========== SETUP VIDEOLIST ==========');

			db.export().then(function(videoList) {
				// fs.readFile(listeVideoPath, function(err, data) {
				/*if (err) {
					debug('error : %s', err.message);
				    res.json({
				        'success': false
				    });
				    throw err;
				}*/

				// Prepare file data
				// let videoList = JSON.parse('{' + _.trimLeft(data, ',') + '}');

				// Merge the data
				videoList = _.merge({}, videoList, fileList);

				// Remove videos without data
				let finalList = {};
				_.forEach(videoList, function(video, fileName) {
					if (video.title !== undefined) {
						finalList[fileName] = video;
					}
				});

				res.json(finalList);
			});
		})
		.catch(function(error) {
			debug(error);
			res.status(500).send(error.message);
		});
};


//
// # Clean db
//
// Removes manually deleted files entries
//
//

function _cleanDb() {
	db.export().then(function(videoList) {
		let files = fs.readdirSync(filePath);
		// debug(files);
		// debug(videoList);
		_.forEach(videoList, function(data, filename) {
			// debug('== File : %s ==', filename);
			if (_.indexOf(files, filename) === -1) {
				debug('== DELETE : %s ==', filename);
				db.delete(filename);
			}
		});
	});
}


//
// # Create
//
// Manage POST requests
//
//

exports.create = function(req, res) {
	if (req.files.file && req.body.fileData) {
		let fileData = JSON.parse(req.body.fileData);

		// Append server filename to filedata
		fileData.filename = req.files.file.name;
		fileData.filesize = req.files.file.size;

		debug(fileData);

		// We want to save the video data in a video.txt file
		db.add(fileData.filename, fileData, function(err) {
			if (err) {
				debug('data save error : %s', err.message);

				res.status(500).send('error');
				// throw err;
			}

			debug('======= DATA SAVED ========');
		});

		// Setup video
		let video = client.loadVideo(fileData);
		let videoPath = filePath + video.filename;

		// Send the video to libcast
		debug('------- load client upload -------');
		debug('Video path : %s', videoPath);
		client.upload(videoPath, video)
			.then(function(uploaded) {
				// Add slug in db when upload complete
				fileData.slug = uploaded.slug;
				db.add(fileData.filename, fileData, function(err) {
					if (err) {
						debug('slug save error : %s', err.message);

						res.status(500).send(err.message);
						return;
					}

					debug('======= SLUG SAVED ========');

					res.send(true);
				});
			})
			.catch(function(err) {
				if (err instanceof Error) {
					debug('upload error : %s', err.message);
				} else {
					debug(err);
				}

				res.status(500).send(err.message);
			});
	}
};