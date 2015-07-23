'use strict';

//let _ = require('lodash');
let fs = require('fs');
// let util = require('util');
let debug = require('debug')('libcastcontroller');
let client = require('server/components/libcast-digest-client');
let listeVideoPath = 'server/components/data/videos.txt';
let filePath = 'server/uploads/';

//
// # Index
//
// Manage GET requests
//
//

exports.index = function(req, res) {
	debug('passe dans index');
	debug('Client type : ', typeof client);

	client.show('laccueil-du-stagiaire-a-lafpa')
		.then(function(data) {
			debug('Promise success');
			debug('Response type : %s', typeof data);
			let video = client.loadVideo(data.resource);
			// debug(Video);
			res.json(video);
		})
		.catch(function(error) {
			debug(error);
			res.status(500).send(error.message);
		});
	//debug(fs.existsSync('./server/components/libcast-digest-client'));

};

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

		// We want to save the video data in a video.txt file
		fs.readFile(listeVideoPath, function(err, data) {
			debug('===== start readfile ====');
			if (err) {
				debug('readFile error : %s', err.message);
				res.json({
					'success': false
				});
				throw err;
			}

			// Append the data to the file
			let prefix = (data === '') ? '' : ',';
			fs.appendFile(listeVideoPath, prefix + JSON.stringify(fileData), function(err) {
				debug('===== start appendFile ====');
				if (err) {
					res.json({
						'success': false
					});
					throw err;
				}

				res.json({
					'success': true
				});
			});
		});

		// Setup video
		let video = client.loadVideo(fileData);
		let videoPath = filePath + video.filename;

		// Send the video to libcast
		debug('------- load client upload -------');
		debug('Video path : %s', videoPath);
		client.upload(videoPath, video);
	}
};

// curl --digest -v -u guillaume.burguiere@oatic.fr:3NEgF7THxtBKMwRm2SqmpvLSI0ff3y6v https://console.libcast.com/services/resource/laccueil-du-stagiaire-a-lafpa
// curl --digest -v -u guillaume.burguiere@oatic.fr:3NEgF7THxtBKMwRm2SqmpvLSI0ff3y6v -X POST -H Authorization: 'Digest username="guillaume.burguiere@oatic.fr",realm="Libcast",nonce="98b8413cb83a330b5d7060d68e7b8455",uri="/services/stream/communication-1/resources",qop=auth,opaque="94619f8a70068b2591c2eed622525b0e",response="f97948a8f63eec2261ba8cccd3bd4aa8",algorithm="MD5",nc=00000002,cnonce="67b9bcf9"' -F file="2015-07-22_15-38-00_samplevideo_1080x720_1mb-mp4" -F title="mon titre" -F visibility="visible"  https://console.libcast.com/services/stream/communication-1/resources


// Get list of libcasts
//exports.index = function (req, res) {
//
//    digestRequest.request({
//        host: 'https://console.libcast.com',
//        path: '/services/stream/ma-chaine-2247/resources',
//        port: 80,
//        method: 'GET',
//        headers: {
//            Accept: 'application/vnd.libcast+x-yaml'
//        }
//    }, function (error, response, body) {
//        if (error) {
//            throw error;
//        }
//
//        debug('Http code : ' + response.statusCode);
////        debug('Writing request 2');
////
////        fs.writeFileSync('request2.txt', util.inspect(response));
//
//        debug(body);
//    });
//
//    res.json([]);
//};