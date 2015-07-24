'use strict'

//
// # Libcast digest Client
//
// Basic communication with libcast and file creation
// by digest authentication.
//

module.exports = function(username, password) {
	require('./lib/client')(username, password);
}

// module.exports = require('test');