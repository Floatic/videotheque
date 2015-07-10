'use strict';

var _ = require('lodash');

// Get list of libcasts
exports.index = function (req, res) {
    console.log('passe');
    var digestRequest = require('request-digest')('guillaume.burguiere@oatic.fr', '3NEgF7THxtBKMwRm2SqmpvLSI0ff3y6v');
    digestRequest.request({
      host: 'https://console.libcast.com',
      path: '/services/',
      port: 80,
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.libcast+json'
      }
    }, function (error, response, body) {
      if (error) {
        throw error;
      }

      console.log(response);
      console.log(body);
    });

    res.json([]);
};