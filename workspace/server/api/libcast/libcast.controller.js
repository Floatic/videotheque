'use strict';

//var _ = require('lodash');
// var digestRequest = require('request-digest')('guillaume.burguiere@oatic.fr', '3NEgF7THxtBKMwRm2SqmpvLSI0ff3y6v');
var fs = require('fs');
var util = require('util');



var client = require('libcast-digest-client');

exports.index = function(req, res) {
	console.log('passe dans controller');
	client.show('laccueil-du-stagiaire-a-lafpa')
		.then(function(res) {
			// console.log(res);
			// res.json([]);
			let Video = client.loadVideo(res);
			console.log(Video);
			res.send(Video);
		})
		.catch(function(error) {
			console.log(error);
			res.status(500).send(error.message);
		});
	//console.log(fs.existsSync('./server/components/libcast-digest-client'));

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
//        console.log('Http code : ' + response.statusCode);
////        console.log('Writing request 2');
////
////        fs.writeFileSync('request2.txt', util.inspect(response));
//
//        console.log(body);
//    });
//
//    res.json([]);
//};