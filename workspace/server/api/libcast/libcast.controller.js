'use strict';

//var _ = require('lodash');
// var digestRequest = require('request-digest')('guillaume.burguiere@oatic.fr', '3NEgF7THxtBKMwRm2SqmpvLSI0ff3y6v');
// var fs = require('fs');
var util = require('util');
var debug = require('debug')('http');
var client = require('server/components/libcast-digest-client');

exports.index = function(req, res) {
	debug('passe dans controller');
	debug('Client type : ', typeof client);

	client.show('laccueil-du-stagiaire-a-lafpa')
		.then(function(data) {
			debug('Promise success');
			debug('Response type : %s', typeof data);
			let Video = client.loadVideo(data);
			// debug(Video);
			res.json(Video);
			// res.send('success');
		})
		.catch(function(error) {
			debug(error);
			res.status(500).send(error.message);
		});
	//debug(fs.existsSync('./server/components/libcast-digest-client'));

}

// curl --digest -v -u guillaume.burguiere@oatic.fr:3NEgF7THxtBKMwRm2SqmpvLSI0ff3y6v https://console.libcast.com/services/resource/laccueil-du-stagiaire-a-lafpa


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