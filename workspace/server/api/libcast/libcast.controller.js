'use strict';

//var _ = require('lodash');
var digestRequest = require('request-digest')('guillaume.burguiere@oatic.fr', '3NEgF7THxtBKMwRm2SqmpvLSI0ff3y6v');
var fs = require('fs');
var util = require('util');

// Get list of libcasts
exports.index = function (req, res) {

    digestRequest.request({
        host: 'https://console.libcast.com',
        path: '/services/stream/ma-chaine-2247/resources',
        port: 80,
        method: 'GET',
        headers: {
            Accept: 'application/vnd.libcast+x-yaml'
        }
    }, function (error, response, body) {
        if (error) {
            throw error;
        }

        console.log('Http code : ' + response.statusCode);
//        console.log('Writing request 2');
//
//        fs.writeFileSync('request2.txt', util.inspect(response));

        console.log(body);
    });

    res.json([]);
};